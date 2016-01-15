/**
 * @fileoverview Runner profile for Sphero ball.
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
goog.provide('cwc.runner.profile.Sphero');



/**
 * @param {!cwc.protocol.sphero.Api} api
 * @constructor
 * @struct
 * @final
 */
cwc.runner.profile.Sphero = function(api) {
  /* @type {cwc.protocol.sphero.Api} */
  this.api = api;
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.Sphero.prototype.setRGB = function(data) {
  this.api.setRGB(data['red'], data['green'], data['blue'],
      data['persistant'], data['delay']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.Sphero.prototype.roll = function(data) {
  this.api.roll(data['speed'], data['heading'], data['state'], data['delay']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.Sphero.prototype.boost = function(data) {
  this.api.boost(data['time'], data['heading'], data['delay']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.Sphero.prototype.setBackLed = function(data) {
  this.api.setBackLed(data['brightness'], data['delay']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.Sphero.prototype.setMotionTimeout = function(data) {
  this.api.setMotionTimeout(data['timeout'], data['delay']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.Sphero.prototype.calibrate = function(data) {
  this.api.calibrate(data['heading']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.Sphero.prototype.stop = function(data) {
  this.api.stop(data['delay']);
};


/**
 * @param {!Object} opt_data
 */
cwc.runner.profile.Sphero.prototype.sleep = function(opt_data) {
  this.api.sleep();
};
