const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// lucide-react-native ships ESM (.mjs) icon modules; Metro doesn't resolve
// that extension by default.
config.resolver.sourceExts.push('mjs');

module.exports = withNativeWind(config, { input: './global.css' });
