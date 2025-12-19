const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Configure resolver to prefer CommonJS over ESM to avoid import.meta issues
config.resolver = {
  ...config.resolver,
  unstable_conditionNames: ['browser', 'require', 'react-native'],
  alias: {
    '@': path.resolve(__dirname, 'src'),
    '@src': path.resolve(__dirname, 'src'),
    '@data': path.resolve(__dirname, 'data'),
    '@assets': path.resolve(__dirname, 'assets'),
  },
  // Ensure asset extensions are included
  sourceExts: [...(config.resolver.sourceExts || []), 'gif', 'webp'],
};

// Add watch folders to include assets directory
config.watchFolders = [
  ...(config.watchFolders || []),
  path.resolve(__dirname, 'assets'),
  path.resolve(__dirname, 'data'),
];

module.exports = config;
