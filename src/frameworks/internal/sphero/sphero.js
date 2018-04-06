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
 * @param {boolean=} persistent
 * @param {number=} delay in msec
 * @export
 */
cwc.framework.Sphero.prototype.setRGB = function(red, green, blue,
    persistent, delay) {
  this.runner.send('setRGB', {
    'red': red,
    'green': green,
    'blue': blue,
    'persistent': persistent}, delay);
};


/**
 * @param {!number} brightness 0-100
 * @param {number=} delay in msec
 * @export
 */
cwc.framework.Sphero.prototype.setBackLed = function(brightness, delay) {
  this.runner.send('setBackLed', {'brightness': brightness}, delay);
};


/**
 * @param {!number} timeout in msec
 * @param {number=} delay
 * @export
 */
cwc.framework.Sphero.prototype.setMotionTimeout = function(timeout, delay) {
  this.runner.send('setMotionTimeout', {'timeout': timeout}, delay);
};


/**
 * @param {number=} speed 0-255
 * @param {number=} heading 0-359
 * @param {boolean=} state
 * @param {number=} delay in msec
 * @export
 */
cwc.framework.Sphero.prototype.roll = function(speed, heading, state, delay) {
  this.runner.send('roll', {
    'speed': speed,
    'heading': heading,
    'state': state}, delay);
};


/**
 * @param {!number} time in sec
 * @param {number=} speed 0-255
 * @param {number=} heading 0-359
 * @param {boolean=} stop
 * @export
 */
cwc.framework.Sphero.prototype.rollTime = function(time, speed = 20, heading,
    stop) {
  let rollTime = Math.floor(time*2) || 0;
  for (let num = 0; num < rollTime; num++) {
    this.roll(speed, heading, true, 500);
  }
  if (stop) {
    this.roll(0, heading, true, 100);
  }
};


/**
 * @param {!boolean} enable
 * @param {number=} delay in msec
 * @export
 */
cwc.framework.Sphero.prototype.boost = function(enable, delay) {
  this.runner.send('boost', {'enable': enable}, delay);
};


/**
 * @param {number=} delay in msec
 * @export
 */
cwc.framework.Sphero.prototype.stop = function(delay) {
  this.runner.send('stop', null, delay);
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
