/**
 * @fileoverview Gamepad helper.
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
goog.provide('cwc.utils.Gamepad');

goog.require('cwc.utils.Logger');

goog.require('goog.events.EventTarget');


/**
 * @constructor
 * @final
 */
cwc.utils.Gamepad = function() {
  /** @type {!string} */
  this.name = 'Gamepad';

  /** @type {number} */
  this.index = null;

  /** @type {number} */
  this.timestamp = -1;

  /** @private [array] */
  this.axesCache_ = [];

  /** @private [array] */
  this.buttonCache_ = [];

  /** @private {!goog.events.EventTarget} */
  this.eventHandler_ = new goog.events.EventTarget();

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


cwc.utils.Gamepad.prototype.prepare = function() {
  if (!navigator.getGamepads) {
    this.log_.warn('Gamepad support is not available!');
    return;
  }
  this.log_.info('Preparing ...');

  window.addEventListener('gamepadconnected',
    this.handleConnect_.bind(this));
  window.addEventListener('gamepaddisconnected',
   this.handleDisconnect_.bind(this));
};


/**
 * @param {!number} index
 */
cwc.utils.Gamepad.prototype.setGamepad = function(index) {
  this.index = index;
  this.log_.info('Set Gamepad to index', this.index);
};


/**
 * @return {!goog.events.EventTarget}
 */
cwc.utils.Gamepad.prototype.getEventHandler = function() {
  return this.eventHandler_;
};


/**
 * @param {number=} index
 * @return {Object}
 */
cwc.utils.Gamepad.prototype.getGamepad = function(index = this.index) {
  return navigator.getGamepads()[index];
};


/**
 * @param {Event} e
 * @private
 */
cwc.utils.Gamepad.prototype.handleConnect_ = function(e) {
  this.log_.info('Gamepad connected', e['gamepad']);
  this.setGamepad(e['gamepad']['index']);
  this.eventHandler_.dispatchEvent(
    cwc.utils.Gamepad.Events.connected(this.getGamepad()));
  this.handleTick_();
};


/**
 * @param {Event} e
 * @private
 */
cwc.utils.Gamepad.prototype.handleDisconnect_ = function(e) {
  this.log_.info('Gamepad disconnected', e['gamepad']);
  if (this.index === e['gamepad']['index']) {
    this.index = null;
    this.eventHandler_.dispatchEvent(cwc.utils.Gamepad.Events.disconnected());
  }
};


/**
 * @private
 */
cwc.utils.Gamepad.prototype.handleTick_ = function() {
  if (this.index === null) {
    return;
  }
  let gamepad = this.getGamepad();
  if (gamepad['timestamp'] > this.timestamp) {
    this.timestamp = gamepad['timestamp'];
    this.handleEvent_(gamepad);
  }
  window.requestAnimationFrame(this.handleTick_.bind(this));
};


/**
 * @param {Object} gamepad
 */
cwc.utils.Gamepad.prototype.handleEvent_ = function(gamepad) {
  gamepad['axes'].forEach((axis, index) => {
    if (axis !== this.axesCache_[index]) {
      this.axesCache_[index] = axis;
      this.eventHandler_.dispatchEvent(cwc.utils.Gamepad.Events.axisMoved(
        index, axis
      ));
      console.log(index, axis);
    }
  });
  gamepad['buttons'].forEach((button, index) => {
    if (button['pressed'] || this.buttonCache_[index] !== button['pressed']) {
      this.eventHandler_.dispatchEvent(cwc.utils.Gamepad.Events.buttonPressed(
        index, button['value']
      ));
      console.log(index, button);
    }
    this.buttonCache_[index] = button['pressed'];
  });
};
