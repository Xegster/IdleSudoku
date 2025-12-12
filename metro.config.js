const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configure resolver to prefer CommonJS over ESM to avoid import.meta issues
config.resolver = {
  ...config.resolver,
  unstable_conditionNames: ['browser', 'require', 'react-native'],
};

module.exports = config;
