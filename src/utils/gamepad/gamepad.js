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

goog.require('cwc.utils.Gamepad.Events');
goog.require('cwc.utils.Gamepad.Mapping');
goog.require('cwc.utils.Logger');

goog.require('goog.events.EventTarget');


/**
 * @constructor
 * @final
 */
cwc.utils.Gamepad = function() {
  /** @type {string} */
  this.name = 'Gamepad';

  /** @type {number} */
  this.index = -1;

  /** @private {Object} */
  this.cache_ = {
    'axes': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'buttons': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'timestamp': -1,
  };

  /** @private {!goog.events.EventTarget} */
  this.eventTarget_ = new goog.events.EventTarget();

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
 * @param {number} index
 */
cwc.utils.Gamepad.prototype.setGamepad = function(index) {
  this.index = index;
  this.log_.info('Set Gamepad to index', this.index);
};


/**
 * @return {!goog.events.EventTarget}
 */
cwc.utils.Gamepad.prototype.getEventTarget = function() {
  return this.eventTarget_;
};


/**
 * @param {number=} index
 * @return {Object}
 */
cwc.utils.Gamepad.prototype.getGamepad = function(index = this.index) {
  if (index === -1) {
    return null;
  }
  return navigator.getGamepads()[index];
};


/**
 * @param {number=} shift
 * @return {number}
 */
cwc.utils.Gamepad.prototype.getLeftAxisAngle = function(shift) {
  return cwc.utils.Gamepad.getAngle(
    this.cache_['axes'][0], this.cache_['axes'][1], shift);
};


/**
 * @param {Event} e
 * @private
 */
cwc.utils.Gamepad.prototype.handleConnect_ = function(e) {
  this.log_.info('Gamepad connected', e['gamepad']);
  this.setGamepad(e['gamepad']['index']);
  this.eventTarget_.dispatchEvent(
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
    this.index = -1;
    this.cache_['timestamp'] = -1;
    this.eventTarget_.dispatchEvent(cwc.utils.Gamepad.Events.disconnected());
  }
};


/**
 * @private
 */
cwc.utils.Gamepad.prototype.handleTick_ = function() {
  let gamepad = this.getGamepad();
  if (!gamepad) {
    return;
  }
  if (gamepad['timestamp'] > this.cache_['timestamp']) {
    this.handleEvent_(gamepad);
    this.cache_['timestamp'] = gamepad['timestamp'];
  }
  window.setTimeout(this.handleTick_.bind(this), 33);
};


/**
 * @param {!Object} gamepad
 */
cwc.utils.Gamepad.prototype.handleEvent_ = function(gamepad) {
  let changed = false;

  // Checking current status for each single axes.
  gamepad['axes'].forEach((axis, index) => {
    let mappedIndex = cwc.utils.Gamepad.getIndex(index, 'axes', gamepad);
    // Smooth axes to avoid false triggers from vibrations.
    if (axis > -0.04 && axis < 0.04) {
      axis = 0;
    }
    if (axis !== this.cache_['axes'][mappedIndex]) {
      this.cache_['axes'][mappedIndex] = axis;
      this.eventTarget_.dispatchEvent(cwc.utils.Gamepad.Events.axisMoved(
        mappedIndex, axis
      ));
      changed = true;
    }
  });

  // Checking current status for each single button.
  gamepad['buttons'].forEach((button, index) => {
    let mappedIndex = cwc.utils.Gamepad.getIndex(index, 'buttons', gamepad);
    if (this.cache_['buttons'][mappedIndex] !== button['value']) {
      this.cache_['buttons'][mappedIndex] = button['value'];
      this.eventTarget_.dispatchEvent(cwc.utils.Gamepad.Events.buttonPressed(
        mappedIndex, button['value']
      ));
      changed = true;
    }
  });

  if (changed) {
    // Create an immutable version of the current cache for the event.
    this.eventTarget_.dispatchEvent(cwc.utils.Gamepad.Events.update(
      /** @type {Object} */ (JSON.parse(JSON.stringify(this.cache_)))));
  }
};


/**
 * @param {number} x
 * @param {number} y
 * @param {number=} shift (default: 90)
 * @return {number}
 */
cwc.utils.Gamepad.getAngle = function(x, y, shift = 90) {
  let angle = 0;
  if (y || x) {
    angle = Math.atan2(y, x) * 180 / Math.PI + shift;
    if (angle < 0) {
      angle += 360;
    }
  }
  return angle;
};


/**
 * Return's mapped index for supported controllers.
 * @param {number} index
 * @param {string} type
 * @param {!Object} gamepad
 * @return {number}
 */
cwc.utils.Gamepad.getIndex = function(index, type, gamepad) {
  if (gamepad['mapping'] === 'standard') {
    return index;
  }

  if (gamepad['mapping'] === '' && cwc.utils.Gamepad.Mapping[gamepad['id']]) {
    let mapping = cwc.utils.Gamepad.Mapping[gamepad['id']][type];
    if (typeof mapping[index] !== 'undefined') {
      return mapping[index] || 0;
    }
  }

  return index || 0;
};
