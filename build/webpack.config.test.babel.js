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
 * @fileoverview Webpack test config
 * @author mbordihn@google.com (Markus Bordihn)
 */
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpackConfig from './webpack.config.babel.js';

// Cleanup existing webpack config for unit tests.
const testConfig = webpackConfig();
testConfig.plugins = testConfig.plugins.filter(
  (p) => !(p instanceof HtmlWebpackPlugin)
);
testConfig.module.rules.push({
  test: /\.js$|\.jsx$/,
  use: ['@jsdevtools/coverage-istanbul-loader'],
  enforce: 'post',
  exclude: /(node_modules|_test\.js)$/,
});
testConfig.devtool = 'eval-source-map';
delete testConfig.output.filename;

module.exports = testConfig;
