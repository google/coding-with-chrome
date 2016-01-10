/**
 * @fileoverview Runner profile for EV3 unit.
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
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.ev3.Monitor.prototype.moveSteps = function(data) {
  if (data['invert']) {
    this.turtle.action('bk', data['steps']);
  } else {
    this.turtle.action('fd', data['steps']);
  }
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.ev3.Monitor.prototype.rotateAngle = function(data) {
  if (data['invert']) {
    this.turtle.action('lt', data['angle']);
  } else {
    this.turtle.action('rt', data['angle']);
  }
};
