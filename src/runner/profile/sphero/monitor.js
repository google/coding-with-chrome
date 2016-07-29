/**
 * @fileoverview Runner command profile for Sphero ball.
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
goog.provide('cwc.runner.profile.sphero.Monitor');



/**
 * @param {!cwc.ui.Turtle} turtle
 * @constructor
 * @struct
 * @final
 */
cwc.runner.profile.sphero.Monitor = function(turtle) {
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
cwc.runner.profile.sphero.Monitor.prototype.reset = function() {
  this.angle_ = 0;
  this.heading_ = 0;
  this.speed_ = 0;
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.sphero.Monitor.prototype.roll = function(data) {
  var speed = this.speed_ = data['speed'] === undefined ?
    this.speed_ : data['speed'];
  var heading = this.heading_ = data['heading'] === undefined ?
    this.heading_ :  data['heading'];
  var angle = heading - this.angle_;
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
