var webpack = require('webpack'),
    merge = require('webpack-merge');

var main = require('./webpack.main'),
    render = require('./webpack.render');

module.exports = merge(main, render);
