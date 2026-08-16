import { describe, expect, it } from 'vitest';
import { convertComposeToDockerRun, quoteShellToken } from './docker-compose-to-run.service';

describe('Compose to Docker run conversion', () => {
  it('quotes shell tokens without allowing interpolation or quote breakouts', () => {
    expect(quoteShellToken('nginx:alpine')).toBe('nginx:alpine');
    expect(quoteShellToken('hello world')).toBe('\'hello world\'');
    expect(quoteShellToken('a\'b;$HOME')).toBe('\'a\'"\'"\'b;$HOME\'');
    expect(quoteShellToken('')).toBe('\'\'');
  });

  it('translates environment, ports, volumes, names, restart, and commands', () => {
    const result = convertComposeToDockerRun(`
services:
  api:
    image: ghcr.io/example/api:1
    container_name: api-local
    restart: unless-stopped
    ports:
      - "127.0.0.1:8080:80/tcp"
    volumes:
      - "./data files:/app/data:ro"
    environment:
      API_KEY: "value with spaces"
      DEBUG: true
      INHERITED:
    command: ["serve", "--port", "80"]
`);
    expect(result.messages).toEqual([]);
    expect(result.commands).toContain('--name \\\n  api-local');
    expect(result.commands).toContain('--restart \\\n  unless-stopped');
    expect(result.commands).toContain('-p \\\n  127.0.0.1:8080:80/tcp');
    expect(result.commands).toContain('-v \\\n  \'./data files:/app/data:ro\'');
    expect(result.commands).toContain('-e \\\n  \'API_KEY=value with spaces\'');
    expect(result.commands).toContain('-e \\\n  DEBUG=true');
    expect(result.commands).toContain('-e \\\n  INHERITED');
    expect(result.commands).toMatch(/ghcr\.io\/example\/api:1[\s\\]+serve/);
  });

  it('supports long Compose syntax and reports unsupported fields without dropping the command', () => {
    const result = convertComposeToDockerRun(`
services:
  web:
    image: nginx
    ports:
      - target: 80
        published: 8080
        host_ip: 127.0.0.1
        protocol: udp
    volumes:
      - type: bind
        source: ./site
        target: /site
        read_only: true
    healthcheck:
      test: [CMD, curl, localhost]
`);
    expect(result.commands).toContain('127.0.0.1:8080:80/udp');
    expect(result.commands).toContain('./site:/site:ro');
    expect(result.messages).toEqual([{
      type: 'notImplemented',
      value: 'Service web: Compose field "healthcheck" was not translated.',
    }]);
  });

  it.each([
    ['', 'services'],
    ['services: {}', 'between 1 and 50'],
    ['services:\n  app:\n    build: .', 'needs an image'],
    ['services:\n  app: nope', 'must be a mapping'],
  ])('rejects unsupported or malformed Compose documents', (source, message) => {
    expect(() => convertComposeToDockerRun(source)).toThrow(message);
  });
});
