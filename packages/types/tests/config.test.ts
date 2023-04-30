import { DEFAULT_CONFIG, resolveConfig, validateConfig } from '../config';

describe('config', () => {
  it('should throw when given invalid configs', () => {
    expect(() => {
      validateConfig({
        fontSize: 'foo',
      });
    }).toThrowError();
    expect(() => {
      validateConfig({
        fontSize: -1,
      });
    }).toThrowError();
    expect(() => {
      validateConfig({
        fontSize: 100000,
      });
    }).toThrowError();

    expect(() => {
      validateConfig({
        tabContentPadding: {},
      });
    }).toThrowError();

    expect(() => {
      validateConfig({
        shells: [],
        defaultShellName: 'foo',
      });
    }).toThrowError();
  });

  it('should resolve to default config when given no config', () => {
    const resolved = resolveConfig({});
    expect(resolved).toEqual(DEFAULT_CONFIG);
  });

  it('should merge custom config with default config', () => {
    const resolved = resolveConfig({
      fontSize: 20,
    });
    expect(resolved).toEqual({
      ...DEFAULT_CONFIG,
      fontSize: 20,
    });
  });
});
