/**
 * @license Copyright 2020 The Coding with Chrome Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @author mbordihn@google.com (Markus Bordihn)
 *
 * @fileoverview Webpack core config
 */

import CopyPlugin from 'copy-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import HtmlMinimizerPlugin from 'html-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import WebpackPwaManifest from 'webpack-pwa-manifest';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

import path from 'path';
import webpack from 'webpack';

module.exports = (mode = 'development') => ({
  mode: mode,
  target: 'web',
  devServer: {
    compress: true,
    headers: {
      'Cache-Control': 'max-age=0',
      'X-Mode': mode,
    },
    liveReload: mode == 'development',
    open: mode == 'development',
    static: path.join(__dirname, '..', 'static'),
  },
  entry: {
    boot: ['./src/boot.js', './assets/css/boot.css'],
    serviceWorker: ['./src/service-worker/service-worker.js'],
  },
  output: {
    publicPath: '/',
    path: path.join(__dirname, '..', 'dist'),
    filename: (pathData) => {
      if (pathData.chunk.name === 'serviceWorker') {
        return 'service-worker.js';
      }
      return mode == 'development'
        ? 'js/[name].js'
        : 'js/[name].[contenthash].js';
    },
  },
  optimization: {
    emitOnErrors: true,
    minimize: mode != 'development',
    minimizer: [
      new TerserPlugin({}),
      new CssMinimizerPlugin(),
      new HtmlMinimizerPlugin(),
    ],
  },
  devtool: mode == 'development' ? 'inline-source-map' : false,
  resolve: {
    symlinks: false,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.join(__dirname, '..', 'src'),
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          {
            loader: 'css-loader',
            options: {
              modules: { auto: true },
            },
          },
        ],
      },
      {
        test: /\.scss$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: { auto: true },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(eot|ttf|otf)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(woff|woff2)$/,
        use: {
          loader: 'url-loader',
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new webpack.DefinePlugin({
      DEVMODE: mode === 'development',
      VERSION: JSON.stringify(process.env.npm_package_version),
    }),
    new WebpackPwaManifest({
      name: 'Coding with Chrome Suite',
      short_name: 'Coding with Chrome',
      description: 'Educational Coding Development Environment',
      start_url: '/',
      display: 'standalone',
      background_color: '#fff',
      theme_color: 'red',
      icons: [
        {
          src: path.resolve('assets/svg/logo.svg'),
          sizes: [96, 128, 256, 384],
          destination: path.join('icons'),
        },
        {
          src: path.resolve('assets/icons/coding_with_chrome.png'),
          sizes: [192, 512],
          destination: path.join('icons'),
        },
        {
          src: path.resolve('assets/icons/maskable_icon.png'),
          size: '1046x1046',
          purpose: 'maskable',
        },
      ],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: './assets/favicon',
          to: './favicon',
        },
        {
          from: './assets/favicon/browserconfig.xml',
          to: './browserconfig.xml',
        },
        {
          from: './assets/svg',
          to: './assets/svg',
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      favicon: 'assets/favicon/favicon.ico',
      inject: false,
      enforce: 'post',
    }),
  ],
});
