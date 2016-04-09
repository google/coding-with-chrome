/**
 * @fileoverview Handles the communication with Makeblock mBots.
 *
 * This api allows to read and control the Makeblock mBot kits with
 * bluetooth connection.
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
goog.provide('cwc.protocol.mbot.Api');

goog.require('cwc.protocol.mbot.Command');
goog.require('cwc.protocol.mbot.Monitoring');

goog.require('goog.events.EventTarget');



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.mbot.Api = function(helper) {

  /** @type {!cwc.protocol.mbot.Command} */
  this.command = cwc.protocol.mbot.Command;

  /** @type {string} */
  this.name = 'mBot';

  /** @type {boolean} */
  this.prepared = false;

  /** @type {string} */
  this.autoConnectName = 'Makeblock';

  /** @private {!array} */
  this.headerAsync_ = [0xff, 0x55];

  /** @private {!number} */
  this.headerMinSize_ = 5;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {cwc.protocol.mbot.Monitoring} */
  this.monitoring = new cwc.protocol.mbot.Monitoring(this);

  /** @type {goog.events.EventTarget} */
  this.eventHandler = new goog.events.EventTarget();
};


/**
 * AutoConnects the mbot ball.
 * @export
 */
cwc.protocol.mbot.Api.prototype.autoConnect = function() {
  var bluetoothInstance = this.helper.getInstance('bluetooth', true);
  bluetoothInstance.autoConnectDevice(this.autoConnectName,
      this.connect.bind(this));
};


/**
 * Connects the mbot ball.
 * @param {!string} address
 * @return {boolean} Was able to prepare and connect to the mbot.
 * @export
 */
cwc.protocol.mbot.Api.prototype.connect = function(address) {
  var bluetoothInstance = this.helper.getInstance('bluetooth', true);
  var device = bluetoothInstance.getDevice(address);
  if (!device) {
    console.error('mBot is not ready yet …');
    return false;
  }

  if (!this.prepared && device.isConnected()) {
    console.log('Preparing bluetooth api for', device.getAddress());
    this.device = device;
    this.prepare();
    // this.runTest();
  }

  return true;
};


/**
 * @return {boolean}
 */
cwc.protocol.mbot.Api.prototype.isConnected = function() {
  return (this.device && this.device.isConnected());
};


/**
 * @export
 */
cwc.protocol.mbot.Api.prototype.prepare = function() {
  this.device.setDataHandler(this.handleAsync_.bind(this),
      this.headerAsync_, this.headerMinSize_);
  // this.monitoring.init();
  // this.monitoring.start();

  this.prepared = true;
};


/**
 * Disconnects the mbot.
 */
cwc.protocol.mbot.Api.prototype.disconnect = function() {
  if (this.device) {
    this.device.disconnect();
  }
  this.cleanUp();
};

/**
 * Basic cleanup for the mbot.
 */
cwc.protocol.mbot.Api.prototype.cleanUp = function() {
  console.log('Clean up Mbot …');
  this.reset();
};

/**
 * Resets the mbot connection.
 */
cwc.protocol.mbot.Api.prototype.reset = function() {
  if (this.device) {
    this.device.reset();
  }
};


/**
 * Resets the mbot connection.
 */
cwc.protocol.mbot.Api.prototype.reset = function() {
  if (this.device) {
    this.device.reset();
  }
};


/**
 * @return {goog.events.EventTarget}
 */
cwc.protocol.mbot.Api.prototype.getEventHandler = function() {
  return this.eventHandler;
};

/**
 * Handles async packets from the Bluetooth socket.
 * @param {ArrayBuffer} buffer
 * @private
 */
cwc.protocol.mbot.Api.prototype.handleAsync_ = function(buffer) {
  if (!buffer || buffer.length < 7) {
    return;
  }
  console.log('Async:', buffer);
};

cwc.protocol.mbot.Api.prototype.beepBuzzer = function() {
  var beepCommand = [0xff, 0x55, 0x07, 0x00, 0x02,
                      0x22, 0x06, 0x01, 0xfa, 0x00];
  this.device.send(this.arrayBufferFromArray(beepCommand));
};

cwc.protocol.mbot.Api.prototype.arrayBufferFromArray = function(data){
  var result = new Int8Array(data.length);
  for (var i=0; i < data.length; i++){
    result[i] = data[i];
  }
  return result;
};

/**
 * @param {!number} red 0-255
 * @param {!number} green 0-255
 * @param {!number} blue 0-255
 * @param {boolean=} opt_persistant
 */
// cwc.protocol.mbot.Api.prototype.setRGB = function(red, green, blue,
//     opt_persistant) {
//   var buffer = new cwc.protocol.mbot.Buffer();
//   buffer.writeCommand(this.command.RGB_LED.SET);
//   buffer.writeByte(red);
//   buffer.writeByte(green);
//   buffer.writeByte(blue);
//   buffer.writeByte(opt_persistant == false ? 0x00 : 0x01);
//   this.send_(buffer);
// };
