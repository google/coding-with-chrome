/**
 * @fileoverview Simulation Commands for mBot unit.
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
goog.provide('cwc.mode.makeblock.mbot.SimulationCommand');


/**
 * @param {!cwc.ui.Turtle} turtle
 * @constructor
 * @final
 */
cwc.mode.makeblock.mbot.SimulationCommand = function(turtle) {
  /** @type {!cwc.ui.Turtle} */
  this.turtle = turtle;

  /** @private {!number} */
  this.speed_ = 40;
};


/**
 * Resets the monitor.
 */
cwc.mode.makeblock.mbot.SimulationCommand.prototype['__handshake__'] = function(
    ) {
  this.speed_ = 0;
  this.turtle.action('speed', 3);
  this.turtle.reset();
};


/**
 * Move mBot forward or backward
 * @param  {Object} data data package
 */
cwc.mode.makeblock.mbot.SimulationCommand.prototype['movePower'] = function(
    data) {
  this.turtle.action('fd', data['power']);
};


/**
 * Turn mBot to a direction
 * @param  {Object} data   data package
 */
cwc.mode.makeblock.mbot.SimulationCommand.prototype['rotatePower'] = function(
    data) {
  this.turtle.action('rt', data['power']);
};
