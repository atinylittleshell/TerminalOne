const path = require('path');

module.exports = {
  mode: 'production',
  entry: './dist/preload.js',
  target: 'web',
  output: {
    filename: 'preload.bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: {
    electron: 'commonjs electron',
  },
  plugins: [],
  resolve: {
    fallback: {
      assert: false,
      buffer: false,
      console: false,
      constants: false,
      crypto: false,
      domain: false,
      events: false,
      fs: false,
      http: false,
      https: false,
      os: false,
      path: false,
      punycode: false,
      process: false,
      querystring: false,
      stream: false,
      string_decoder: false,
      sys: false,
      timers: false,
      tty: false,
      url: false,
      util: false,
      vm: false,
      zlib: false,
    },
  },
};
