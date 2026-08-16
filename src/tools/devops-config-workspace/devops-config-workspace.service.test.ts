import { describe, expect, it } from 'vitest';
import { processDevopsConfig } from './devops-config-workspace.service';

describe('DevOps configuration workspace', () => {
  it('reports bounded Dockerfile security and reproducibility guidance', () => {
    const output = processDevopsConfig({ mode: 'dockerfile-lint', source: 'FROM node:latest\nRUN apt-get update\nADD https://example.test/install.sh /tmp/' });
    expect(output).toContain('pin FROM');
    expect(output).toContain('combine apt-get update');
    expect(output).toContain('remote ADD');
    expect(output).toContain('non-root USER');
  });

  it('validates Compose and removes the obsolete version field', () => {
    const output = processDevopsConfig({ mode: 'compose-normalize', source: 'version: "3.8"\nservices:\n  web:\n    image: nginx:1.27\n' });
    expect(output).not.toContain('version:');
    expect(output).toContain('services:');
    expect(output).toContain('nginx:1.27');
  });

  it('formats balanced nginx blocks while preserving quoted semicolons', () => {
    const output = processDevopsConfig({ mode: 'nginx-format', source: 'server { listen 80; add_header X-Test "a;b"; location / { try_files $uri =404; } }' });
    expect(output).toBe('server {\n  listen 80;\n  add_header X-Test "a;b";\n  location / {\n    try_files $uri =404;\n  }\n}');
    expect(() => processDevopsConfig({ mode: 'nginx-format', source: 'server {' })).toThrow('unclosed');
  });

  it('round-trips nested properties and YAML paths', () => {
    const yaml = processDevopsConfig({ mode: 'properties-to-yaml', source: 'server.port=8080\nserver.name=demo\nfeature.enabled=true' });
    expect(yaml).toContain('server:');
    const properties = processDevopsConfig({ mode: 'yaml-to-properties', source: yaml });
    expect(properties).toContain('server.port=8080');
    expect(properties).toContain('feature.enabled=true');
  });

  it('rejects prototype-shaped paths', () => {
    expect(() => processDevopsConfig({ mode: 'properties-to-yaml', source: '__proto__.polluted=yes' })).toThrow('not safe');
  });

  it('exports selected structured values as deterministic shell-safe env assignments', () => {
    const output = processDevopsConfig({
      mode: 'structured-to-env',
      format: 'json',
      path: '/service',
      prefix: 'APP',
      source: '{"service":{"host":"localhost","quote":"it\'s local","ports":[80,443]},"ignored":true}',
    });
    expect(output.split('\n')).toHaveLength(4);
    expect(output).toContain('APP_HOST=');
    expect(output).toContain('APP_PORTS_0=');
    expect(output).toContain('APP_QUOTE=');
    expect(output).toContain('\\');
  });

  it('rejects normalized env-key collisions and missing JSON Pointer paths', () => {
    expect(() => processDevopsConfig({ mode: 'structured-to-env', format: 'yaml', source: 'a-b: 1\na_b: 2', prefix: '' })).toThrow('normalize');
    expect(() => processDevopsConfig({ mode: 'structured-to-env', format: 'toml', source: '[service]\nport = 80', path: '/missing', prefix: 'APP' })).toThrow('does not exist');
  });
});
