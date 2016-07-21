/**
 * @fileoverview BUILD configuration for static files.
 *
 * @license Copyright 2015 Google Inc. All Rights Reserved.
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
var glob = closureBuilder.globSupport();


/**
 * Application data
 */
closureBuilder.build({
  name: 'Static files',
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
  name: 'Resource files',
  resources: [
    'resources/'
  ],
  out: 'genfiles/'
});


/**
 * Roboto fonts
 */
closureBuilder.build({
  name: 'Roboto fonts',
  resources: glob([
    'third_party/roboto/*.woff2'
  ]),
  out: 'genfiles/fonts/'
});


/**
 * Material design icons
 */
closureBuilder.build({
  name: 'Material design icons',
  resources: [
    'third_party/material-design-icons/iconfont/MaterialIcons-Regular.woff2'
  ],
  out: 'genfiles/fonts/'
});


/**
 * Material design lite
 */
closureBuilder.build({
  name: 'Material Design',
  resources: [
    'third_party/material-design-lite/material.min.js',
    'third_party/material-design-lite/material.min.css',
  ],
  out: 'genfiles/external/material-design-lite/'
});


/**
 * Markdown files
 */
closureBuilder.build({
  name: 'Markdown files',
  markdown: [
    'LICENSE.md',
    'NOTICE.md'
  ],
  out: 'genfiles/'
});


/**
 * Dialog Polyfill
 */
closureBuilder.build({
  name: 'Dialog polyfill',
  resources: [
    'third_party/dialog-polyfill/dialog-polyfill.js',
    'third_party/dialog-polyfill/dialog-polyfill.css'
  ],
  out: 'genfiles/external/dialog-polyfill/'
});


/**
 * Coffeelint
 */
closureBuilder.build({
  name: 'Coffeelint file',
  resources: [
    'third_party/coffeelint/js/coffeelint.js'
  ],
  out: 'genfiles/external/coffeelint/'
});


/**
 * HTMLHint
 */
closureBuilder.build({
  name: 'HTMLHint files',
  resources: [
    'third_party/HTMLHint/lib/htmlhint.js'
  ],
  out: 'genfiles/external/htmlhint/'
});


/**
 * i18next
 */
closureBuilder.build({
  name: 'i18next',
  resources: [
    'third_party/i18next/i18next.min.js'
  ],
  out: 'genfiles/external/i18next/i18next.min.js'
});


/**
 * i18next-sprintf
 */
closureBuilder.build({
  name: 'i18next-sprintf',
  resources: [
    'third_party/i18next-sprintf/i18nextSprintfPostProcessor.min.js'
  ],
  out: 'genfiles/external/i18next/i18next-sprintf.min.js'
});
