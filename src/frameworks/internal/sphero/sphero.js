/**
 * @fileoverview Sphero framework for the runner instance.
 * This Sphero framework will be used by the runner instance, inside the webview
 * sandbox, to access the Sphero over the runner instance and the Bluetooth
 * interface.
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
  this.code = function() {
    code(this);
  }.bind(this);

  /** @type {!cwc.framework.Runner} */
  this.runner = new cwc.framework.Runner(this.code, this);

  /** @private {!function(?)} */
  this.emptyFunction_ = function() {};

  /** @type {!function(?)} */
  this.collisionEvent = this.emptyFunction_;

  // External commands
  this.runner.addCommand('collision', this.handleCollision_);
};


/**
 * @param {!number} red 0-255
 * @param {!number} green 0-255
 * @param {!number} blue 0-255
 * @param {boolean=} opt_persistent
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Sphero.prototype.setRGB = function(red, green, blue,
    opt_persistent, opt_delay) {
  this.runner.send('setRGB', {
    'red': red,
    'green': green,
    'blue': blue,
    'persistent': opt_persistent}, opt_delay);
};


/**
 * @param {!number} brightness 0-100
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Sphero.prototype.setBackLed = function(brightness, opt_delay) {
  this.runner.send('setBackLed', {'brightness': brightness}, opt_delay);
};


/**
 * @param {!number} timeout in msec
 * @param {number=} opt_delay
 * @export
 */
cwc.framework.Sphero.prototype.setMotionTimeout = function(timeout, opt_delay) {
  this.runner.send('setMotionTimeout', {'timeout': timeout}, opt_delay);
};


/**
 * @param {number=} opt_speed 0-255
 * @param {number=} opt_heading 0-359
 * @param {boolean=} opt_state
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Sphero.prototype.roll = function(opt_speed, opt_heading,
    opt_state, opt_delay) {
  this.runner.send('roll', {
    'speed': opt_speed,
    'heading': opt_heading,
    'state': opt_state}, opt_delay);
};


/**
 * @param {!number} time in sec
 * @param {number=} speed 0-255
 * @param {number=} opt_heading 0-359
 * @param {boolean=} opt_stop
 * @export
 */
cwc.framework.Sphero.prototype.rollTime = function(time, speed = 20,
    opt_heading, opt_stop) {
  let rollTime = Math.floor(time*2) || 0;
  for (let num = 0; num < rollTime; num++) {
    this.roll(speed, opt_heading, true, 500);
  }
  if (opt_stop) {
    this.roll(0, opt_heading, true, 100);
  }
};


/**
 * @param {!boolean} enable
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Sphero.prototype.boost = function(enable, opt_delay) {
  this.runner.send('boost', {'enable': enable}, opt_delay);
};


/**
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Sphero.prototype.stop = function(opt_delay) {
  this.runner.send('stop', null, opt_delay);
};


/**
 * @param {!number} heading
 * @export
 */
cwc.framework.Sphero.prototype.calibrate = function(heading) {
  this.runner.send('calibrate', {'heading': heading});
};


/**
 * @export
 */
cwc.framework.Sphero.prototype.sleep = function() {
  this.runner.send('sleep');
};


/**
 * @param {!Function} func
 * @export
 */
cwc.framework.Sphero.prototype.onCollision = function(func) {
  if (goog.isFunction(func)) {
    this.collisionEvent = func;
  }
};


/**
 * @param {!number} data
 * @private
 */
cwc.framework.Sphero.prototype.handleCollision_ = function(data) {
  this.collisionEvent(data);
};
