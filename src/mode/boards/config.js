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
goog.provide('cwc.mode.boards.Config');

goog.require('cwc.mode.Mod');
goog.require('cwc.mode.Service');
goog.require('cwc.mode.Type');
goog.require('cwc.mode.aiy.Mod');
// goog.require('cwc.mode.raspberryPi.advanced.Mod');
goog.require('cwc.utils.mime.Type');


/**
 * enum {Object}
 */
cwc.mode.boards.Config = {};


/**
 * AIY mode.
 */
cwc.mode.boards.Config[cwc.mode.Type.AIY] = new cwc.mode.Mod({
  authors: ['Filip Stanis'],
  mime_types: [cwc.utils.mime.Type.CWC.type],
  mod: cwc.mode.aiy.Mod,
  name: 'AIY',
  template: 'aiy/blank.cwc',
});


/**
 * Raspberry Pi mode.
 * @deprecated Disabled because needs re-implementation and used less than 0.1%.
 */
// cwc.mode.boards.Config[cwc.mode.Type.RASPBERRY_PI] = new cwc.mode.Mod({
//   authors: ['Markus Bordihn'],
//   icon: 'mode_edit',
//   mime_types: [cwc.utils.mime.Type.CWC.type],
//   mod: cwc.mode.raspberryPi.advanced.Mod,
//   name: 'Raspberry Pi',
//   template: 'raspberry_pi/blank.cwc',
// });
