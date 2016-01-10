/**
 * @fileoverview Support file types for Coding with Chrome.
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
goog.provide('cwc.file.Type');


/**
 * List of file format types.
 * @enum {string}
 * @export
 */
cwc.file.Type = {
  ADVANCED: 'advanced',
  ARDUINO: 'arduino',
  BASIC: 'basic',
  BASIC_ADVANCED: 'basic_advanced',
  BASIC_BLOCKLY: 'basic_blockly',
  BLOCKLY: 'blockly',
  CUSTOM: 'custom',
  CWC: 'cwc',
  COFFEESCRIPT: 'coffeescript',
  EV3: 'ev3',
  EV3_BLOCKLY: 'ev3_blockly',
  SPHERO: 'sphero',
  SPHERO_BLOCKLY: 'sphero_blockly',
  PENCIL_CODE: 'pencil_code',
  HTML: 'html',
  JSON: 'json',
  NONE: 'none',
  RAW: 'raw',
  PYTHON: 'python',
  SIMPLE: 'simple',
  TEXT: 'text',
  UNKNOWN: 'unknown'
};
