/**
 * @fileoverview BUILD configuration for Coding with Chrome .gss files.
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
 * Coding with Chrome Closure Style Sheets files
 */
closureBuilder.build({
  name: 'CwC Closure Style Sheets files',
  prefix: 'cwc-',
  srcs: glob([
    // Internal style sheets
    'static_files/css/animations.gss',
    'static_files/css/backgrounds.gss',
    'static_files/css/fonts.gss',
    'static_files/css/icons.gss',
    'static_files/css/default.gss',
    'static_files/css/loading_screen.gss',

    // External style definitions
    'static_files/css/blockly/*.gss',
    'static_files/css/closure/*.gss',
    'static_files/css/codemirror/*.gss',
    'static_files/css/material-design-lite/*.gss',
    'static_files/css/shepherd/*.gss',

    // GSS definitions
    'src/**/*.gss',
  ]),
  out: 'genfiles/core/css/editor.css',
});


/**
 * Dialog Closure Style Sheets files
 */
closureBuilder.build({
  name: 'CwC dialog Style Sheet',
  prefix: 'cwc-',
  srcs: glob([
    'src/utils/dialog/dialog.gss',
  ]),
  out: 'genfiles/core/css/dialog.css',
});


/**
 * Messenger Style Sheets files
 */
closureBuilder.build({
  name: 'CwC messenger Style Sheet',
  prefix: 'cwc-',
  srcs: glob([
    'src/frameworks/internal/messenger/messenger.gss',
  ]),
  out: 'genfiles/core/css/messenger.css',
});
