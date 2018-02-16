/**
 * @fileoverview Supported editor modes for the Coding with Chrome editor.
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
goog.provide('cwc.mode.Type');


/**
 * Enum of known editor modes.
 * @enum {string}
 */
cwc.mode.Type = {
  ARDUINO: 'arduino',
  BASIC: 'basic',
  BASIC_BLOCKLY: 'basic_blockly',
  COFFEESCRIPT: 'coffeescript',
  EV3: 'ev3',
  EV3_BLOCKLY: 'ev3_blockly',
  HTML5: 'html5',
  JAVASCRIPT: 'javascript',
  JSON: 'json',
  MBOT_BLOCKLY: 'mbot_blockly',
  MBOT_RANGER_BLOCKLY: 'mbot_ranger_blockly',
  NONE: 'none',
  PENCIL_CODE: 'pencil_code',
  PHASER: 'phaser',
  PHASER_BLOCKLY: 'phaser_blockly',
  PYTHON: 'python',
  RASPBERRY_PI: 'raspberry_pi',
  SPHERO: 'sphero',
  SPHERO_BLOCKLY: 'sphero_blockly',
  TEXT: 'text',
  TTS: 'tts',
};
