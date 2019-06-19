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


/**
 * Blockly translation
 */
closureBuilder.build({
  name: 'Blockly language files',
  resources: [
    BlocklyPath + 'msg/js/de.js',
    BlocklyPath + 'msg/js/en.js',
    BlocklyPath + 'msg/js/fr.js',
    BlocklyPath + 'msg/js/hi.js',
    BlocklyPath + 'msg/js/ja.js',
    BlocklyPath + 'msg/js/ko.js',
    BlocklyPath + 'msg/js/sv.js',
    BlocklyPath + 'msg/js/vi.js',
    BlocklyPath + 'msg/js/zh.js',
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
  ]),
  externs: [
    'build/externs/codemirror.js',
    'build/externs/global.js',
  ],
  out: 'genfiles/third_party/external/codemirror/addons.js',
  options: {
    exclude_test: true,
  },
  warn: false,
});

closureBuilder.build({
  name: 'CodeMirror mode',
  srcs: glob([
    codeMirrorPath + 'mode/coffeescript/!(*test).js',
    codeMirrorPath + 'mode/css/!(*test).js',
    codeMirrorPath + 'mode/dart/!(*test).js',
    codeMirrorPath + 'mode/go/!(*test).js',
    codeMirrorPath + 'mode/htmlmixed/!(*test).js',
    codeMirrorPath + 'mode/javascript/!(*test).js',
    codeMirrorPath + 'mode/markdown/!(*test).js',
    codeMirrorPath + 'mode/python/!(*test).js',
    codeMirrorPath + 'mode/schemen/!(*test).js',
    codeMirrorPath + 'mode/soy/!(*test).js',
    codeMirrorPath + 'mode/xml/!(*test).js',
  ]),
  externs: [
    'build/externs/codemirror.js',
    'build/externs/global.js',
  ],
  out: 'genfiles/third_party/external/codemirror/modes.js',
  options: {
    exclude_test: true,
  },
  warn: false,
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
    'node_modules/shepherd.js/dist/js/shepherd.min.js',
  ],
  out: 'genfiles/third_party/external/shepherd',
});


/**
 * Tippy
 */
closureBuilder.build({
  name: 'Tippy',
  resources: [
    'node_modules/tippy.js/umd/index.min.js',
  ],
  out: 'genfiles/third_party/external/tippy/tippy.min.js',
});


/**
 * Marked
 */
closureBuilder.build({
  name: 'Marked',
  resources: [
    'third_party/marked/marked.min.js',
  ],
  out: 'genfiles/third_party/external/marked',
});

/**
 * cl-editor
 */
closureBuilder.build({
  name: 'clEditor',
  resources: [
    'node_modules/cl-editor/dist/index.min.js',
  ],
  out: 'genfiles/third_party/external/cl-editor',
});

