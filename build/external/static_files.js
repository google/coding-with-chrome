/**
 * @fileoverview BUILD configuration for static files.
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
 * External Style Sheets files
 */
closureBuilder.build({
  name: 'External Style Sheets',
  srcs: glob([
    /* Code Mirror style sheets */
    'third_party/codemirror/lib/codemirror.css',
    'third_party/codemirror/addon/dialog/dialog.css',
    'third_party/codemirror/addon/fold/foldgutter.css',
    'third_party/codemirror/addon/search/matchesonscrollbar.css',
    'third_party/codemirror/addon/hint/show-hint.css',
    'third_party/codemirror/addon/lint/lint.css',
    'third_party/codemirror/theme/eclipse.css',
    'third_party/codemirror/theme/icecoder.css',
    'third_party/codemirror/theme/mdn-like.css',

    /* Dialog Polyfill */
    'third_party/dialog-polyfill/dialog-polyfill.css',

    /* Shpherd */
    'third_party/shepherd/dist/css/shepherd-theme-arrows.css',
  ]),
  out: 'genfiles/third_party/css/external.css',
});


/**
 * Roboto fonts
 */
closureBuilder.build({
  name: 'Roboto fonts',
  resources: glob([
    'third_party/roboto/*.woff2',
  ]),
  out: 'genfiles/third_party/fonts/',
});


/**
 * Material design icons
 */
closureBuilder.build({
  name: 'Material design icons',
  resources: [
    'third_party/material-design-icons/iconfont/MaterialIcons-Regular.woff2',
  ],
  out: 'genfiles/third_party/fonts/',
});


/**
 * Material design lite
 */
closureBuilder.build({
  name: 'Material Design',
  resources: [
    'third_party/material-design-lite/material.min.css',
    'third_party/material-design-lite/material.min.css.map',
    'third_party/material-design-lite/material.min.js',
    'third_party/material-design-lite/material.min.js.map',
  ],
  out: 'genfiles/third_party/external/material-design-lite/',
});


/**
 * Dialog Polyfill
 */
closureBuilder.build({
  name: 'Dialog polyfill',
  resources: [
    'third_party/dialog-polyfill/dialog-polyfill.js',
  ],
  out: 'genfiles/third_party/external/dialog-polyfill/',
});


/**
 * Coffeelint
 */
closureBuilder.build({
  name: 'Coffeelint file',
  resources: [
    'third_party/coffeelint/js/coffeelint.js',
  ],
  out: 'genfiles/third_party/external/coffeelint/',
});


/**
 * HTMLHint
 */
closureBuilder.build({
  name: 'HTMLHint files',
  resources: [
    'third_party/HTMLHint/lib/htmlhint.js',
  ],
  out: 'genfiles/third_party/external/htmlhint/',
});
