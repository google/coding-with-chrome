/**
 * @fileoverview runner profile for  Makeblock mBots.
 *
 *
 * @license Copyright 2016 Shenzhen Maker Works Co, Ltd. All Rights Reserved.
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
 * @author wangyu@makeblock.cc (Yu Wang)
 */
goog.provide('cwc.runner.profile.mbot.Command');



/**
 * @param {!cwc.protocol.mbot.Api} api
 * @constructor
 * @struct
 * @final
 */
cwc.runner.profile.mbot.Command = function(api) {
  /** @type {cwc.protocol.mbot.Api} */
  this.api = api;
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.mbot.Command.prototype.beepBuzzer = function(opt_data){
  this.api.beepBuzzer();
};

/**
 * set motor speed of mbot
 * @param  {array} data
 * @return {null}
 * @export
 */
cwc.runner.profile.mbot.Command.prototype.setMotor = function(data){
  if(data['direction'] == 1){
    this.api.setLeftMotor(data['speed']);
  }
  else{
    this.api.setRightMotor(data['speed']);
  }
}

/**
 * move mbot forward or backward
 * @param  {Object} data data package
 * @return {void}
 */
cwc.runner.profile.mbot.Command.prototype.moveSteps = function(data){
    this.api.setLeftMotor(-data['speed']);
    this.api.setRightMotor(data['speed']);
}

/**
 * turn mbot to a direction
 * @param  {Object} data   data package
 * @return {void}
 */
cwc.runner.profile.mbot.Command.prototype.turn = function(data){
    this.api.setLeftMotor(data['speed']);
    this.api.setRightMotor(data['speed']);
}

/**
 * wait for a certain second
 * @param {!Object} opt_data
 */
cwc.runner.profile.mbot.Command.prototype.wait = function(opt_data) {};

/**
 * stop the mbot completely
 * @param  {void} opt_data   not needed
 * @return {void}
 * @export
 */
cwc.runner.profile.mbot.Command.prototype.stop = function(opt_data){
    this.api.setLeftMotor(0);
    this.api.setRightMotor(0);
}

/**
 * set led color of the mbot
 * index: which led to light up? 0 - ALL; 1 - Left; 2 - Right
 * red, green, blue: RGB values
 * @param  {Object} data Data package
 * @return {void}
 * @export
 */
cwc.runner.profile.mbot.Command.prototype.setLEDColor = function(data){
  this.api.setLEDColor(data['position'], data['red'], data['green'], data['blue']);
}

/**
 * play music note on mbot
 * @param  {Object} data data package
 * @return {void}
 * @export
 */
cwc.runner.profile.mbot.Command.prototype.playNote = function(data){
  this.api.playNote(data['frequency'], data['duration']);
}

// SECTION: get values from sensors
/**
 * return ultrasonic value from mbot
 * @return {number} sensor value
 * @export
 */
cwc.runner.profile.mbot.Command.prototype.ultrasonicValue = function(){
  return this.api.ultrasonicValue();
}

/**
 * return lightness sensor value from mbot
 * @return {number} sensor value
 * @export
 */
cwc.runner.profile.mbot.Command.prototype.lightSensorValue = function(){
  return this.api.lightSensorValue();
}
