# Performance Benchmark

## Methodology

- Benchmark done via https://github.com/const-void/DOOM-fire-zig
- All terminals are run with defaults immediately after clean installation without custom configurations
- Benchmarking done on Ubuntu 22.04, 11th Gen Intel i9 3.50GHz, GeForce RTX 3080 Ti
- For consistency, we start DOOM-fire-zig, let it for 15 seconds and capture the results

## Alacritty

![image](https://github.com/atinylittleshell/TerminalOne/assets/3233006/85475db6-1f37-4feb-83d0-6f46d83983e2)

## WezTerm

![image](https://github.com/atinylittleshell/TerminalOne/assets/3233006/8d28daa7-bac1-417f-8111-fda700707fd2)

## Kitty

![image](https://github.com/atinylittleshell/TerminalOne/assets/3233006/8be07a0b-5cee-45d4-ab1a-049015a853c5)

## Ubuntu Terminal

![image](https://github.com/atinylittleshell/TerminalOne/assets/3233006/95e38d51-da42-49e2-9d47-28e2ca8b8199)

## TerminalOne

![image](https://github.com/atinylittleshell/TerminalOne/assets/3233006/0c3a024f-3778-40d7-8aba-0f1db04dd433)

# E2E experience

Here's a video looking at smooth scrolling in Neovim as a key use case TerminalOne optimizes for:

- Scrolling through the same file with the same Neovim setup on the same PC (11th Gen Intel i9 3.50GHz + GeForce RTX 3080 Ti)
- First half is WezTerm (No criticism intended! WezTerm is an awesome terminal. Using it for comparison since it's commonly raised as a reference point)
- Second half is TerminalOne
- This comparison is mainly to highlight that Javascript doesn't inherently create performance bottlenecks - more often than not they are created by the application layer not the language

https://github.com/atinylittleshell/TerminalOne/assets/3233006/6f7dee53-7c8b-4991-9bdc-3250547a3945

Resource consumption of WezTerm during the scroll
![image](https://github.com/atinylittleshell/TerminalOne/assets/3233006/4a827bb7-d146-41f0-b57c-532efcaf80df)

Resource consumption of TeminalOne during the scroll
![image](https://github.com/atinylittleshell/TerminalOne/assets/3233006/80cf67bb-3630-46b2-9f31-c8a78caf723a)
