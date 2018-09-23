/**
 * @fileoverview Simulation Commands for the Sphero SPRK+ unit.
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
goog.provide('cwc.mode.sphero.sprkPlus.SimulationCommand');

goog.require('cwc.utils.Events');


/**
 * @param {!cwc.ui.Turtle} turtle
 * @constructor
 * @final
 */
cwc.mode.sphero.sprkPlus.SimulationCommand = function(turtle) {
  /** @type {!cwc.ui.Turtle} */
  this.turtle = turtle;

  /** @private {number} */
  this.angle_ = 0;

  /** @private {number} */
  this.heading_ = 0;

  /** @private {number} */
  this.scale_ = 1;

  /** @private {number} */
  this.speed_ = 20;

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events();
};


/**
 * Resets the monitor.
 */
cwc.mode.sphero.sprkPlus.SimulationCommand.prototype['__handshake__'] =
    function() {
  this.angle_ = 0;
  this.heading_ = 0;
  this.turtle.action('scale', this.scale_);
  this.turtle.action('speed', this.speed_);
  this.turtle.reset();
};


/**
 * @param {!Object} data
 */
cwc.mode.sphero.sprkPlus.SimulationCommand.prototype['roll'] = function(data) {
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
  this.turtle.action('fd', speed * 0.65);
};


/**
 * @param {!Object} data
 */
cwc.mode.sphero.sprkPlus.SimulationCommand.prototype['setRGB'] = function(
    data) {
  let hexColor = '#' +
    Number(data['red']).toString(16).padStart(2, 0) +
    Number(data['green']).toString(16).padStart(2, 0) +
    Number(data['blue']).toString(16).padStart(2, 0);
  if (hexColor === '#000000') {
    this.events_.debounce('setRGB', () => {
      this.turtle.action('pen', null);
    }, 450);
  } else {
    this.events_.debounce('setRGB', () => {
      this.turtle.action('pen', hexColor);
    }, 450);
  }
};


/**
 * @param {!Object} data
 */
cwc.mode.sphero.sprkPlus.SimulationCommand.prototype['position'] = function(
    data) {
  this.turtle.action('moveToXY', {'x': data['x'], 'y': data['y']});
};
