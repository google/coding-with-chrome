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
import JsonMinimizerPlugin from 'json-minimizer-webpack-plugin';
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
    cacheServiceWorker: ['./src/service-worker/cache-service-worker.js'],
    previewServiceWorker: ['./src/service-worker/preview-service-worker.js'],
  },
  output: {
    publicPath: '/',
    path: path.join(__dirname, '..', 'dist'),
    filename: (pathData) => {
      // Exclude service workers from hashing.
      if (pathData.chunk.name === 'cacheServiceWorker') {
        return 'cache-service-worker.js';
      } else if (pathData.chunk.name === 'previewServiceWorker') {
        return 'preview-service-worker.js';
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
      new CssMinimizerPlugin(),
      new HtmlMinimizerPlugin(),
      new JsonMinimizerPlugin(),
      new TerserPlugin({}),
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
            presets: ['@babel/preset-env', '@babel/preset-react'],
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
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        issuer: /\.[jt]sx?$/,
        use: ['babel-loader', '@svgr/webpack', 'url-loader'],
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.json$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
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
          globOptions: {
            dot: true,
            gitignore: true,
          },
        },
        {
          from: './assets/favicon/browserconfig.xml',
          to: './browserconfig.xml',
          globOptions: {
            dot: true,
            gitignore: true,
          },
        },
        {
          from: './assets/svg',
          to: './assets/svg',
          globOptions: {
            dot: true,
            gitignore: true,
          },
        },
        {
          from: './assets/icons',
          to: './assets/icons',
          globOptions: {
            dot: true,
            gitignore: true,
          },
        },
        {
          from: './locales',
          to: './locales',
          globOptions: {
            dot: true,
            gitignore: true,
          },
        },
        {
          from: './third_party/phaser-ce/build/phaser.min.js',
          to: './framework/phaser.min.js',
          globOptions: {
            dot: true,
            gitignore: true,
          },
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
