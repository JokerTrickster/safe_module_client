/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // CSS Module 핫 리로딩 최적화
    config.module.rules.find(
      ({ oneOf }) => !!oneOf
    ).oneOf.filter(
      ({ test }) => test && test.toString().includes('css')
    ).forEach(rule => {
      rule.use.forEach(({ options }) => {
        if (options && options.modules) {
          options.modules.exportLocalsConvention = 'camelCase';
        }
      });
    });
    return config;
  },
}

module.exports = nextConfig 