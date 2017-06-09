var webpack = require('webpack'),
    config = require('./webpack.base'),
    merge = require('webpack-merge');

module.exports = merge({}, config, {
  entry: {
    'index': './app/index.es6'
  },
  node: {
    __dirname: false,
    __filename: false
  },
  target: 'electron-main'
});
