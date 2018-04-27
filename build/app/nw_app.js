/**
 * @fileoverview BUILD configuration for Coding with Chrome (nw.js app).
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


/**
 * Core files
 */
closureBuilder.build({
  name: 'CwC core files',
  resources: [
    'genfiles/core/LICENSE.html',
    'genfiles/core/NOTICE.html',
    'genfiles/core/css/',
    'genfiles/core/icons/',
    'genfiles/core/images/',
    'genfiles/core/js/',
    'genfiles/core/resources/',
  ],
  out: 'dist/nw_app/',
});


/**
 * Static application data
 */
closureBuilder.build({
  name: 'CwC Chrome app files',
  resources: [
    'app/chrome_app/html/',
    'app/chrome_app/manifest.json',
    'app/nw_app/package.json',
  ],
  out: 'dist/nw_app/',
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
  out: 'dist/nw_app/',
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
  out: 'dist/nw_app/frameworks',
});


/**
 * Background file
 */
closureBuilder.build({
  name: 'CwC Background',
  srcs: [
    'app/chrome_app/js/background.js',
  ],
  externs: [
    'build/externs/chrome.js',
  ],
  out: 'dist/nw_app/js/background.js',
});


/**
 * Debug file
 */
closureBuilder.build({
  name: 'CwC Debug',
  resources: [
    'app/chrome_app/js/debug.js',
  ],
  out: 'dist/nw_app/js/',
});
