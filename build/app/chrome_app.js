/**
 * @fileoverview BUILD configuration for Coding with Chrome (Chrome app).
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
 * Static files
 */
closureBuilder.build({
  name: 'Copy static files',
  resources: [
    'app/chrome_app/manifest.json',
    'app/default/index.html',
    'genfiles/core/LICENSE.html',
    'genfiles/core/NOTICE.html',
    'genfiles/core/icons/',
    'genfiles/core/images/',
    'genfiles/core/resources/',
    'genfiles/third_party/external/',
    'genfiles/third_party/fonts/',
  ],
  out: 'dist/chrome_os/',
});


/**
 * JavaScript files
 */
closureBuilder.build({
  name: 'Copy JavaScript files',
  resources: glob([
    'app/default/js/*',
    'genfiles/core/js/*',
  ]),
  out: 'dist/chrome_os/js/',
});


/**
 * StyleSheet files
 */
closureBuilder.build({
  name: 'Copy StyleSheets files',
  resources: glob([
    'genfiles/core/css/*.css',
    'genfiles/third_party/css/external.css',
  ]),
  out: 'dist/chrome_os/css/',
});


/**
 * Framework files
 */
closureBuilder.build({
  name: 'Copy Framework files',
  resources: [
    'genfiles/core/frameworks/internal',
    'genfiles/third_party/frameworks/external',
  ],
  out: 'dist/chrome_os/frameworks',
});


/**
 * Background file
 */
closureBuilder.build({
  name: 'Compile CwC Background',
  srcs: [
    'app/chrome_app/background.js',
  ],
  externs: [
    'build/externs/chrome.js',
  ],
  out: 'dist/chrome_os/js/background.js',
});
