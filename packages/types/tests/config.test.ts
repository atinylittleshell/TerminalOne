import { resolveConfig, validateConfig } from '../config';
import { DEFAULT_CONFIG } from '../defaultConfig';

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
        terminalContentPadding: {},
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
    expect(resolved).toEqual({
      ...DEFAULT_CONFIG,
      terminalBorderColorActive: DEFAULT_CONFIG.colorScheme.foreground,
      terminalBorderColorInactive: DEFAULT_CONFIG.colorScheme.background,
    });
  });

  it('should merge custom config with default config', () => {
    const resolved = resolveConfig({
      fontSize: 20,
    });
    expect(resolved).toEqual({
      ...DEFAULT_CONFIG,
      fontSize: 20,
      terminalBorderColorActive: DEFAULT_CONFIG.colorScheme.foreground,
      terminalBorderColorInactive: DEFAULT_CONFIG.colorScheme.background,
    });
  });
});
