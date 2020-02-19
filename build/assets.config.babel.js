/**
 * @fileoverview Webpack assets config
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

import CopyPlugin from 'copy-webpack-plugin';
import ImageminPlugin from 'imagemin-webpack-plugin';
import path from 'path';

module.exports = {
  entry: './src/assets.js',
  mode: 'production',
  plugins: [
    new CopyPlugin([
      {
        from: path.resolve('./assets/css'),
        to: path.resolve('./dist/assets/css')
      },
      {
        from: path.resolve('./assets/svg'),
        to: path.resolve('./dist/assets/svg')
      }
    ]),
    new ImageminPlugin({
      disable: process.env.NODE_ENV !== 'production',
      test: /\.(jpe?g|png|gif|svg)$/i
    })
  ]
};
