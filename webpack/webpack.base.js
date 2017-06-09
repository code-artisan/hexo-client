var path = require('path');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.(js|jsx|es6)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
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
