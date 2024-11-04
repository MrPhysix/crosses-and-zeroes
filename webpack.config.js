const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  cache: { type: 'filesystem' },
  entry: { main: './src/index.tsx' },
  output: {
    path: path.resolve(__dirname, './public'),
    filename: 'bundle.js',
  },
  devServer: {
    static: path.resolve(__dirname, './public'),
    compress: true,
    port: 3000,

    open: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@images': path.resolve(__dirname, 'src/images'),
    },
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: ['ts-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
        exclude: '/node_modules/',
      },
      {
        test: /\.(png|svg|jpg|gif|woff(2)?|eot|ttf|otf|ico)$/,
        type: 'asset/resource',
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.module\.css$/,
        // exclude: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: true,
                namedExport: false
              },
              importLoaders: 1,
            },
          },
          // 'postcss-loader',
        ],
        // use: [
        //   'style-loader',
        //   {
        //     loader: 'css-loader',
        //     options: {
        //       // esModule: true,
        //       modules: true,
        //       // modules: {
        //       //   namedExport: true,
        //       // },
        //       importLoaders: 1,
        //     },
        //   },
        //   'postcss-loader',
        // ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      favicon: './src/images/favicon.ico',
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
  ],
};
