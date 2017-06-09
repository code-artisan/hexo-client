var path = require('path'),
    webpack = require('webpack'),
    config = require('./webpack.base'),
    merge = require('webpack-merge'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = merge({}, config, {
  entry: {
    'renderer': './public/index.jsx'
  },
  module: {
    loaders: [
      {
        test: /\.(scss|css)$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.(woff|woff2|svg|eot|ttf|png|jpg|jpeg)(\?t=[0-9]+)?$/,
        loader: 'file-loader',
        query: {
          context: path.join(process.cwd()),
          publicPath: './',
          name: '[path][name]-[hash].[ext]'
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('style.css')
  ],
  target: 'electron-renderer'
});
