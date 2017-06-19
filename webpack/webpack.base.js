var path = require('path');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.(jsx|es6)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.js$/,
        include: /node_modules\/(JSONStream|npm|rc)/,
        loader: 'shebang-loader'
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
