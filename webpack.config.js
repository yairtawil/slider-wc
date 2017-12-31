const path = require('path');

module.exports = {
  context: __dirname,

  entry: {
    main: './src/main.ts'
  },

  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.ts'],
    modules: [
      path.resolve( __dirname, 'src' ),
      'node_modules'
    ]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: [/node_modules/],
        use: 'css-loader'
      },
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: 'ts-loader'
      }
    ]
  }
};