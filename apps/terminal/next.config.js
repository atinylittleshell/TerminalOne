module.exports = {
  reactStrictMode: true,
  output: 'export',
  distDir: 'dist',
  transpilePackages: ['@terminalone/ui'],
  experimental: {
    appDir: true,
    typedRoutes: true,
  },
};
