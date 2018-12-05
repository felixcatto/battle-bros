const path = require('path');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


const common = {
  entry: {
    index: path.resolve(__dirname, 'client/index.js'),
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
            plugins: [
              ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
              'transform-class-properties',
            ],
          },
        },
      },
      {
        test: /local\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { modules: 1 } },
          'sass-loader',
        ],
      },
      {
        test: /(?<!local)\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
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
      filename: 'css/index.css',
    }),
  ],
  stats: {
    warnings: false,
    children: false,
    modules: false,
  },
};

if (process.env.NODE_ENV === 'production') {
  module.exports = merge(common, {
    mode: 'production',
  });
} else {
  module.exports = merge(common, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
  });
}
