/**
 * @fileoverview Display Messenger for the Coding with Chrome editor.
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
goog.provide('cwc.framework.MessengerDisplay');


/**
 * @param {!Function} messenger
 * @constructor
 * @struct
 * @final
 */
cwc.framework.MessengerDisplay = function(messenger) {
  /** @type {string} */
  this.name = 'Messenger Display';

  /** @private {!cwc.Messenger} */
  this.messenger_ = messenger;

  // Global mapping
  if (typeof window['cwcMessengerDisplay'] === 'undefined') {
    window['cwcMessengerDisplay'] = this;
  }
};


/**
 * export
 */
cwc.framework.MessengerDisplay.prototype['clear'] = function() {
  this.messenger_.send('__displayClear__', {}, 250);
};


/**
 * @param {string} text
 * export
 */
cwc.framework.MessengerDisplay.prototype['displayText'] = function(text) {
  this.messenger_.send('__displayText__', {'text': text}, 250);
};
