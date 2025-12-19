module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'babel-plugin-transform-import-meta',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@src': './src',
            '@data': './data',
            '@assets': './assets',
          },
          extensions: ['.js', '.jsx', '.json', '.gif', '.webp', '.png', '.jpg'],
        },
      ],
    ],
  };
};
