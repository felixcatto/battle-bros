const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


const isDevMode = process.env.NODE_ENV !== 'production'
const mode = isDevMode ? 'development': 'production';
const devtool = isDevMode ? 'cheap-module-eval-source-map': '';
const cssLoader = isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader;

module.exports = {
  mode,
  devtool,
  entry: {
    index: path.resolve(__dirname, 'src/client/index.js'),
  },
  output: {
    filename: 'js/index.js',
    path: path.resolve(__dirname, 'dist/public/'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/env', {
                targets: {
                  edge: '17',
                  firefox: '60',
                  chrome: '67',
                  safari: '11.1',
                },
                useBuiltIns: 'usage',
                modules: false,
              }],
              '@babel/preset-react',
            ],
            'plugins': [
              ['@babel/plugin-proposal-pipeline-operator', { 'proposal': 'minimal' }]
            ],
          },
        },
      },
      {
        test: /local\.scss$/,
        use: [
          cssLoader,
          { loader: 'css-loader', options: { modules: 1 } },
          'sass-loader',
        ],
      },
      {
        test: /(?<!local)\.scss$/,
        use: [
          cssLoader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'font/[name].[ext]',
          },
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/index.css",
    })
  ],
};
