import { parseDocument } from 'yaml';
import { isUnknownRecord } from '@/utils/worker-protocol';

const HTTP_METHODS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'] as const;
const MAX_NODES = 50_000;
const MAX_DEPTH = 64;
const MAX_ENDPOINTS = 1_000;
const MAX_EXAMPLE_DEPTH = 8;
const FORBIDDEN_POINTER_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

interface OpenApiEndpoint {
  method: string
  path: string
  operation: Record<string, unknown>
  pathItem: Record<string, unknown>
}

function parseSource(source: string): Record<string, unknown> {
  let value: unknown;
  if (source.trimStart().startsWith('{')) {
    try {
      value = JSON.parse(source);
    }
    catch {
      throw new TypeError('The OpenAPI JSON is invalid.');
    }
  }
  else {
    const document = parseDocument(source, { prettyErrors: false });
    if (document.errors.length > 0) {
      throw new TypeError('The OpenAPI YAML is invalid.');
    }
    value = document.toJS({ maxAliasCount: 100 });
  }
  if (!isUnknownRecord(value)) {
    throw new TypeError('The OpenAPI document root must be an object.');
  }
  assertBoundedTree(value);
  return value;
}

function assertBoundedTree(root: unknown) {
  let nodes = 0;
  const stack: Array<{ depth: number; value: unknown }> = [{ depth: 0, value: root }];
  while (stack.length) {
    const current = stack.pop()!;
    nodes += 1;
    if (nodes > MAX_NODES || current.depth > MAX_DEPTH) {
      throw new RangeError('The OpenAPI document is too large or deeply nested.');
    }
    if (Array.isArray(current.value)) {
      current.value.forEach(value => stack.push({ depth: current.depth + 1, value }));
    }
    else if (isUnknownRecord(current.value)) {
      Object.values(current.value).forEach(value => stack.push({ depth: current.depth + 1, value }));
    }
  }
}

function resolveLocalReference(root: Record<string, unknown>, value: unknown): unknown {
  if (!isUnknownRecord(value) || typeof value.$ref !== 'string') {
    return value;
  }
  if (!value.$ref.startsWith('#/')) {
    throw new TypeError(`External reference "${value.$ref.slice(0, 160)}" is not resolved; this inspector is local-only.`);
  }
  let selected: unknown = root;
  for (const rawToken of value.$ref.slice(2).split('/')) {
    if (/~(?:[^01]|$)/u.test(rawToken)) {
      throw new TypeError('The document contains an invalid local JSON Pointer.');
    }
    const token = rawToken.replace(/~1/gu, '/').replace(/~0/gu, '~');
    if (FORBIDDEN_POINTER_KEYS.has(token) || !isUnknownRecord(selected) || !Object.prototype.hasOwnProperty.call(selected, token)) {
      throw new TypeError(`Local reference "${value.$ref.slice(0, 160)}" does not resolve safely.`);
    }
    selected = selected[token];
  }
  return selected;
}

function collectEndpoints(root: Record<string, unknown>, issues: string[]) {
  if (!isUnknownRecord(root.paths)) {
    issues.push('paths must be an object.');
    return [];
  }
  const endpoints: OpenApiEndpoint[] = [];
  for (const [path, rawPathItem] of Object.entries(root.paths)) {
    if (!path.startsWith('/')) {
      issues.push(`Path "${path.slice(0, 120)}" should begin with /.`);
    }
    let pathItem: unknown;
    try {
      pathItem = resolveLocalReference(root, rawPathItem);
    }
    catch (error) {
      issues.push(error instanceof Error ? error.message : `Path "${path.slice(0, 120)}" could not be resolved.`);
      continue;
    }
    if (!isUnknownRecord(pathItem)) {
      issues.push(`Path "${path.slice(0, 120)}" must map to an object.`);
      continue;
    }
    for (const method of HTTP_METHODS) {
      if (pathItem[method] === undefined) {
        continue;
      }
      const operation = resolveLocalReference(root, pathItem[method]);
      if (!isUnknownRecord(operation)) {
        issues.push(`${method.toUpperCase()} ${path} must be an operation object.`);
        continue;
      }
      endpoints.push({ method: method.toUpperCase(), operation, path, pathItem });
      if (endpoints.length > MAX_ENDPOINTS) {
        throw new RangeError(`OpenAPI inspection is limited to ${MAX_ENDPOINTS.toLocaleString('en-US')} operations.`);
      }
    }
  }
  return endpoints;
}

