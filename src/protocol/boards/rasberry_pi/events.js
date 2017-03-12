/**
 * @fileoverview Raspberry Pi Event definitions.
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
goog.provide('cwc.protocol.raspberryPi.Events');



/**
 * Custom events.
 * @enum {string}
 */
cwc.protocol.raspberryPi.Events.Type = {
  RECIEVED_DATA: 'recieved_data',
};


/**
 * @param {Object|number} data
 * @final
 */
cwc.protocol.raspberryPi.Events.recievedData = function(data) {
  return new cwc.protocol.ev3.Events.Data_(
      cwc.protocol.raspberryPi.Events.Type.RECIEVED_DATA, data);
};


/**
 * @param {!cwc.protocol.ev3.Events.Type} type
 * @param {Object|number=} opt_data
 * @constructor
 * @final
 * @private
 */
cwc.protocol.raspberryPi.Events.Data_ = function(type, opt_data) {
  /** @type {!cwc.protocol.ev3.Events.Type} */
  this.type = type;

  /** @type {!Object|number} */
  this.data = opt_data || {};
};
