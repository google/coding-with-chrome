/**
 * @fileoverview TTS (Text To Speech) modifications.
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
goog.provide('cwc.mode.tts.Mod');

goog.require('cwc.mode.tts.Editor');
goog.require('cwc.mode.tts.Layout');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.tts.Mod = function(helper) {

  /** @type {cwc.mode.tts.Layout} */
  this.layout = new cwc.mode.tts.Layout(helper);

  /** @type {cwc.mode.tts.Editor} */
  this.editor = new cwc.mode.tts.Editor(helper);
};


/**
 * Decorates the different parts of the modification.
 */
cwc.mode.tts.Mod.prototype.decorate = function() {
  this.layout.decorate();
  this.editor.decorate();
};
