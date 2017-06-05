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
goog.provide('cwc.ui.EditorAutocompleteBlacklistCodes');
goog.provide('cwc.ui.EditorAutocompleteBlacklistKeys');


/**
 * Ignore the following KeyboardEvent.code for auto complete.
 * @enum {boolean}
 */
cwc.ui.EditorAutocompleteBlacklistCodes = {
  'Alt': true,
  'AltLeft': true,
  'AltRight': true,
  'ArrowDown': true,
  'ArrowLeft': true,
  'ArrowRight': true,
  'ArrowUp': true,
  'Backquote': true,
  'Backslash': true,
  'Backspace': true,
  'Comma': true,
  'ContextMenu': true,
  'ControlLeft': true,
  'ControlRight': true,
  'Ctrl': true,
  'Delete': true,
  'Digit1': true,
  'Digit2': true,
  'Digit3': true,
  'Digit4': true,
  'Digit5': true,
  'Digit6': true,
  'Digit7': true,
  'Digit8': true,
  'Digit9': true,
  'End': true,
  'Enter': true,
  'Escape': true,
  'F1': true,
  'F10': true,
  'F11': true,
  'F12': true,
  'F2': true,
  'F3': true,
  'F4': true,
  'F5': true,
  'F6': true,
  'F7': true,
  'F8': true,
  'F9': true,
  'Home': true,
  'Insert': true,
  'Minus': true,
  'NumpadAdd': true,
  'NumpadDivide': true,
  'NumpadMultiply': true,
  'NumpadSubtract': true,
  'Shift': true,
  'ShiftLeft': true,
  'ShiftRight': true,
  'Space': true,
  'Tab': true,
};


/**
 * Ignore the following KeyboardEvent.key for auto complete.
 * @enum {boolean}
 */
cwc.ui.EditorAutocompleteBlacklistKeys = {
  '#': true,
  '*': true,
  '+': true,
  '@': true,
  '|': true,
};
