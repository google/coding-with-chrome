/**
 * @fileoverview Code Editor for the Coding with Chrome editor.
 *
 * @license Copyright 2017 The Coding with Chrome Authors.
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

goog.provide('cwc.ui.EditorAutocompleteList');

cwc.ui.EditorAutocompleteList = function() {};


/**
 * Get filtered globals.
 * @return {!Object}
 */
cwc.ui.EditorAutocompleteList.getGlobals = function() {
  let globals = {};
  let blacklist = {
    'window': true,
    'CLOSURE_DEFINES': true,
    'COMPILED': true,
    'top': true,
    'self': true,
    'parent': true,
    'opener': true,
    'frames': true,
    'i18soy': true,
    'i18t': true,
    'Locales': true,
    '$jscomp': true,
    '__proto__': true,
  };
  if (!window) {
    return globals;
  }

  for (let property in window) {
    if (Object.prototype.hasOwnProperty.call(window, property) &&
        !property.includes('$$jscomp$') &&
        !property.includes('$JSCompiler_') &&
        !property.includes('$cwc$') &&
        !property.includes('$goog$') &&
        !property.includes('$jscomp$') &&
        !property.includes('$soy$') &&
        !property.includes('$soydata$') &&
        !property.includes('Material') &&
        !property.includes('chrome') &&
        !property.includes('closure_lm') &&
        !property.includes('webkit') &&
        !property.startsWith('cwc') &&
        !blacklist[property]) {
       globals[property] = window[property];
    }
  }
  return globals;
};
