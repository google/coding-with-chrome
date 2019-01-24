/**
 * @fileoverview Command Messenger for the Coding with Chrome editor.
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
goog.provide('cwc.framework.MessengerCommand');


/**
 * @param {!cwc.framework.Messenger} messenger
 * @constructor
 * @struct
 * @final
 */
cwc.framework.MessengerCommand = function(messenger) {
  /** @type {string} */
  this.name = 'Messenger Display';

  /** @private {!cwc.framework.Messenger} */
  this.messenger_ = messenger;

  // Global mapping
  if (typeof window['cwcMessengerCommand'] === 'undefined') {
    window['cwcMessengerCommand'] = this;
  }
};


/**
 * @param {number} time in msec
 * export
 */
cwc.framework.MessengerCommand.prototype['delay'] = function(time) {
  this.messenger_.delay(time);
};
