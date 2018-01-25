/**
 * @fileoverview BUILD configuration for extra files.
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
 * Blockly
 */
let BlocklyPath = 'third_party/blockly/';

closureBuilder.build({
  name: 'Blockly core files',
  resources: [
    BlocklyPath + 'media/',
    BlocklyPath + 'blockly_compressed.js',
    BlocklyPath + 'blocks_compressed.js',
    BlocklyPath + 'javascript_compressed.js',
    'patches/blockly/audio_preload_patch.js',
  ],
  out: 'genfiles/third_party/external/blockly/',
});


closureBuilder.build({
  name: 'Blockly language files',
  resources: [
    BlocklyPath + 'msg/js/de.js',
    BlocklyPath + 'msg/js/en.js',
    BlocklyPath + 'msg/js/hi.js',
    BlocklyPath + 'msg/js/ja.js',
    BlocklyPath + 'msg/js/ko.js',
  ],
  out: 'genfiles/third_party/external/blockly/msg/',
});


/**
 * Code Mirror
 */
let codeMirrorPath = 'third_party/codemirror/';

closureBuilder.build({
  name: 'CodeMirror',
  banner: '// CodeMirror, copyright (c) by Marijn Haverbeke and others\n' +
    '// Distributed under an MIT license: http://codemirror.net/LICENSE' +
    '// This is CodeMirror (http://codemirror.net), a code editor' +
    '// implemented in JavaScript on top of the browser\'s DOM.' +
    '//' +
    '// You can find some technical background for some of the code below' +
    '// at http://marijnhaverbeke.nl/blog/#cm-internals .\n\n',
  format: 'umd',
  srcs: codeMirrorPath + 'src/codemirror.js',
  out: codeMirrorPath + 'lib/codemirror.js',
});

closureBuilder.build({
  name: 'CodeMirror main',
  resources: [
    codeMirrorPath + 'lib/codemirror.js',
    codeMirrorPath + 'keymap',
  ],
  out: 'genfiles/third_party/external/codemirror/',
});

closureBuilder.build({
  name: 'CodeMirror css',
  srcs: [
    codeMirrorPath + 'lib/codemirror.css',
    codeMirrorPath + 'addon/dialog/dialog.css',
    codeMirrorPath + 'addon/fold/foldgutter.css',
    codeMirrorPath + 'addon/search/matchesonscrollbar.css',
    codeMirrorPath + 'addon/hint/show-hint.css',
    codeMirrorPath + 'addon/lint/lint.css',
  ],
  out: 'genfiles/third_party/external/codemirror/codemirror.css',
});

closureBuilder.build({
  name: 'CodeMirror theme',
  srcs: [
    codeMirrorPath + 'theme/eclipse.css',
    codeMirrorPath + 'theme/icecoder.css',
    codeMirrorPath + 'theme/mdn-like.css',
  ],
  out: 'genfiles/third_party/external/codemirror/codemirror_theme.css',
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
    '!' + codeMirrorPath + 'addone/**/test.js',
  ]),
  externs: [
    'build/externs/codemirror.js',
    'build/externs/global.js',
  ],
  out: 'genfiles/third_party/external/codemirror/addons.js',
  options: {
    exclude_test: true,
  },
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
    codeMirrorPath + 'mode/schemen/!(*test).js',
  ]),
  externs: [
    'build/externs/codemirror.js',
    'build/externs/global.js',
  ],
  out: 'genfiles/third_party/external/codemirror/modes.js',
});


/**
 * JSHint
 */
closureBuilder.build({
  name: 'JSHint files',
  type: closureBuilder.buildType.JAVASCRIPT,
  srcs: [
    'third_party/jshint/dist/jshint.js',
  ],
  options: {
    closure: {
      language_out: 'ES5_STRICT',
    },
  },
  warn: false,
  out: 'genfiles/third_party/external/jshint/jshint.js',
});


/**
 * Shepherd
 */
closureBuilder.build({
  name: 'Shepherd',
  resources: [
    'third_party/shepherd/dist/css/shepherd-theme-arrows.css',
    // ToDo: Remove patched url after PR is merged.
    'https://raw.githubusercontent.com/MarkusBordihn/shepherd/master/dist/js/' +
    'shepherd.min.js',
    // 'third_party/shepherd/dist/js/shepherd.min.js',
    'third_party/tether/dist/js/tether.min.js',
  ],
  out: 'genfiles/third_party/external/shepherd',
});
