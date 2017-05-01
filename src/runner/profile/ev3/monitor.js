/**
 * @fileoverview Runner monitor profile for EV3 unit.
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
goog.provide('cwc.runner.profile.ev3.Monitor');


/**
 * @param {!cwc.ui.Turtle} turtle
 * @constructor
 * @struct
 * @final
 */
cwc.runner.profile.ev3.Monitor = function(turtle) {
  /** @type {!cwc.ui.Turtle} */
  this.turtle = turtle;

  /** @private {!number} */
  this.speed_ = 40;
};


/**
 * Resets the monitor.
 */
cwc.runner.profile.ev3.Monitor.prototype.reset = function() {
  this.speed_ = 0;
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.ev3.Monitor.prototype.moveSteps = function(data) {
  if (data['speed'] > 0) {
    this.turtle.action('fd', data['distance'] * 2.5 || data['steps']);
  } else if (data['speed'] < 0) {
    this.turtle.action('bk', data['distance'] * 2.5 || data['steps']);
  }
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.ev3.Monitor.prototype.rotateSteps = function(data) {
  if (data['angle']) {
    if (data['speed'] > 0) {
      this.turtle.action('rt', data['angle']);
    } else if (data['speed'] < 0) {
      this.turtle.action('lt', data['angle']);
    }
  }
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.ev3.Monitor.prototype.customRotateSteps = function(data) {
  if (data['angle']) {
    if (data['speed'] > 0) {
      this.turtle.action('rt', data['angle']);
    } else if (data['speed'] < 0) {
      this.turtle.action('lt', data['angle']);
    }
  }
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.ev3.Monitor.prototype.movePen = function(data) {
  this.turtle.action('pen', data['color'] || !data['invert']);
  if (data['invert']) {
    this.turtle.action('pu');
  }
};
