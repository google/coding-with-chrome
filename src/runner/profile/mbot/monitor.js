/**
 * @fileoverview Runner monitor profile for Makeblock mBots.
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
goog.provide('cwc.runner.profile.mbot.Monitor');



/**
 * @param {!cwc.ui.Turtle} turtle
 * @constructor
 * @struct
 * @final
 */
cwc.runner.profile.mbot.Monitor = function(turtle) {
  /** @type {!cwc.ui.Turtle} */
  this.turtle = turtle;

  /** @private {!number} */
  this.speed_ = 40;
};


/**
 * Resets the monitor.
 */
cwc.runner.profile.mbot.Monitor.prototype.reset = function() {
  this.speed_ = 0;
};


/**
 * move mbot forward or backward
 * @param  {Object} data data package
 */
cwc.runner.profile.mbot.Monitor.prototype.movePower = function(data) {
  if (data['speed'] > 0) {
    this.turtle.action('fd', data['speed']);
  } else {
    this.turtle.action('bk', data['speed']);
  }
};


/**
 * turn mbot to a direction
 * @param  {Object} data   data package
 */
cwc.runner.profile.mbot.Monitor.prototype.rotatePower = function(data) {
  if (data['speed'] > 0) {
    this.turtle.action('rt', data['speed']);
  } else {
    this.turtle.action('lt', data['speed']);
  }
};
