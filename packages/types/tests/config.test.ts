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
    const resolved = resolveConfig({}, 'linux');
    expect(resolved).toEqual({
      ...DEFAULT_CONFIG,
      acrylic: false,
      terminalBorderColorActive: resolved.colorScheme.foreground,
      terminalBorderColorInactive: resolved.colorScheme.background,
    });
  });

  it('should merge custom config with default config', () => {
    const resolved = resolveConfig(
      {
        fontSize: 20,
      },
      'linux',
    );
    expect(resolved).toEqual({
      ...DEFAULT_CONFIG,
      acrylic: false,
      fontSize: 20,
      terminalBorderColorActive: resolved.colorScheme.foreground,
      terminalBorderColorInactive: resolved.colorScheme.background,
    });
  });

  it('should disable acrylic when not supported', () => {
    const resolved = resolveConfig(
      {
        acrylic: true,
      },
      'linux',
    );
    expect(resolved).toEqual({
      ...DEFAULT_CONFIG,
      acrylic: false,
      terminalBorderColorActive: resolved.colorScheme.foreground,
      terminalBorderColorInactive: resolved.colorScheme.background,
    });
  });

  it('should overwrite background when acrylic is enabled', () => {
    const resolved = resolveConfig(
      {
        acrylic: true,
      },
      'darwin',
    );
    expect(resolved).toEqual({
      ...DEFAULT_CONFIG,
      acrylic: true,
      colorScheme: {
        ...DEFAULT_CONFIG.colorScheme,
        background: '#00000000',
      },
      terminalBorderColorActive: resolved.colorScheme.foreground,
      terminalBorderColorInactive: resolved.colorScheme.background,
    });
  });
});
