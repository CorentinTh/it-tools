import { parseDocument } from 'yaml';
import type { DockerConverterMessage } from './docker-converter.worker.protocol';
import { isUnknownRecord } from '@/utils/worker-protocol';

export interface ComposeToRunResult {
  commands: string
  messages: DockerConverterMessage[]
}

const SAFE_SHELL_TOKEN = /^[A-Za-z0-9_@%+=:,./-]+$/;
const MAX_COMPOSE_SERVICES = 50;
const MAX_OPTIONS_PER_SECTION = 1_000;

export function quoteShellToken(value: string): string {
  if (value !== '' && SAFE_SHELL_TOKEN.test(value)) {
    return value;
  }
  return `'${value.replace(/'/g, '\'"\'"\'')}'`;
}

function scalar(value: unknown, field: string): string {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  throw new Error(`${field} must be a string, number, or boolean.`);
}

function boundedArray(value: unknown, field: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new TypeError(`${field} must be an array.`);
  }
  if (value.length > MAX_OPTIONS_PER_SECTION) {
    throw new Error(`${field} exceeds ${MAX_OPTIONS_PER_SECTION} entries.`);
  }
  return value;
}

function addFlag(tokens: string[], flag: string, value: string): void {
  tokens.push(flag, quoteShellToken(value));
}

function addPorts(tokens: string[], ports: unknown): void {
  for (const port of boundedArray(ports, 'ports')) {
    if (typeof port === 'string' || typeof port === 'number') {
      addFlag(tokens, '-p', String(port));
      continue;
    }
    if (!isUnknownRecord(port)) {
      throw new Error('Each port must be a short string or Compose port object.');
    }
    const target = scalar(port.target, 'ports[].target');
    const published = port.published === undefined ? undefined : scalar(port.published, 'ports[].published');
    const hostIp = port.host_ip === undefined ? undefined : scalar(port.host_ip, 'ports[].host_ip');
    const protocol = port.protocol === undefined ? undefined : scalar(port.protocol, 'ports[].protocol');
    let value = [hostIp, published, target].filter(item => item !== undefined).join(':');
    if (protocol && protocol !== 'tcp') {
      value += `/${protocol}`;
    }
    addFlag(tokens, '-p', value);
  }
}

function addVolumes(tokens: string[], volumes: unknown): void {
  for (const volume of boundedArray(volumes, 'volumes')) {
    if (typeof volume === 'string') {
      addFlag(tokens, '-v', volume);
      continue;
    }
    if (!isUnknownRecord(volume)) {
      throw new Error('Each volume must be a short string or Compose volume object.');
    }
    const target = scalar(volume.target, 'volumes[].target');
    const source = volume.source === undefined ? undefined : scalar(volume.source, 'volumes[].source');
    let value = source ? `${source}:${target}` : target;
    if (volume.read_only === true) {
      value += ':ro';
    }
    addFlag(tokens, '-v', value);
  }
}

function addEnvironment(tokens: string[], environment: unknown): void {
  if (Array.isArray(environment)) {
    for (const entry of boundedArray(environment, 'environment')) {
      addFlag(tokens, '-e', scalar(entry, 'environment[]'));
    }
    return;
  }
  if (!isUnknownRecord(environment)) {
    throw new Error('environment must be a mapping or array.');
  }
  const entries = Object.entries(environment);
  if (entries.length > MAX_OPTIONS_PER_SECTION) {
    throw new Error(`environment exceeds ${MAX_OPTIONS_PER_SECTION} entries.`);
  }
  for (const [key, value] of entries) {
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
      throw new Error(`Environment key ${key} is not valid for docker run.`);
    }
    addFlag(tokens, '-e', value === null ? key : `${key}=${scalar(value, `environment.${key}`)}`);
  }
}

