/**
 * @fileoverview Simulation Commands for the EV3 unit.
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
goog.provide('cwc.mode.sphero.SimulationCommand');


/**
 * @param {!cwc.ui.Turtle} turtle
 * @constructor
 * @final
 */
cwc.mode.sphero.SimulationCommand = function(turtle) {
  /** @type {!cwc.ui.Turtle} */
  this.turtle = turtle;

  /** @private {!number} */
  this.angle_ = 0;

  /** @private {!number} */
  this.heading_ = 0;

  /** @private {!number} */
  this.speed_ = 40;
};


/**
 * Resets the monitor.
 */
cwc.mode.sphero.SimulationCommand.prototype['__handshake__'] = function() {
  this.speed_ = 0;
  this.turtle.action('speed', 1);
  this.turtle.action('scale', 1);
  this.turtle.reset();
};


/**
 * @param {!Object} data
 */
cwc.mode.sphero.SimulationCommand.prototype['roll'] = function(data) {
  let speed = this.speed_ = data['speed'] === undefined ?
    this.speed_ : data['speed'];
  let heading = this.heading_ = data['heading'] === undefined ?
    this.heading_ : data['heading'];
  let angle = heading - this.angle_;
  if (angle == 360) {
    angle = 0;
  } else if (angle > 360) {
    angle -= 360;
  } else if (angle < 0) {
    angle += 360;
  }
  this.angle_ = heading;
  this.turtle.action('rt', angle);
  this.turtle.action('fd', speed);
};
