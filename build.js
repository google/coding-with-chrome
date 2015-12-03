/**
 * @fileoverview BUILD configuration for Coding with Chrome.
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
  name: 'cwc.framework.Arduino',
  srcs: [
    glob('src/frameworks/**/*.js')
  ],
  out: 'genfiles/frameworks/arduino_framework.js'
});


closureBuilder.build({
  name: 'cwc.framework.Ev3',
  srcs: [
    glob('src/frameworks/**/*.js')
  ],
  deps: [
    glob('src/**/*.js')
  ],
  out: 'genfiles/frameworks/ev3_framework.js'
});


closureBuilder.build({
  name: 'cwc.framework.Runner',
  srcs: [
    glob('src/frameworks/**/*.js')
  ],
  out: 'genfiles/frameworks/runner_framework.js'
});


closureBuilder.build({
  name: 'cwc.framework.simple.Loader',
  srcs: [
    glob('src/frameworks/**/*.js')
  ],
  deps: [
    glob('src/**/*.js')
  ],
  out: 'genfiles/frameworks/simple_framework.js'
});


closureBuilder.build({
  name: 'Coffeescript',
  resources: [
    'https://raw.githubusercontent.com/jashkenas/coffeescript/master/extras/coffee-script.js'
  ],
  out: 'genfiles/frameworks/'
});


closureBuilder.build({
  name: 'cwc.ui.Builder',
  srcs: [
    glob('src/**/*')
  ],
  deps: [
    glob('node_modules/blockly/**/*.js')
  ],
  out: 'genfiles/js/cwc_ui.js'
});


closureBuilder.build({
  name: 'Blockly files',
  resources: [
    'node_modules/blockly/media'
  ],
  out: 'genfiles/external/blockly/'
});


closureBuilder.build({
  name: 'Static files',
  resources: [
    'app/_locales/',
    'app/css/',
    'app/fonts/',
    'app/html/',
    'app/icons/',
    'app/images/',
    'app/js/',
    'app/manifest.json'
  ],
  out: 'genfiles/'
});


closureBuilder.build({
  name: '3rd party Images',
  resources: glob([
    'third_party/**/*.png'
  ]),
  out: 'genfiles/images/'
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
  out: 'genfiles/external/codemirror/modes.js'
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
  name: 'Coffeescript file',
  resources: [
    'http://coffeescript.org/extras/coffee-script.js'
  ],
  out: 'genfiles/external/coffeescript/'
});


closureBuilder.build({
  name: 'Coffeelint file',
  resources: [
    'http://www.coffeelint.org/js/coffeelint.js'
  ],
  out: 'genfiles/external/coffeelint/'
});


closureBuilder.build({
  name: 'Material design icons',
  resources: [
    'https://raw.github.com/google/material-design-icons/master/iconfont/MaterialIcons-Regular.woff2'
  ],
  out: 'genfiles/fonts/'
});
