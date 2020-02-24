/**
 * @fileoverview Unit tests config for the Coding with Chrome suite.
 *
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
 *
 * @author mbordihn@google.com (Markus Bordihn)
 */

import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackPwaManifest from 'webpack-pwa-manifest';
import webpack from 'webpack';
import webpackConfig from '../build/webpack.config.babel.js';
import path from 'path';

// Cleanup existing webpack config for unit tests.
const webpackConfigGeneral = webpackConfig();
delete webpackConfigGeneral.entry;
delete webpackConfigGeneral.output;
webpackConfigGeneral.plugins = webpackConfigGeneral.plugins
  .filter(p => !(p instanceof FaviconsWebpackPlugin))
  .filter(p => !(p instanceof HtmlWebpackPlugin))
  .filter(p => !(p instanceof WebpackPwaManifest))
  .filter(p => !(p instanceof webpack.DefinePlugin));
webpackConfigGeneral.mode = 'development';
webpackConfigGeneral.devtool = 'inline-source-map';
webpackConfigGeneral.module.rules.push({
  enforce: 'pre',
  exclude: /node_modules|\.spec\.js|_test\.js$/,
  include: path.resolve('src/'),
  test: /\.js$|\.jsx$/,
  use: {
    loader: 'istanbul-instrumenter-loader',
    options: { esModules: true }
  }
});

// Karma Test Config
export default config => {
  config.set({
    basePath: '../',
    browsers: ['Chrome'],
    autoWatch: false,
    colors: true,
    failOnEmptyTestSuite: false,
    singleRun: true,
    frameworks: ['jasmine'],
    files: [{ pattern: 'src/**/*_test.js', watched: false }],
    preprocessors: {
      'src/**/*_test.js': ['webpack']
    },
    reporters: ['mocha', 'coverage-istanbul'],
    webpack: {
      module: webpackConfigGeneral.module,
      plugins: webpackConfigGeneral.plugins
    },
    coverageIstanbulReporter: {
      fixWebpackSourcePaths: true,
      reports: ['lcov', 'text', 'html']
    }
  });
};
