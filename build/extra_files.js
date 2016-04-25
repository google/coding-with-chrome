/**
 * @fileoverview BUILD configuration for extra files.
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


closureBuilder.build({
  name: 'Blockly files',
  resources: [
    'node_modules/blockly/media'
  ],
  out: 'genfiles/external/blockly/'
});


closureBuilder.build({
  name: 'CodeMirror main',
  resources: [
    'node_modules/codemirror/lib/codemirror.js',
    'node_modules/codemirror/keymap',
    'node_modules/codemirror/theme'
  ],
  out: 'genfiles/external/codemirror/'
});


closureBuilder.build({
  name: 'CodeMirror css',
  srcs: [
    'node_modules/codemirror/lib/codemirror.css',
    'node_modules/codemirror/addon/dialog/dialog.css',
    'node_modules/codemirror/addon/fold/foldgutter.css',
    'node_modules/codemirror/addon/search/matchesonscrollbar.css',
    'node_modules/codemirror/addon/hint/show-hint.css',
    'node_modules/codemirror/addon/lint/lint.css'
  ],
  out: 'genfiles/external/codemirror/codemirror.css'
});


closureBuilder.build({
  name: 'CodeMirror addon',
  srcs: glob([
    'node_modules/codemirror/addon/comment/*.js',
    'node_modules/codemirror/addon/dialog/*.js',
    'node_modules/codemirror/addon/display/rulers.js',
    'node_modules/codemirror/addon/edit/*.js',
    'node_modules/codemirror/addon/fold/*.js',
    'node_modules/codemirror/addon/hint/*.js',
    'node_modules/codemirror/addon/lint/*.js',
    'node_modules/codemirror/addon/scroll/*.js',
    'node_modules/codemirror/addon/search/*.js',
    'node_modules/codemirror/addon/selection/active-line.js'
  ]),
  externs: [
    'build/externs/codemirror.js',
    'build/externs/global.js'
  ],
  out: 'genfiles/external/codemirror/addons.js',
  options: {
    exclude_test: true
  }
});


closureBuilder.build({
  name: 'CodeMirror mode',
  srcs: glob([
    'node_modules/codemirror/mode/xml/*.js',
    'node_modules/codemirror/mode/actionscript/*.js',
    'node_modules/codemirror/mode/css/*.js',
    'node_modules/codemirror/mode/coffeescript/*.js',
    'node_modules/codemirror/mode/dart/*.js',
    'node_modules/codemirror/mode/go/*.js',
    'node_modules/codemirror/mode/htmlmixed/*.js',
    'node_modules/codemirror/mode/javascript/*.js',
    'node_modules/codemirror/mode/python/*.js',
    'node_modules/codemirror/mode/schemen/*.js'
  ]),
  externs: [
    'build/externs/codemirror.js',
    'build/externs/global.js'
  ],
  out: 'genfiles/external/codemirror/modes.js'
});


closureBuilder.build({
  name: 'Material Design',
  resources: [
    'node_modules/material-design-lite/material.min.js',
    'node_modules/material-design-lite/material.min.css',
    'node_modules/material-design-lite/dist/material.indigo-blue.min.css',
    'node_modules/material-design-lite/dist/material.blue_grey-red.min.css'
  ],
  out: 'genfiles/external/material-design-lite/'
});


closureBuilder.build({
  name: 'Dialog polyfill',
  resources: [
    'node_modules/dialog-polyfill/dialog-polyfill.js',
    'node_modules/dialog-polyfill/dialog-polyfill.css'
  ],
  out: 'genfiles/external/dialog-polyfill/'
});


closureBuilder.build({
  name: 'JSHint files',
  resources: [
    'node_modules/jshint/dist/jshint.js'
  ],
  out: 'genfiles/external/jshint/'
});


closureBuilder.build({
  name: 'HTMLHint files',
  resources: [
    'node_modules/htmlhint/lib/htmlhint.js'
  ],
  out: 'genfiles/external/htmlhint/'
});


closureBuilder.build({
  name: 'Hint.css',
  srcs: [
    'node_modules/hint.css/hint.css'
  ],
  out: 'genfiles/external/hint.css/hint.css'
});
