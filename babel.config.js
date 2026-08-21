module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
          },
        },
      ],
      // Must be listed last - required by react-native-reanimated even though
      // it's only a transitive peer of nativewind's css-interop here.
      'react-native-reanimated/plugin',
    ],
  };
};
