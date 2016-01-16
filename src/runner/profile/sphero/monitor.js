/**
 * @fileoverview Runner command profile for Sphero ball.
 *
 * @license Copyright 2015 Google Inc. All Rights Reserved.
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

  /** @type {!number} */
  this.angle = 0;
};


/**
 * Resets the monitor.
 */
cwc.runner.profile.sphero.Monitor.prototype.reset = function() {
  this.angle = 0;
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.sphero.Monitor.prototype.roll = function(data) {
  var angle = data['heading'] - this.angle;
  if (angle == 360) {
    angle = 0;
  } else if (angle > 360) {
    angle -= 360;
  } else if (angle < 0) {
    angle += 360;
  }
  this.angle = data['heading'];
  this.turtle.action('rt', angle);
  this.turtle.action('fd', data['speed']);
};
