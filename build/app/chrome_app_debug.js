/**
 * @fileoverview BUILD configuration for Coding with Chrome (Chrome app DEBUG).
 *
 * @license Copyright 2017 The Coding with Chrome Authors.
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
 * Core application.
 */
closureBuilder.build({
  name: 'cwc.ui.Builder',
  srcs: glob([
    'src/**/*.js',
    'gensoyfiles/**/*.js',
    '!src/{blocks,blocks/**.js}',
    '!src/frameworks/{internal,internal/**.js}',
  ]),
  externs: [
    'build/externs/blockly.js',
    'build/externs/chrome.js',
    'build/externs/codemirror.js',
    'build/externs/coffeescript.js',
    'build/externs/global.js',
    'build/externs/i18n.js',
    'build/externs/jquery-turtle.js',
    'build/externs/jquery.js',
    'build/externs/material-design.js',
    'build/externs/mocha.js',
    'build/externs/shepherd.js',
  ],
  compress: true,
  out: 'dist/chrome_os/js/cwc_ui.js',
  out_source_map: 'dist/chrome_os/js/cwc_ui.js.map',
  append: '//# sourceMappingURL=cwc_ui.js.map',
  options: {
    closure: {
      debug: true,
      define: 'ENABLE_LOGGING',
      formatting: 'PRETTY_PRINT',
    },
  },
});


/**
 * Core files
 */
closureBuilder.build({
  name: 'CwC core files',
  resources: [
    'genfiles/core/css/',
    'genfiles/core/icons/',
    'genfiles/core/images/',
    'genfiles/core/js/',
    'genfiles/core/resources/',
  ],
  out: 'dist/chrome_os/',
});


/**
 * Static application data
 */
closureBuilder.build({
  name: 'CwC Chrome app files',
  resources: [
    'app/chrome_app/html/',
    'app/chrome_app/manifest.json',
  ],
  out: 'dist/chrome_os/',
});


/**
 * Third party files
 */
closureBuilder.build({
  name: 'CwC third party files',
  resources: [
    'genfiles/third_party/external/',
    'genfiles/third_party/fonts/',
  ],
  out: 'dist/chrome_os/',
});


/**
 * Third party files
 */
closureBuilder.build({
  name: 'Framework files',
  resources: [
    'genfiles/core/frameworks/internal',
    'genfiles/third_party/frameworks/external',
  ],
  out: 'dist/chrome_os/frameworks',
});


/**
 * Markdown files
 */
closureBuilder.build({
  name: 'CwC Markdown files',
  markdown: [
    'LICENSE.md',
    'NOTICE.md',
  ],
  out: 'dist/chrome_os/',
});


/**
 * Background file
 */
closureBuilder.build({
  name: 'CwC Background',
  srcs: [
    'app/chrome_app/js/background.js',
  ],
  out: 'dist/chrome_os/js/background.js',
});


/**
 * Debug file
 */
closureBuilder.build({
  name: 'CwC Debug',
  resources: [
    'app/chrome_app/js/debug.js',
  ],
  out: 'dist/chrome_os/js/',
});


/**
 * Editor-loader
 */
closureBuilder.build({
  name: 'CwC Editor',
  srcs: [
    'app/chrome_app/js/editor.js',
  ],
  externs: [
    'build/externs/cwc.js',
  ],
  out: 'dist/chrome_os/js/editor.js',
});


/**
 * Pre-loader
 */
closureBuilder.build({
  name: 'CwC Loader',
  srcs: [
    'app/chrome_app/js/loader.js',
  ],
  out: 'dist/chrome_os/js/loader.js',
});

