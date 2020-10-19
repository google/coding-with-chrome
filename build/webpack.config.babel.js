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
import ExcludeAssetsPlugin from 'webpack-exclude-assets-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ImageminPlugin from 'imagemin-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import WebpackPwaManifest from 'webpack-pwa-manifest';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

import path from 'path';
import webpack from 'webpack';

module.exports = (mode = 'development') => ({
  mode: mode,
  devServer:
    mode == 'development'
      ? {
          contentBase: path.join(__dirname, 'dist'),
          compress: true,
          overlay: true,
        }
      : {},
  entry: {
    boot: ['./src/boot.js', './assets/css/boot.css'],
    serviceWorker: ['./src/service-worker/service-worker.js'],
  },
  output: {
    publicPath: '/',
    path: path.join(__dirname, '..', '/dist'),
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
    minimizer: [new TerserPlugin({}), new OptimizeCssAssetsPlugin({})],
  },
  devtool: mode == 'development' ? 'inline-source-map' : false,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['@babel/plugin-transform-runtime'],
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: (resourcePath, context) => {
                return path.relative(path.dirname(resourcePath), context) + '/';
              },
            },
          },
          'css-loader',
        ],
      },
      {
        test: /\.scss$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          'sass-loader',
        ],
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
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[id].[contenthash].css',
    }),
    new ExcludeAssetsPlugin({
      path: ['boot.css'],
    }),
    new webpack.DefinePlugin({
      DEV: mode === 'development',
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
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      pngquant: {
        quality: '95-100',
      },
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      favicon: 'assets/favicon/favicon.ico',
      inject: false,
      enforce: 'post',
    }),
  ],
});
