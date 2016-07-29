/**
 * @fileoverview BUILD configuration for Coding with Chrome app files.
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
var closureBuilder = require('closure-builder');



/**
 * Static application data
 */
closureBuilder.build({
  name: 'CwC static files',
  resources: [
    'app/_locales/',
    'app/css/',
    'app/html/',
    'app/icons/',
    'app/images/',
    'app/manifest.json'
  ],
  out: 'genfiles/'
});


/**
 * Resource files
 */
closureBuilder.build({
  name: 'CwC resource files',
  resources: [
    'resources/'
  ],
  out: 'genfiles/'
});


/**
 * Markdown files
 */
closureBuilder.build({
  name: 'CwC Markdown files',
  markdown: [
    'LICENSE.md',
    'NOTICE.md'
  ],
  out: 'genfiles/'
});


/**
 * Background file
 */
closureBuilder.build({
  name: 'CwC Background',
  srcs: [
    'app/js/background.js'
  ],
  out: 'genfiles/js/background.js'
});


/**
 * Debug file
 */
closureBuilder.build({
  name: 'CwC Debug',
  resources: [
    'app/js/debug.js'
  ],
  out: 'genfiles/js/'
});


/**
 * Editor-loader
 */
closureBuilder.build({
  name: 'CwC Editor',
  srcs: [
    'app/js/editor.js'
  ],
  externs: [
    'build/externs/cwc.js'
  ],
  out: 'genfiles/js/editor.js'
});


/**
 * Pre-loader
 */
closureBuilder.build({
  name: 'CwC Loader',
  srcs: [
    'app/js/loader.js'
  ],
  out: 'genfiles/js/loader.js'
});
