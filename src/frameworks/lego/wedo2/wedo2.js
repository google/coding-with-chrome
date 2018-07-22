/**
 * @fileoverview EV3 framework for the messenger instance.
 * This EV3 framework will be used inside the webview / iframe sandbox,
 * to access the EV3 over the Bluetooth instance.
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
goog.provide('cwc.framework.lego.WeDo2');

goog.require('cwc.framework.Messenger');


/**
 * @constructor
 * @struct
 * @final
 * @export
 */
cwc.framework.lego.WeDo2 = function() {
  /** @type {string} */
  this.name = 'WeDo 2.0 Framework';

  /** @private {!cwc.framework.Messenger} */
  this.messenger_ = new cwc.framework.Messenger()
    .setListenerScope(this);
};


/**
 * Stops movements.
 * @param {number=} delay in msec
 * @export
 */
cwc.framework.lego.WeDo2.prototype.stop = function(delay) {
  this.messenger_.send('stop', delay);
};


/**
 * Plays tone.
 * @param {number} frequency
 * @param {number=} duration
 * @param {number=} delay in msec
 * @export
 */
cwc.framework.lego.WeDo2.prototype.playTone = function(frequency, duration,
    delay) {
  this.messenger_.send('playTone', {
    'frequency': frequency,
    'duration': duration}, delay);
};


/**
 * Sets RGB color.
 * @param {number} color
 * @param {number=} delay in msec
 * @export
 */
cwc.framework.lego.WeDo2.prototype.setRGB = function(color, delay) {
  this.messenger_.send('setRGB', {
    'color': color}, delay);
};


/**
 * Sets motor power.
 * @param {number} power
 * @param {number=} port
 * @param {number=} delay in msec
 * @export
 */
cwc.framework.lego.WeDo2.prototype.movePower = function(power, port, delay) {
  this.messenger_.send('movePower', {
    'power': power,
    'port': port}, delay);
};


/**
 * Sets motor speed.
 * @param {number} speed 0-9
 * @param {boolean=} reverse
 * @param {number=} port
 * @param {number=} delay in msec
 * @export
 */
cwc.framework.lego.WeDo2.prototype.moveSpeed = function(speed, reverse = false,
    port, delay) {
  this.messenger_.send('moveSpeed', {
    'speed': speed,
    'reverse': reverse,
    'port': port}, delay);
};


// Global mapping
window['wedo2'] = new cwc.framework.lego.WeDo2();
