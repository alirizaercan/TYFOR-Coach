const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add web support
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Enable CSS support for web
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'css'
];

// Web-specific configurations
if (process.env.EXPO_PUBLIC_PLATFORM === 'web') {
  config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];
}

module.exports = config;
