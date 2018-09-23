/**
 * @fileoverview Editor mode config data for the Coding with Chrome editor.
 *
 * @license Copyright 2018 The Coding with Chrome Authors.
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
goog.provide('cwc.mode.programming.Config');

goog.require('cwc.mode.Mod');
goog.require('cwc.mode.Service');
goog.require('cwc.mode.basic.Mod');
goog.require('cwc.mode.coffeescript.Mod');
goog.require('cwc.mode.javascript.Mod');
goog.require('cwc.mode.pencilCode.Mod');
goog.require('cwc.mode.python.Mod');
goog.require('cwc.utils.mime.Type');


/**
 * enum {Object}
 */
cwc.mode.programming.Config = {};


/**
 * Basic mode.
 */
cwc.mode.programming.Config[cwc.mode.Type.BASIC] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  auto_preview: true,
  icon: 'school',
  mime_types: [cwc.utils.mime.Type.CWC.type],
  mod: cwc.mode.basic.Mod,
  name: 'Basic',
  template: 'basic/blank.cwc',
});


/**
 * Basic blockly mode.
 */
cwc.mode.programming.Config[cwc.mode.Type.BASIC_BLOCKLY] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  auto_preview: true,
  icon: 'school',
  mime_types: [cwc.utils.mime.Type.CWC.type],
  mod: cwc.mode.basic.Mod,
  name: 'Basic Blockly',
  show_blockly: true,
  template: 'basic/blank-blocks.cwc',
});


/**
 * Coffeescript mode.
 */
cwc.mode.programming.Config[cwc.mode.Type.COFFEESCRIPT] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  auto_preview: true,
  icon: 'local_cafe',
  mime_types: [cwc.utils.mime.Type.COFFEESCRIPT.type],
  mod: cwc.mode.coffeescript.Mod,
  name: 'Coffeescript',
  template: 'coffeescript/blank.coffee',
});


/**
 * JavaScript mode.
 */
cwc.mode.programming.Config[cwc.mode.Type.JAVASCRIPT] = new cwc.mode.Mod({
  authors: ['Adam Carheden'],
  auto_preview: true,
  icon: 'local_cafe',
  mime_types: [cwc.utils.mime.Type.JAVASCRIPT.type],
  mod: cwc.mode.javascript.Mod,
  name: 'JavaScript',
  template: 'javascript/blank.js',
});


/**
 * Pencilcode mode.
 */
cwc.mode.programming.Config[cwc.mode.Type.PENCIL_CODE] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  auto_preview: true,
  icon: 'mode_edit',
  mime_types: [cwc.utils.mime.Type.CWC.type],
  mod: cwc.mode.pencilCode.Mod,
  name: 'Pencil Code',
  template: 'pencil_code/blank.cwc',
});


/**
 * Python mode.
 */
cwc.mode.programming.Config[cwc.mode.Type.PYTHON] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  auto_preview: true,
  icon: 'mode_edit',
  mime_types: [cwc.utils.mime.Type.PYTHON.type],
  mod: cwc.mode.python.Mod,
  name: 'Python',
  template: 'python/blank.py',
});


/**
 * Python 2.7 mode.
 */
cwc.mode.programming.Config[cwc.mode.Type.PYTHON27] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  auto_preview: true,
  icon: 'mode_edit',
  mime_types: [cwc.utils.mime.Type.PYTHON.type],
  mod: cwc.mode.python.Mod,
  name: 'Python 2.7',
  template: 'python27/blank.py',
});
