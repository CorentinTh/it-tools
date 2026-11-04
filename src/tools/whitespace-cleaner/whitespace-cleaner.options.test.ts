import { describe, expect, it } from 'vitest';
import { getDefaultOptions, loadOptions, OPTIONS_STORAGE_KEY, saveOptions } from './whitespace-cleaner.options';

function createStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));

  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
}

describe('whitespace-cleaner options', () => {
  it('turns Markdown / Reddit off by default', () => {
    expect(getDefaultOptions().markdownMode).to.eql(false);
  });

  it('oS1 returns the defaults when nothing is saved', () => {
    expect(loadOptions(createStorage())).to.eql(getDefaultOptions());
  });

  it('oS2 ignores unknown keys and keeps the default for missing keys', () => {
    const { stripLineNumbers: _missing, ...saved } = { ...getDefaultOptions(), removeAnsi: false, smartUnwrap: true };
    const storage = createStorage({ [OPTIONS_STORAGE_KEY]: JSON.stringify({ ...saved, unknownKey: true }) });

    const options = loadOptions(storage);

    expect(options).to.eql({ ...getDefaultOptions(), removeAnsi: false, smartUnwrap: true });
    expect(options).not.to.have.property('unknownKey');
  });

  it('oS3 returns the defaults when the storage throws an error', () => {
    const storage = {
      getItem: () => {
        throw new Error('SecurityError');
      },
    };

    expect(loadOptions(storage)).to.eql(getDefaultOptions());
    expect(loadOptions(undefined)).to.eql(getDefaultOptions());
  });

  for (const raw of ['{not json', 'null', '[]', '42', '"text"', '{"removeAnsi":"no"}']) {
    it(`OS3 returns the defaults when the saved data is invalid: ${raw}`, () => {
      expect(loadOptions(createStorage({ [OPTIONS_STORAGE_KEY]: raw }))).to.eql(getDefaultOptions());
    });
  }

  it('saves the full options object and loads it back', () => {
    const storage = createStorage();
    const options = { ...getDefaultOptions(), markdownMode: true, trimTrailing: false };

    saveOptions(storage, options);

    expect(loadOptions(storage)).to.eql(options);
  });

  it('ignores write errors', () => {
    const storage = {
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
    };

    expect(() => saveOptions(storage, getDefaultOptions())).not.toThrow();
  });
});
