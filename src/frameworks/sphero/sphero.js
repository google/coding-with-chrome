/**
 * @fileoverview Sphero framework for the runner instance.
 * This Sphero framework will be used by the runner instance, inside the webview
 * sandbox, to access the Sphero over the runner instance and the Bluetooth
 * interface.
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
goog.provide('cwc.framework.Sphero');

goog.require('cwc.framework.Runner');



/**
 * @constructor
 * @param {!Function} code
 * @struct
 * @final
 * @export
 */
cwc.framework.Sphero = function(code) {
  /** @type {string} */
  this.name = 'Sphero Framework';

  /** @type {Function} */
  this.code = function() {code(this);}.bind(this);

  /** @type {!cwc.framework.Runner} */
  this.runner = new cwc.framework.Runner(this.code);
};


/**
 * @param {!number} red 0-255
 * @param {!number} green 0-255
 * @param {!number} blue 0-255
 * @param {boolean=} opt_persistant
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Sphero.prototype.setRGB = function(red, green, blue,
    opt_persistant, opt_delay) {
  this.runner.send('setRGB', {
    'red': red,
    'green': green,
    'blue': blue,
    'persistant': opt_persistant,
    'delay': opt_delay });
};


/**
 * @param {!number} brightness 0-100
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Sphero.prototype.setBackLed = function(brightness, opt_delay) {
  this.runner.send('setBackLed', {
    'brightness': brightness,
    'delay': opt_delay });
};


/**
 * @param {!number} speed 0-255
 * @param {number=} opt_heading 0-359
 * @param {boolean=} opt_state
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Sphero.prototype.move = function(speed, opt_heading, opt_state,
    opt_delay) {
  this.runner.send('move', {
    'speed': speed,
    'heading': opt_heading,
    'state': opt_state,
    'delay': opt_delay });
};


/**
 * @param {number=} opt_time in sec
 * @param {number=} opt_heading 0-359
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Sphero.prototype.boost = function(opt_time, opt_heading,
    opt_delay) {
  this.runner.send('boost', {
    'time': opt_time,
    'heading': opt_heading,
    'delay': opt_delay });
};


/**
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Sphero.prototype.stop = function(opt_delay) {
  this.runner.send('stop', {'delay': opt_delay });
};


/**
 * @param {!number} heading
 * @export
 */
cwc.framework.Sphero.prototype.calibrate = function(heading) {
  this.runner.send('calibrate', {'heading': heading });
};


/**
 * @export
 */
cwc.framework.Sphero.prototype.sleep = function() {
  this.runner.send('sleep');
};