function structuralIssues(root: Record<string, unknown>) {
  const issues: string[] = [];
  if (typeof root.openapi !== 'string' || !/^3\.(?:0|1)\.\d+(?:[-+].*)?$/u.test(root.openapi)) {
    issues.push('openapi must declare a supported 3.0.x or 3.1.x version.');
  }
  if (!isUnknownRecord(root.info)) {
    issues.push('info must be an object.');
  }
  else {
    if (typeof root.info.title !== 'string' || root.info.title.trim() === '') {
      issues.push('info.title must be a non-empty string.');
    }
    if (typeof root.info.version !== 'string' || root.info.version.trim() === '') {
      issues.push('info.version must be a non-empty string.');
    }
  }
  return issues;
}

function parameterExample(root: Record<string, unknown>, value: unknown): { example: unknown; name: string; where: string; required: boolean } | undefined {
  const parameter = resolveLocalReference(root, value);
  if (!isUnknownRecord(parameter) || typeof parameter.name !== 'string' || typeof parameter.in !== 'string') {
    return undefined;
  }
  const schema = resolveLocalReference(root, parameter.schema);
  const example = parameter.example !== undefined ? parameter.example : mockFromSchema(root, schema, 0, new Set());
  return { example, name: parameter.name, required: parameter.required === true, where: parameter.in };
}

function mockFromSchema(root: Record<string, unknown>, rawSchema: unknown, depth: number, references: Set<string>): unknown {
  if (depth > MAX_EXAMPLE_DEPTH || !isUnknownRecord(rawSchema)) {
    return null;
  }
  if (typeof rawSchema.$ref === 'string') {
    if (references.has(rawSchema.$ref)) {
      return null;
    }
    references.add(rawSchema.$ref);
    const output = mockFromSchema(root, resolveLocalReference(root, rawSchema), depth + 1, references);
    references.delete(rawSchema.$ref);
    return output;
  }
  if (rawSchema.example !== undefined) {
    return rawSchema.example;
  }
  if (rawSchema.default !== undefined) {
    return rawSchema.default;
  }
  if (Array.isArray(rawSchema.enum) && rawSchema.enum.length > 0) {
    return rawSchema.enum[0];
  }
  if (Array.isArray(rawSchema.examples) && rawSchema.examples.length > 0) {
    return rawSchema.examples[0];
  }
  let selected: unknown;
  if (Array.isArray(rawSchema.oneOf)) {
    selected = rawSchema.oneOf[0];
  }
  else if (Array.isArray(rawSchema.anyOf)) {
    selected = rawSchema.anyOf[0];
  }
  if (selected !== undefined) {
    return mockFromSchema(root, selected, depth + 1, references);
  }
  const type = rawSchema.type;
  if (type === 'object' || isUnknownRecord(rawSchema.properties)) {
    const result: Record<string, unknown> = {};
    if (isUnknownRecord(rawSchema.properties)) {
      for (const [name, property] of Object.entries(rawSchema.properties).slice(0, 100)) {
        result[name] = mockFromSchema(root, property, depth + 1, references);
      }
    }
    return result;
  }
  if (type === 'array') {
    return [mockFromSchema(root, rawSchema.items, depth + 1, references)];
  }
  if (type === 'integer' || type === 'number') {
    return typeof rawSchema.minimum === 'number' ? rawSchema.minimum : 0;
  }
  if (type === 'boolean') {
    return false;
  }
  if (rawSchema.format === 'date-time') {
    return '2026-01-01T00:00:00Z';
  }
  if (rawSchema.format === 'date') {
    return '2026-01-01';
  }
  if (rawSchema.format === 'uuid') {
    return '00000000-0000-4000-8000-000000000000';
  }
  if (rawSchema.format === 'email') {
    return 'user@example.com';
  }
  return typeof rawSchema.pattern === 'string' ? `<matches ${rawSchema.pattern.slice(0, 80)}>` : 'string';
}

