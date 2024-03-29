module.exports = {
  reactStrictMode: true,
  output: 'export',
  distDir: 'dist',
  transpilePackages: ['@terminalone/ui', '@terminalone/types'],
  experimental: {
    typedRoutes: true,
  },
};
