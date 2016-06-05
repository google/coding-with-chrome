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



/**
 * Code Mirror
 */
var codeMirrorPath = 'third_party/codemirror/';

closureBuilder.build({
  name: 'CodeMirror main',
  resources: [
    codeMirrorPath + 'lib/codemirror.js',
    codeMirrorPath + 'keymap',
    codeMirrorPath + 'theme'
  ],
  out: 'genfiles/external/codemirror/'
});

closureBuilder.build({
  name: 'CodeMirror css',
  srcs: [
    codeMirrorPath + 'lib/codemirror.css',
    codeMirrorPath + 'addon/dialog/dialog.css',
    codeMirrorPath + 'addon/fold/foldgutter.css',
    codeMirrorPath + 'addon/search/matchesonscrollbar.css',
    codeMirrorPath + 'addon/hint/show-hint.css',
    codeMirrorPath + 'addon/lint/lint.css'
  ],
  out: 'genfiles/external/codemirror/codemirror.css'
});

closureBuilder.build({
  name: 'CodeMirror addon',
  srcs: glob([
    codeMirrorPath + 'addon/comment/*.js',
    codeMirrorPath + 'addon/dialog/*.js',
    codeMirrorPath + 'addon/display/rulers.js',
    codeMirrorPath + 'addon/edit/*.js',
    codeMirrorPath + 'addon/fold/*.js',
    codeMirrorPath + 'addon/hint/*.js',
    codeMirrorPath + 'addon/lint/*.js',
    codeMirrorPath + 'addon/scroll/*.js',
    codeMirrorPath + 'addon/search/*.js',
    codeMirrorPath + 'addon/selection/active-line.js',
    '!' + codeMirrorPath + 'addone/**/test.js'
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
    codeMirrorPath + 'mode/xml/!(*test).js',
    codeMirrorPath + 'mode/actionscript/!(*test).js',
    codeMirrorPath + 'mode/css/!(*test).js',
    codeMirrorPath + 'mode/coffeescript/!(*test).js',
    codeMirrorPath + 'mode/dart/!(*test).js',
    codeMirrorPath + 'mode/go/!(*test).js',
    codeMirrorPath + 'mode/htmlmixed/!(*test).js',
    codeMirrorPath + 'mode/javascript/!(*test).js',
    codeMirrorPath + 'mode/python/!(*test).js',
    codeMirrorPath + 'mode/schemen/!(*test).js'
  ]),
  externs: [
    'build/externs/codemirror.js',
    'build/externs/global.js'
  ],
  out: 'genfiles/external/codemirror/modes.js'
});