function firstServerUrl(root: Record<string, unknown>) {
  const server = Array.isArray(root.servers) && isUnknownRecord(root.servers[0]) ? root.servers[0] : undefined;
  if (!server || typeof server.url !== 'string' || server.url.length > 2_000) {
    return 'https://api.example.com';
  }
  return server.url.replace(/\{([^}]+)\}/gu, (_match, name: string) => {
    const variables = isUnknownRecord(server.variables) ? server.variables : undefined;
    const candidate = variables?.[name];
    let variable: Record<string, unknown> | undefined;
    if (isUnknownRecord(candidate)) {
      variable = candidate;
    }
    return variable && typeof variable.default === 'string' ? variable.default : name;
  });
}

function shellQuote(value: string) {
  return `'${value.replace(/'/gu, '\'"\'"\'')}'`;
}

function requestExample(root: Record<string, unknown>, endpoint: OpenApiEndpoint) {
  const rawParameters = [
    ...(Array.isArray(endpoint.pathItem.parameters) ? endpoint.pathItem.parameters : []),
    ...(Array.isArray(endpoint.operation.parameters) ? endpoint.operation.parameters : []),
  ];
  const parameters = rawParameters.map(value => parameterExample(root, value)).filter((value): value is NonNullable<typeof value> => value !== undefined);
  let path = endpoint.path;
  parameters.filter(parameter => parameter.where === 'path').forEach((parameter) => {
    path = path.replace(`{${parameter.name}}`, encodeURIComponent(String(parameter.example ?? parameter.name)));
  });
  const query = parameters.filter(parameter => parameter.where === 'query' && (parameter.required || parameter.example !== undefined))
    .map(parameter => `${encodeURIComponent(parameter.name)}=${encodeURIComponent(String(parameter.example ?? ''))}`);
  const url = `${firstServerUrl(root).replace(/\/$/u, '')}${path}${query.length ? `?${query.join('&')}` : ''}`;
  const parts = [`curl --request ${endpoint.method}`, `  --url ${shellQuote(url)}`, `  --header ${shellQuote('Accept: application/json')}`];
  let mockPayload: unknown;
  const requestBody = resolveLocalReference(root, endpoint.operation.requestBody);
  if (isUnknownRecord(requestBody) && isUnknownRecord(requestBody.content)) {
    const mediaType = isUnknownRecord(requestBody.content['application/json'])
      ? requestBody.content['application/json']
      : Object.values(requestBody.content).find(isUnknownRecord);
    if (mediaType) {
      mockPayload = mediaType.example !== undefined ? mediaType.example : mockFromSchema(root, mediaType.schema, 0, new Set());
      const body = JSON.stringify(mockPayload);
      parts.push(`  --header ${shellQuote('Content-Type: application/json')}`, `  --data ${shellQuote(body)}`);
    }
  }
  return { curl: parts.join(' \\\n'), mockPayload };
}

export function inspectOpenApi(source: string) {
  const root = parseSource(source);
  const issues = structuralIssues(root);
  const endpoints = collectEndpoints(root, issues);
  const title = isUnknownRecord(root.info) && typeof root.info.title === 'string' ? root.info.title : 'Untitled API';
  const version = isUnknownRecord(root.info) && typeof root.info.version === 'string' ? root.info.version : 'unknown';
  const lines = [
    'OpenAPI Inspector report',
    `Title: ${title.slice(0, 500)}`,
    `API version: ${version.slice(0, 200)}`,
    `OpenAPI version: ${typeof root.openapi === 'string' ? root.openapi.slice(0, 100) : 'missing'}`,
    `Operations: ${endpoints.length}`,
    '',
    issues.length ? `Structural observations (${issues.length}):` : 'Structural observations: none in the supported check set.',
    ...issues.map(issue => `- ${issue}`),
  ];
  endpoints.forEach((endpoint, index) => {
    const summary = typeof endpoint.operation.summary === 'string' ? ` — ${endpoint.operation.summary.slice(0, 500)}` : '';
    const operationId = typeof endpoint.operation.operationId === 'string' ? ` [${endpoint.operation.operationId.slice(0, 300)}]` : '';
    const responseCodes = isUnknownRecord(endpoint.operation.responses) ? Object.keys(endpoint.operation.responses).slice(0, 100).join(', ') : 'none declared';
    const example = requestExample(root, endpoint);
    lines.push('', `${index + 1}. ${endpoint.method} ${endpoint.path}${summary}${operationId}`, `Responses: ${responseCodes}`, example.curl);
    if (example.mockPayload !== undefined) {
      lines.push('Mock request payload:', JSON.stringify(example.mockPayload, null, 2));
    }
  });
  return lines.join('\n');
}
