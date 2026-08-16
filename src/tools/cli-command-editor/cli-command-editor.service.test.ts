import { describe, expect, it } from 'vitest';
import { appendCliArgument, getCliTokenRole, parseCliCommand, quoteCliWord, renderCliCommand } from './cli-command-editor.service';

describe('CLI command editor service', () => {
  it('round-trips unchanged POSIX source byte-for-byte and preserves repeated flags', () => {
    const source = 'rg -n --glob \'*.ts\' --glob "*.vue" -- \'hello world\' src | sort > result.txt';
    const document = parseCliCommand(source, 'posix');
    expect(renderCliCommand(document)).toBe(source);
    expect(document.tokens.filter(token => token.value === '--glob')).toHaveLength(2);
    expect(document.tokens.map(token => token.value)).toContain('|');
    expect(document.tokens.map(token => token.value)).toContain('>');
  });

  it('re-quotes edited POSIX values without interpolation', () => {
    const document = parseCliCommand('printf %s value', 'posix');
    document.tokens[2].value = 'new $value\'s';
    expect(renderCliCommand(document)).toBe('printf %s \'new $value\'"\'"\'s\'');
  });

  it('parses PowerShell quoting and safely quotes edits', () => {
    const source = 'Write-Output \'it\'\'s fine\' | Set-Content "a file.txt"';
    const document = parseCliCommand(source, 'powershell');
    expect(document.tokens.map(token => token.value)).toEqual(['Write-Output', 'it\'s fine', '|', 'Set-Content', 'a file.txt']);
    document.tokens[4].value = 'new file\'s.txt';
    expect(renderCliCommand(document)).toContain('\'new file\'\'s.txt\'');
  });

  it('classifies executables, options, arguments, operators, and redirect targets', () => {
    const document = parseCliCommand('git log --oneline | head -n 5 > out.txt', 'posix');
    expect(document.tokens.map((_, index) => getCliTokenRole(document.tokens, index))).toEqual([
      'executable', 'argument', 'option', 'operator', 'executable', 'option', 'argument', 'operator', 'redirection-target',
    ]);
  });

  it('appends editable empty arguments and quotes empty values', () => {
    const document = parseCliCommand('echo hello', 'posix');
    appendCliArgument(document);
    expect(renderCliCommand(document)).toBe('echo hello \'\'');
    expect(quoteCliWord('', 'powershell')).toBe('\'\'');
  });

  it('re-renders reordered and removed tokens instead of returning the original source', () => {
    const reordered = parseCliCommand('echo first second', 'posix');
    const [second] = reordered.tokens.splice(2, 1);
    reordered.tokens.splice(1, 0, second);
    expect(renderCliCommand(reordered)).toBe('echo second first');

    const removed = parseCliCommand('echo first second', 'posix');
    removed.tokens.pop();
    expect(renderCliCommand(removed)).toBe('echo first');
  });

  it('rejects unterminated quotes and oversized commands', () => {
    expect(() => parseCliCommand('echo \'oops', 'posix')).toThrow('not closed');
    expect(() => parseCliCommand(`echo ${'a'.repeat(70_000)}`, 'posix')).toThrow('limited');
  });
});
