/**
 * @fileoverview Runner command profile for the Raspberry Pi.
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
goog.provide('cwc.runner.profile.raspberryPi.Command');


/**
 * @param {!cwc.protocol.raspberryPi.Api} api
 * @constructor
 * @final
 */
cwc.runner.profile.raspberryPi.Command = function(api) {
  /** @type {!cwc.protocol.raspberryPi.Api} */
  this.api = api;

  if (!this.api) {
    console.error('Unable to get Raspberry Pi API!');
  }
};


/**
 * @param {Object} data data package
 */
cwc.runner.profile.raspberryPi.Command.prototype['sendSerial'] = function(
    data) {
  this.api.send(data['data']);
};


/**
 * @param {Object} data data package
 */
cwc.runner.profile.raspberryPi.Command.prototype['sendSerialText'] = function(
    data) {
  this.api.sendText(data['text']);
};
