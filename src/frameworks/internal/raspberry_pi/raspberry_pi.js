/**
 * @fileoverview Raspberry Pi framework for the runner instance.
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
goog.provide('cwc.framework.RaspberryPi');

goog.require('cwc.framework.Runner');


/**
 * @constructor
 * @param {!Function} code
 * @struct
 * @final
 * @export
 */
cwc.framework.RaspberryPi = function(code) {
  /** @type {string} */
  this.name = 'Raspberry Pi Framework';

  /** @type {Function} */
  this.code = code;

  /** @type {!cwc.framework.Runner} */
  this.runner = new cwc.framework.Runner()
    .setScope(this)
    .setCallback(this.code);

  /** @type {!function(?)} */
  this.dataEvent = function() {};

  // External commands
  this.runner.addCommand('recievedData', this.handleData_);
};


/**
 * Sends serial data.
 * @param {!string} data
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.RaspberryPi.prototype.sendSerial = function(data, opt_delay) {
  this.runner.send('sendSerial', {'data': data}, opt_delay);
};


/**
 * Sends serial text.
 * @param {!string} text
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.RaspberryPi.prototype.sendSerialText = function(text, opt_delay) {
  this.runner.send('sendSerialText', {'text': text}, opt_delay);
};


/**
 * @param {!Function} func
 * @export
 */
cwc.framework.RaspberryPi.prototype.onData = function(func) {
  if (goog.isFunction(func)) {
    this.dataEvent = func;
  }
};


/**
 * @param {!number} data
 * @private
 */
cwc.framework.RaspberryPi.prototype.handleData_ = function(data) {
  this.dataEvent(data);
};
