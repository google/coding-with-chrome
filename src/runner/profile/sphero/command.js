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
goog.provide('cwc.runner.profile.sphero.Command');


/**
 * @param {!cwc.protocol.sphero.Api} api
 * @constructor
 * @struct
 * @final
 */
cwc.runner.profile.sphero.Command = function(api) {
  /** @type {cwc.protocol.sphero.Api} */
  this.api = api;
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.sphero.Command.prototype.setRGB = function(data) {
  this.api.setRGB(data['red'], data['green'], data['blue'], data['persistent']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.sphero.Command.prototype.roll = function(data) {
  this.api.roll(data['speed'], data['heading'], data['state']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.sphero.Command.prototype.boost = function(data) {
  this.api.boost(data['enable']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.sphero.Command.prototype.setBackLed = function(data) {
  this.api.setBackLed(data['brightness']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.sphero.Command.prototype.setMotionTimeout = function(data) {
  this.api.setMotionTimeout(data['timeout']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.sphero.Command.prototype.calibrate = function(data) {
  this.api.calibrate(data['heading']);
};


cwc.runner.profile.sphero.Command.prototype.stop = function() {
  this.api.stop();
};


cwc.runner.profile.sphero.Command.prototype.sleep = function() {
  this.api.sleep();
};
