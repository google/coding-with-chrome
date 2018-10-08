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
goog.provide('cwc.mode.raw.Config');

goog.require('cwc.mode.Mod');
goog.require('cwc.mode.Service');
goog.require('cwc.mode.Type');
goog.require('cwc.mode.json.Mod');
goog.require('cwc.mode.text.Mod');
goog.require('cwc.utils.mime.Type');


/**
 * enum {Object}
 */
cwc.mode.raw.Config = {};


/**
 * JSON mode.
 */
cwc.mode.raw.Config[cwc.mode.Type.JSON] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  mime_types: [cwc.utils.mime.Type.JSON.type],
  mod: cwc.mode.json.Mod,
  name: 'JSON',
  template: 'json/blank.json',
});


/**
 * Text mode.
 */
cwc.mode.raw.Config[cwc.mode.Type.TEXT] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  mime_types: [
    cwc.utils.mime.Type.TEXT.type,
    cwc.utils.mime.Type.CSS.type,
  ],
  mod: cwc.mode.text.Mod,
  name: 'Text',
  template: 'text/blank.txt',
});
