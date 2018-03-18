/**
 * @fileoverview Runner command profile for EV3 unit.
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
goog.provide('cwc.runner.profile.ev3.Command');


/**
 * @param {!cwc.protocol.lego.ev3.Api} api
 * @constructor
 * @final
 */
cwc.runner.profile.ev3.Command = function(api) {
  /** @type {!cwc.protocol.lego.ev3.Api} */
  this.api = api;
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.ev3.Command.prototype['playTone'] = function(data) {
  this.api.playTone(data['frequency'], data['duration'], data['volume']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.ev3.Command.prototype['playSound'] = function(data) {
  this.api.playSound(data['file'], data['volume']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.ev3.Command.prototype['drawImage'] = function(data) {
  this.api.drawImage(data['file']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.ev3.Command.prototype['movePen'] = function(data) {
  this.api.moveServo(data['steps'], data['speed']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.ev3.Command.prototype['moveServo'] = function(data) {
  this.api.moveServo(data['steps'], data['speed']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.ev3.Command.prototype['moveSteps'] = function(data) {
  this.api.moveSteps(data['steps'], data['speed']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.ev3.Command.prototype['customMoveSteps'] = function(data) {
  this.api.customMoveSteps(data['steps'], data['ports'], data['speed']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.ev3.Command.prototype['rotateSteps'] = function(data) {
  this.api.rotateSteps(data['steps'], data['speed'], data['break']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.ev3.Command.prototype['customRotateSteps'] = function(data) {
  this.api.customRotateSteps(data['steps'], data['ports'], data['speed'],
    data['break']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.ev3.Command.prototype['movePower'] = function(data) {
  this.api.movePower(data['power']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.ev3.Command.prototype['rotatePower'] = function(data) {
  this.api.rotatePower(data['power'], data['opt_power']);
};


cwc.runner.profile.ev3.Command.prototype['stop'] = function() {
  this.api.stop();
};


cwc.runner.profile.ev3.Command.prototype['wait'] = function() {};


/**
 * @param {!Object} data
 */
cwc.runner.profile.ev3.Command.prototype['setColorSensorMode'] = function(
    data) {
  this.api.setColorSensorMode(data['mode']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.ev3.Command.prototype['setIrSensorMode'] = function(data) {
  this.api.setIrSensorMode(data['mode']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.ev3.Command.prototype['setUltrasonicSensorMode'] = function(
    data) {
  this.api.setUltrasonicSensorMode(data['mode']);
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.ev3.Command.prototype['setLed'] = function(data) {
  this.api.setLed(data['color'], data['mode']);
};


/**
 * Handles the cleanup and make sure that the EV3 stops.
 */
cwc.runner.profile.ev3.Command.prototype['cleanUp'] = function() {
  this.api.cleanUp();
};
