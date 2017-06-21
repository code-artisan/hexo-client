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
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(woff|woff2|svg|eot|ttf|png|gif|jpg|jpeg)(.*?)?$/,
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
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      "root.jQuery":'jquery',
      'window.marked': 'marked',
      'window.CodeMirror': 'CodeMirror'
    }),
    new ExtractTextPlugin('style.css')
  ],
  target: 'electron-renderer',
  resolve: {
    alias: {
      editormd: path.join(__dirname, '..', 'node_modules', 'editor.md')
    }
  }
});