function addStringOrArray(tokens: string[], value: unknown, field: string): void {
  if (typeof value === 'string') {
    tokens.push('sh', '-c', quoteShellToken(value));
    return;
  }
  for (const item of boundedArray(value, field)) {
    tokens.push(quoteShellToken(scalar(item, `${field}[]`)));
  }
}

function serviceToCommand(serviceName: string, service: Record<string, unknown>, messages: DockerConverterMessage[]): string {
  const tokens = ['docker', 'run'];
  if (service.container_name !== undefined) {
    addFlag(tokens, '--name', scalar(service.container_name, 'container_name'));
  }
  if (service.hostname !== undefined) {
    addFlag(tokens, '--hostname', scalar(service.hostname, 'hostname'));
  }
  if (service.restart !== undefined && service.restart !== 'no') {
    addFlag(tokens, '--restart', scalar(service.restart, 'restart'));
  }
  if (service.working_dir !== undefined) {
    addFlag(tokens, '--workdir', scalar(service.working_dir, 'working_dir'));
  }
  if (service.user !== undefined) {
    addFlag(tokens, '--user', scalar(service.user, 'user'));
  }
  if (service.ports !== undefined) {
    addPorts(tokens, service.ports);
  }
  if (service.volumes !== undefined) {
    addVolumes(tokens, service.volumes);
  }
  if (service.environment !== undefined) {
    addEnvironment(tokens, service.environment);
  }
  if (service.env_file !== undefined) {
    const files = Array.isArray(service.env_file) ? boundedArray(service.env_file, 'env_file') : [service.env_file];
    for (const file of files) {
      addFlag(tokens, '--env-file', scalar(file, 'env_file[]'));
    }
  }
  if (service.entrypoint !== undefined) {
    const entrypoint = Array.isArray(service.entrypoint)
      ? boundedArray(service.entrypoint, 'entrypoint').map(item => scalar(item, 'entrypoint[]')).join(' ')
      : scalar(service.entrypoint, 'entrypoint');
    addFlag(tokens, '--entrypoint', entrypoint);
  }

  if (service.image === undefined) {
    throw new Error(`Service ${serviceName} needs an image to become a docker run command.`);
  }
  tokens.push(quoteShellToken(scalar(service.image, 'image')));
  if (service.command !== undefined) {
    addStringOrArray(tokens, service.command, 'command');
  }

  const supported = new Set([
    'command', 'container_name', 'entrypoint', 'env_file', 'environment', 'hostname', 'image', 'ports', 'restart', 'user', 'volumes', 'working_dir',
  ]);
  for (const key of Object.keys(service)) {
    if (!supported.has(key)) {
      messages.push({ type: 'notImplemented', value: `Service ${serviceName}: Compose field "${key}" was not translated.` });
    }
  }

  return tokens.map((token, index) => index < 2 ? token : `  ${token}`).join(' \\\n');
}

export function convertComposeToDockerRun(source: string): ComposeToRunResult {
  const document = parseDocument(source, { prettyErrors: false });
  if (document.errors.length > 0) {
    throw new Error('The Compose YAML is invalid.');
  }
  const parsed: unknown = document.toJS({ maxAliasCount: 100 });
  if (!isUnknownRecord(parsed) || !isUnknownRecord(parsed.services)) {
    throw new Error('The Compose document must contain a services mapping.');
  }
  const services = Object.entries(parsed.services);
  if (services.length < 1 || services.length > MAX_COMPOSE_SERVICES) {
    throw new Error(`Compose documents must contain between 1 and ${MAX_COMPOSE_SERVICES} services.`);
  }

  const messages: DockerConverterMessage[] = [];
  const commands = services.map(([name, service]) => {
    if (!isUnknownRecord(service)) {
      throw new Error(`Service ${name} must be a mapping.`);
    }
    const command = serviceToCommand(name, service, messages);
    return services.length === 1 ? command : `# service: ${name}\n${command}`;
  });
  return { commands: commands.join('\n\n'), messages };
}
