var path = require('path');
var webpack = require('webpack');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.(jsx|es6)$/,
        loader: 'babel-loader'
      },
      {
        test: /\.(html|cs)$/,
        loader: 'ignore-loader'
      }
    ]
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '../'),
    publicPath: '../',
  },
  devServer: {
    contentBase: path.join(__dirname, "assets"),
    compress: true,
    port: 9000
  }
};
