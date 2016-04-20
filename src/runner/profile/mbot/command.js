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
 */
cwc.runner.profile.mbot.Command.prototype.setMotor = function(data){
  if(data['direction'] == 1){
    this.api.setLeftMotor(data['speed']);
  }
  else{
    this.api.setRightMotor(data['speed']);
  }
}

cwc.runner.profile.mbot.Command.prototype.setLEDColor = function(data){
  this.api.setLEDColor(data['index'], data['red'], data['green'], data['blue']);
}

cwc.runner.profile.mbot.Command.prototype.playNote = function(data){
  this.api.playNote(data['frequency'], data['duration']);
}

cwc.runner.profile.mbot.Command.prototype.ultrasonicValue = function(opt_data){
  return this.api.ultrasonicValue();
}
