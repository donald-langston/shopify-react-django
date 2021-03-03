const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
var BundleTracker = require('webpack-bundle-tracker');

module.exports = {
  resolve: {
      fallback: {
          path: require.resolve("path-browserify"),
          fs: false
      }
  },
  context: path.resolve(__dirname, "src"),
  entry: "./index.js",
  output: {
      filename: "index.js",
      path: path.resolve(__dirname, "static/frontend"),
      publicPath: "frontend/static/frontend/"
  },
  module: {
      rules: [
          {
              test: /\.css$/,
              use: ["style-loader", "css-loader"]
          },
          {
              test: /\.js$/,
              exclude: /node_modules/,
              use: ["babel-loader"]
          }
      ]
  },
  plugins: [
       new CleanWebpackPlugin(),
       new Dotenv({
           path: './.env',
           safe: true}),
      new BundleTracker({
          path: __dirname,
          filename: 'webpack-stats.json'
      })
  ]
};