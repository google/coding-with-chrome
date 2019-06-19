/**
 * @fileoverview BUILD configuration for Coding with Chrome main files.
 *
 * @license Copyright 2015 The Coding with Chrome Authors.
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
let closureBuilder = require('closure-builder');
let glob = closureBuilder.globSupport();


/**
 * UI Builder
 */
closureBuilder.build({
  name: 'cwc.ui.Builder',
  srcs: glob([
    'src/**/!(*_test).js',
    'gensoyfiles/**/!(*_test).js',
    '!src/{blocks,blocks/**.js}',
    '!src/{frameworks,frameworks/**.js}',
    'third_party/coding-with-chrome-libraries/src/**/!(*_test).js',
  ]),
  externs: [
    'build/externs/addons.js',
    'build/externs/blockly.js',
    'build/externs/chrome.js',
    'build/externs/clEditor.js',
    'build/externs/codemirror.js',
    'build/externs/coffeescript.js',
    'build/externs/global.js',
    'build/externs/i18n.js',
    'build/externs/jquery-turtle.js',
    'build/externs/jquery.js',
    'build/externs/material-design.js',
    'build/externs/navigator.js',
    'build/externs/marked.js',
    'build/externs/mocha.js',
    'build/externs/shepherd.js',
  ],
  compress: true,
  out: 'genfiles/core/js/cwc_ui.js',
  options: {
    closure: {
      define: 'ENABLE_LOGGING=false',
    },
  },
});
