import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    strictPort: true,
  },
  esbuild: {
    jsxDev: false,
  },
});
