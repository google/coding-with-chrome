/**
 * @fileoverview Sphero framework for the messenger instance.
 * This Sphero framework will be used by the messenger instance to access the
 * Sphero over the messenger instance and the Bluetooth interface.
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

goog.require('cwc.framework.Messenger');
goog.require('cwc.framework.MessengerCommand');
goog.require('cwc.framework.MessengerDisplay');


/**
 * @constructor
 * @struct
 * @final
 * @export
 */
cwc.framework.Sphero = function() {
  /** @type {string} */
  this.name = 'Sphero Framework';

  /** @type {!function(?)} */
  this.collisionEvent = function() {};

  /** @private {!cwc.framework.Messenger} */
  this.messenger_ = new cwc.framework.Messenger()
    .setListenerScope(this)
    .addListener('__EVENT__COLLISION', this.handleCollision_)
    .addListener('__EVENT__changed_values', function(e) {
      console.log('Changed values event', e);
    })
    .addListener('__EVENT__changed_speed', function(e) {
      console.log('Changed speed event', e);
    });

  /** @private {!cwc.framework.MessengerCommand} */
  this.messengerCommand_ = new cwc.framework.MessengerCommand(this.messenger_);

    /** @private {!cwc.framework.MessengerDisplay} */
  this.messengerDisplay_ = new cwc.framework.MessengerDisplay(this.messenger_);
};


/**
 * @param {boolean=} enable
 * @export
 */
cwc.framwork.Sphero.prototype.setStabilization = function(enable) {
  this.messenger_.send('setStabilization', {'enable': enable});
};


/**
 * @param {number} brightness 0-100
 * @param {number=} delay in msec
 * @export
 */
cwc.framework.Sphero.prototype.setBackLed = function(brightness, delay) {
  this.messenger_.send('setBackLed', {'brightness': brightness}, delay);
};


/**
 * @param {number} red 0-255
 * @param {number} green 0-255
 * @param {number} blue 0-255
 * @param {boolean=} persistent
 * @param {number=} delay in msec
 * @export
 */
cwc.framework.Sphero.prototype.setRGB = function(red, green, blue,
    persistent, delay) {
  this.messenger_.send('setRGB', {
    'red': red,
    'green': green,
    'blue': blue,
    'persistent': persistent}, delay);
};


/**
 * @param {number} timeout in msec
 * @param {number=} delay
 * @export
 */
cwc.framework.Sphero.prototype.setMotionTimeout = function(timeout, delay) {
  this.messenger_.send('setMotionTimeout', {'timeout': timeout}, delay);
};


/**
 * @param {number=} speed 0-255
 * @param {number=} heading 0-359
 * @param {boolean=} state
 * @param {number=} delay in msec
 * @export
 */
cwc.framework.Sphero.prototype.roll = function(speed, heading, state, delay) {
  this.messenger_.send('roll', {
    'speed': speed,
    'heading': heading,
    'state': state}, delay);
};


/**
 * @param {number} time in sec
 * @param {number=} speed 0-255
 * @param {number=} heading 0-359
 * @param {boolean=} stop
 * @export
 */
cwc.framework.Sphero.prototype.rollTime = function(time, speed = 20, heading,
    stop) {
  let rollTime = Math.floor(time * 2) || 0;
  for (let num = 0; num < rollTime; num++) {
    this.roll(speed, heading, true, 500);
  }
  if (stop) {
    this.roll(0, heading, true, 100);
  }
};


/**
 * @param {boolean} enable
 * @param {number=} delay in msec
 * @export
 */
cwc.framework.Sphero.prototype.boost = function(enable, delay) {
  this.messenger_.send('boost', {'enable': enable}, delay);
};


/**
 * @param {number=} delay in msec
 * @export
 */
cwc.framework.Sphero.prototype.stop = function(delay) {
  this.messenger_.send('stop', null, delay);
};


/**
 * @param {number} heading
 * @export
 */
cwc.framework.Sphero.prototype.calibrate = function(heading) {
  this.messenger_.send('calibrate', {'heading': heading});
};


/**
 * @export
 */
cwc.framework.Sphero.prototype.sleep = function() {
  this.messenger_.send('sleep');
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
 * @param {number} data
 * @private
 */
cwc.framework.Sphero.prototype.handleCollision_ = function(data) {
  this.collisionEvent(data);
};


// Global mapping
window['sphero'] = new cwc.framework.Sphero();

