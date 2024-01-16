<p align="center">
    <img alt="Terminal One" src="https://github.com/kunchenguid/TerminalOne/blob/main/apps/app/assets/screenshot.png?raw=true">
</p>

<h1 align="center">Terminal One</h1>

<p align="center">
One terminal is all you need.
</p>

## Overview

A cross-platform, smooth and elegant terminal emulator and multiplexer.

- Buttery smooth GPU-accelerated rendering.
- Consistent experience across Windows, Mac and Linux.
- Multi-chord key bindings.
- Built-in tmux-like multiplexer.

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

## Default Key Bindings

Many default key bindings are deliberately similar to tmux.

| Key Binding    | Action              |
| -------------- | ------------------- |
| `Ctrl-b c`     | New tab             |
| `Ctrl-b &`     | Close tab           |
| `Ctrl-b p`     | Previous tab        |
| `Ctrl-b n`     | Next tab            |
| `Ctrl-b <1-9>` | Jump to tab         |
| `Ctrl-b %`     | Horizontal split    |
| `Ctrl-b "`     | Vertical split      |
| `Ctrl-b h`     | Focus pane on left  |
| `Ctrl-b l`     | Focus pane on right |
| `Ctrl-b k`     | Focus pane above    |
| `Ctrl-b j`     | Focus pane below    |

## Contributing

[![build](https://github.com/atinylittleshell/TerminalOne/actions/workflows/build.yml/badge.svg)](https://github.com/atinylittleshell/TerminalOne/actions/workflows/build.yml)
[![codecov](https://codecov.io/gh/atinylittleshell/TerminalOne/branch/main/graph/badge.svg?token=2TEJYGL994)](https://codecov.io/gh/atinylittleshell/TerminalOne)

Terminal One is open-source with MIT license. See [CONTRIBUTING.md](CONTRIBUTING.md) if you'd like to contribute to this project.
