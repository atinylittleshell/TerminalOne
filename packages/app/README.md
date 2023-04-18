# Troubleshooting

## Runtime errors in preload.bundle.js

If you run into cryptic runtime erros that originate from preload.bundle.js, chances are that the preload.ts script is referencing a native node module that's not supposed to run in a browser-like environment (which preload scripts runs in).

To fix it, you need to figure out what's the native module being imported into preload.ts, and add it in the plugins section of webpack.preload.config.js.
