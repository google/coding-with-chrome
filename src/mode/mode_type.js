/**
 * @fileoverview Supported editor modes for the Coding with Chrome editor.
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
goog.provide('cwc.mode.Type');


/**
 * Enum of known editor modes.
 * @enum {string}
 */
cwc.mode.Type = {
  ARDUINO: 'arduino',
  BASIC: 'basic',
  BASIC_ADVANCED: 'basic_advanced',
  BASIC_BLOCKLY: 'basic_blockly',
  COFFEESCRIPT: 'coffeescript',
  EV3: 'ev3',
  EV3_BLOCKLY: 'ev3_blockly',
  HTML5: 'html5',
  JSON: 'json',
  NONE: 'none',
  PENCIL_CODE: 'pencil_code',
  PYTHON: 'python',
  SPHERO: 'sphero',
  SPHERO_BLOCKLY: 'sphero_blockly',
  TEXT: 'text',
  TTS: 'tts'
};
