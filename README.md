<p align="center">
    <img width="256" alt="Terminal One Logo" src="https://github.com/kunchenguid/TerminalOne/blob/main/apps/app/assets/icon.png?raw=true">
</p>

<h1 align="center">Terminal One</h1>

<p align="center">
Everything you want from a terminal - all in one. 
</p>

## Overview

A fast, elegant and intelligent cross-platform terminal emulator and multiplexer.

- Not written in Rust, yet still blazing fast.
- GPU-accelerated rendering using [Xterm.js](https://xtermjs.org/).
- Consistent experience across platforms using [Electron](https://www.electronjs.org/).
- (WIP) Multi-chord key bindings.
- (WIP) Built-in tmux-like multiplexer.

## Installation

Download installers from the [releases](https://github.com/kunchenguid/TerminalOne/releases) page.

## Configuration

Terminal One can be customized through a `config.js` file located at the path shown in the menu tab.

`config.js` should contain Javascript code that produces a configuration object by assigning it to module.exports.

```typescript
module.exports = {
  // config values...
};
```

The structure of the configuration object and default values can be found [here](https://github.com/kunchenguid/TerminalOne/blob/main/packages/types/defaultConfig.ts).

## Contributing

[![build](https://github.com/kunchenguid/TerminalOne/actions/workflows/build.yml/badge.svg)](https://github.com/kunchenguid/TerminalOne/actions/workflows/build.yml)
[![codecov](https://codecov.io/gh/kunchenguid/TerminalOne/branch/main/graph/badge.svg?token=2TEJYGL994)](https://codecov.io/gh/kunchenguid/TerminalOne)

Terminal One is open-source with MIT license. See [CONTRIBUTING.md](CONTRIBUTING.md) if you'd like to contribute to this project.
