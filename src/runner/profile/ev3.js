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
goog.provide('cwc.runner.profile.EV3');



/**
 * @param {!cwc.protocol.sphero.Api} api
 * @constructor
 * @struct
 * @final
 */
cwc.runner.profile.EV3 = function(api) {
  /** @type {!cwc.protocol.ev3.Api} */
  this.api = api;
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.EV3.prototype.playTone = function(data) {
  this.api.playTone(data['frequency'], data['duration'], data['volume'],
      data['delay']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.EV3.prototype.playSound = function(data) {
  this.api.playSound(data['file'], data['volume'], data['delay']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.EV3.prototype.showImage = function(data) {
  this.api.showImage(data['file'], data['delay']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.EV3.prototype.moveServo = function(data) {
  this.api.moveServo(data['steps'], data['invert'], data['speed'],
      data['delay']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.EV3.prototype.moveSteps = function(data) {
  this.api.moveSteps(data['steps'], data['speed'], data['invert'],
      data['delay']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.EV3.prototype.rotateAngle = function(data) {
  this.api.rotateAngle(data['angle'], data['invert'], data['speed'],
      data['ratio'], data['delay']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.EV3.prototype.movePower = function(data) {
  this.api.movePower(data['power'], data['invert'], data['delay']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.EV3.prototype.rotatePower = function(data) {
  this.api.rotatePower(data['power'], data['opt_power'], data['invert'],
      data['delay']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.EV3.prototype.stop = function(data) {
  this.api.stop(data['delay']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.EV3.prototype.setColorSensorMode = function(data) {
  this.api.setColorSensorMode(data['mode'], data['delay']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.EV3.prototype.setIrSensorMode = function(data) {
  this.api.setIrSensorMode(data['mode'], data['delay']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.EV3.prototype.setLed = function(data) {
  this.api.setLed(data['color'], data['mode'], data['delay']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.EV3.prototype.setStepSpeed = function(data) {
  this.api.setStepSpeed(data['speed'], data['delay']);
};


/**
 * Handles the cleanup and make sure that the EV3 stops.
 */
cwc.runner.profile.EV3.prototype.cleanUp = function() {
  this.api.cleanUp();
};
