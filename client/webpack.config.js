const path = require("path");
// const CompressionPlugin = require('compression-webpack-plugin');
var SRC_DIR = path.join(__dirname, 'src');
var OUTPUT = path.join(__dirname, 'public');

module.exports = {
  entry: ['@babel/polyfill', `${SRC_DIR}/index.jsx`],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader"
      }
    ]
  },
  output: {
    path: OUTPUT,
    filename: "tokenSale.js",
  }
};