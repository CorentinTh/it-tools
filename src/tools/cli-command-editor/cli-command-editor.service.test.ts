import { describe, expect, it } from 'vitest';
import { buildEditedCommand, buildOptionsObject, extractOptions, isOption, sanitizeOption } from './cli-command-editor.service';

describe('cli-command-editor', () => {
  describe('extractOptions', () => {
    it ('extracts all the options from a command', () => {
      expect(
        extractOptions('aws elb describe-load-balancers --load-balancer-name my-load-balancer')[0],
      ).toContain('--load-balancer-name');

      expect(
        extractOptions('aws elb describe-load-balancers --load-balancer-name my-load-balancer --debug --query my-queryyy')[0],
      ).toContain('--load-balancer-name');

      expect(
        extractOptions('aws elb describe-load-balancers --load-balancer-name my-load-balancer --debug --query my-queryyy')[1],
      ).toContain('--debug');

      expect(
        extractOptions('aws elb describe-load-balancers --load-balancer-name my-load-balancer --debug --query my-queryyy')[2],
      ).toContain('--query');
    });

    it('extracts all the option from a command with a mix of hyphen and double hyphens', () => {
      expect(
        extractOptions('npm i lodash -g --legacy-peer-deps')[0],
      ).toContain('-g');

      expect(
        extractOptions('npm i lodash -g --legacy-peer-deps')[1],
      ).toContain('--legacy-peer-deps');
    });

    it('shouldn\'t extract any options from a command without options', () => {
      expect(
        extractOptions('npm i lodash'),
      ).toEqual([]);
    });

    it('shouldn\'t return any options if command is not passed', () => {
      expect(extractOptions()).toEqual([]);
    });
  });

  describe('buildOptionsObject', () => {
    it('returns a valid options object with the given options', () => {
      expect(
        buildOptionsObject(['--debug', '--load-balancer-names']),
      ).toEqual({
        '--debug': '',
        '--load-balancer-names': '',
      });
    });

    it('returns an empty obnject with blank options array', () => {
      expect(
        buildOptionsObject([]),
      ).toEqual({});
    });
  });

  describe('sanitizeOption', () => {
    it('returns the sanitized option without `id` suffix', () => {
      expect(sanitizeOption('--debug-id-1dfsj'))
        .toEqual('--debug');
    });

    it('returns the blank string', () => {
      expect(sanitizeOption('')).toEqual('');
    });
  });

  describe('isOption', () => {
    it('returns true for a valid double hyphen option token', () => {
      expect(isOption('--debug')).toBe(true);
    });

    it('returns true for a valid single hyphen option token', () => {
      expect(isOption('-i')).toBe(true);
    });

    it('returns false for an non-option token', () => {
      expect(isOption('hello-world')).toBe(false);
    });
  });

  describe('buildEditedCommand', () => {
    it('returns the edited command', () => {
      expect(
        buildEditedCommand({
          '--debug-id-1dfsj': 'stdin',
          '-p': '',
          '-m': 'nahhhh',
        }, {
          '--debug-id-1dfsj': 'stdin',
          '-p': '',
          '-m': 'nahhhh',
        }, 'aws node --debug stdio -p -m okayyy'),
      ).toEqual('aws node --debug stdin -p -m nahhhh');

      expect(
        buildEditedCommand({
          '-d-id-1dfsj': '',
          '-p-id-fdsd': '4444:3333',
          '-p-id-fddd': '3333:4444',
          '--name-id-nnnn': 'clickhouse-server',
          '--ulimit-id-uuuu': 'nofile=3333:4444',
        }, {
          '-d-id-1dfsj': '',
          '-p-id-fdsd': '4444:3333',
          '-p-id-fddd': '3333:4444',
          '--name-id-nnnn': 'clickhouse-server',
          '--ulimit-id-uuuu': 'nofile=3333:4444',
        }, 'docker run -d -p 18123:8123 -p 19000:9000 --name some-clickhouse-server --ulimit nofile=262144:262144 clickhouse/clickhouse-server'),
      ).toEqual('docker run -d -p 4444:3333 -p 3333:4444 --name clickhouse-server --ulimit nofile=3333:4444 clickhouse/clickhouse-server');
    });

    it('returns the edited command when options object and CLI options order doesn\'t match', () => {
      expect(
        buildEditedCommand({
          '-d-id-t1dd3': 'true',
          '--install-id-only123': 'nodemon',
        }, {
          '--install-id-only123': 'nodem',
          '-d-id-t1dd3': 'false',
        }, 'npm --install nodem -d false'),
      ).toBe('npm --install nodemon -d true');
    });

    it('returns the original command', () => {
      expect(
        buildEditedCommand({}, {}, 'npm install nodemon'),
      ).toBe('npm install nodemon');

      expect(
        buildEditedCommand({}, {}, 'aws load-balancer describe-load-balancers all'),
      ).toBe('aws load-balancer describe-load-balancers all');
    });
  });
});
