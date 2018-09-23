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
goog.provide('cwc.mode.markup.Config');

goog.require('cwc.mode.Mod');
goog.require('cwc.mode.Service');
goog.require('cwc.mode.Type');
goog.require('cwc.mode.html5.Mod');
goog.require('cwc.utils.mime.Type');


/**
 * enum {Object}
 */
cwc.mode.markup.Config = {};


/**
 * HTML5 mode.
 */
cwc.mode.markup.Config[cwc.mode.Type.HTML5] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  auto_preview: true,
  icon: 'public',
  mime_types: [cwc.utils.mime.Type.HTML.type],
  mod: cwc.mode.html5.Mod,
  name: 'HTML 5',
  template: 'html5/blank.html',
});
