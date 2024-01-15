Benchmarking the performance of terminal emulators is tricky. There are tools such as https://github.com/alacritty/vtebench but as called out by the author it's not good representation of the actual E2E experience, and the best way is to simple test specific use cases.

while I continue to look for more systematic approaches for benchmarking, here's a video looking at smooth scrolling in neovim as a key use case TerminalOne optimizes for: 

- Scrolling through the same file with the same Neovim setup on the same PC (11th Gen Intel i9 3.50GHz + GeForce RTX 3080 Ti)
- First half is WezTerm (No criticism intended! WezTerm is an awesome terminal. Using it for comparison since it's commonly raised as a target for benchmarking)
- Second half is TerminalOne
- This comparison is mainly to highlight that Javascript doesn't inherently create performance bottlenecks - moer often than not they are created by the application layer not the language

https://github.com/atinylittleshell/TerminalOne/assets/3233006/6f7dee53-7c8b-4991-9bdc-3250547a3945

