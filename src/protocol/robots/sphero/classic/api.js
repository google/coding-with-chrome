/**
 * @fileoverview Handles the communication with the Sphero Classic unit.
 *
 * This api allows to read and control the Sphero sensors and actors over an
 * Bluetooth connection.
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
goog.provide('cwc.protocol.sphero.classic.Api');

goog.require('cwc.protocol.bluetooth.classic.Events');
goog.require('cwc.protocol.sphero.classic.CallbackType');
goog.require('cwc.protocol.sphero.classic.Events');
goog.require('cwc.protocol.sphero.classic.Handler');
goog.require('cwc.protocol.sphero.classic.MessageType');
goog.require('cwc.protocol.sphero.classic.Monitoring');
goog.require('cwc.protocol.sphero.classic.ResponseType');
goog.require('cwc.utils.ByteTools');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.StreamReader');

goog.require('goog.events.EventTarget');


/**
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.sphero.classic.Api = function() {
  /** @type {string} */
  this.name = 'Sphero Classic';

  /** @type {boolean} */
  this.prepared = false;

  /** @type {cwc.protocol.bluetooth.classic.Device} */
  this.device = null;

  /** @type {!cwc.protocol.sphero.classic.Handler} */
  this.handler = new cwc.protocol.sphero.classic.Handler();

  /** @type {cwc.protocol.sphero.classic.Monitoring} */
  this.monitoring = new cwc.protocol.sphero.classic.Monitoring(this);

  /** @private {!number} */
  this.locationPosX_ = 0;

  /** @private {!number} */
  this.locationPosY_ = 0;

  /** @private {!number} */
  this.locationVelX_ = 0;

  /** @private {!number} */
  this.locationVelY_ = 0;

  /** @private {!number} */
  this.locationSog_ = 0;

  /** @private {!number} */
  this.locationSpeed_ = 0;

  /** @type {!goog.events.EventTarget} */
  this.eventHandler = new goog.events.EventTarget();

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name);

  /** @private {!cwc.utils.StreamReader} */
  this.streamReader_ = new cwc.utils.StreamReader()
    .setChecksum(this.verifiyChecksum_)
    .setHeaders([[0xff, 0xff], [0xff, 0xfe]])
    .setMinimumSize(7);
};


/**
 * Connects the Sphero device.
 * @param {!cwc.protocol.bluetooth.classic.Device} device
 * @return {boolean} Was able to prepare and connect to the Sphero.
 * @export
 */
cwc.protocol.sphero.classic.Api.prototype.connect = function(device) {
  if (!device) {
    return false;
  } else if (!device.isConnected()) {
    console.error('Sphero device is not ready yet...');
    return false;
  }

  if (!this.prepared) {
    console.log('Preparing Sphero classic api for', device.getAddress());
    this.eventHandler.dispatchEvent(cwc.protocol.sphero.classic.Events.connect(
      'Prepare Sphero Classic api for' + device.getAddress(), 2));
    this.device = device;
    this.prepare();
    this.runTest();
    this.eventHandler.dispatchEvent(cwc.protocol.sphero.classic.Events.connect(
      'Ready ...', 3));
  }
  return true;
};


/**
 * @return {!boolean}
 */
cwc.protocol.sphero.classic.Api.prototype.isConnected = function() {
  return (this.device && this.device.isConnected()) ? true : false;
};


/**
 * @export
 */
cwc.protocol.sphero.classic.Api.prototype.prepare = function() {
  console.log(this.device);
  this.events_.listen(this.device.getEventHandler(),
    cwc.protocol.bluetooth.classic.Events.Type.ON_RECEIVE,
    this.handleOnReceive_.bind(this));
  this.exec('setRGB', {'red': 255, 'persistent': true});
  this.exec('getRGB');
  this.exec('setRGB', {'green': 255, 'persistent': true});
  this.exec('getRGB');
  this.exec('setRGB', {'blue': 255, 'persistent': true});
  this.exec('getRGB');
  this.exec('setCollisionDetection');
  this.prepared = true;
};


/**
 * Disconnects the Sphero device.
 */
cwc.protocol.sphero.classic.Api.prototype.disconnect = function() {
  if (this.device) {
    this.device.disconnect();
  }
  this.cleanUp();
};


/**
 * Executer for the default handler commands.
 * @param {!string} command
 * @param {Object=} data
 * @export
 */
cwc.protocol.sphero.classic.Api.prototype.exec = function(command, data = {}) {
  this.send_(this.handler[command](data));
};


/**
 * Executer for the runner profiles with parameters in revert order.
 * @param {!Object} data
 * @param {!string} command
 * @export
 */
cwc.protocol.sphero.classic.Api.prototype.execRunnerProfile = function(data,
    command) {
  this.exec(command, data);
};


/**
 * @return {!cwc.protocol.sphero.classic.Handler}
 */
cwc.protocol.sphero.classic.Api.prototype.getRunnerProfile = function() {
  return this.handler;
};


/**
 * @param {!boolean} enable
 * @export
 */
cwc.protocol.sphero.classic.Api.prototype.monitor = function(enable) {
  if (enable && this.isConnected()) {
    this.monitoring.start();
  } else if (!enable) {
    this.monitoring.stop();
  }
};


/**
 * @return {!goog.events.EventTarget}
 */
cwc.protocol.sphero.classic.Api.prototype.getEventHandler = function() {
  return this.eventHandler;
};


/**
 * Run self test.
 */
cwc.protocol.sphero.classic.Api.prototype.runTest = function() {
  console.log('Prepare self test…');
  this.exec('setRGB', {'red': 255, 'persistent': true});
  this.exec('setRGB', {'green': 255, 'persistent': true});
  this.exec('setRGB', {'blue': 255, 'persistent': true});
  this.exec('setRGB', {'persistent': true});
  this.exec('setBackLed', {'brightness': 100});
  this.exec('setBackLed', {'brightness': 75});
  this.exec('setBackLed', {'brightness': 50});
  this.exec('setBackLed', {'brightness': 25});
  this.exec('setBackLed');
  this.exec('setRGB', {'green': 128});
  this.exec('roll', {'speed': 0, 'heading': 180});
};


/**
 * Basic cleanup for the Sphero device.
 */
cwc.protocol.sphero.classic.Api.prototype.cleanUp = function() {
  console.log('Clean up Sphero API …');
  this.events_.clear();
  this.monitoring.cleanUp();
};


/**
 * @param {!Array<ArrayBuffer>|ArrayBuffer} buffer
 * @private
 */
cwc.protocol.sphero.classic.Api.prototype.send_ = function(buffer) {
  if (this.device) {
    this.device.send(buffer);
  }
};


/**
 * @param {Object} data
 * @private
 */
cwc.protocol.sphero.classic.Api.prototype.updateLocationData_ = function(data) {
  let xpos = cwc.utils.ByteTools.signedBytesToInt([data[0], data[1]]);
  let ypos = cwc.utils.ByteTools.signedBytesToInt([data[2], data[3]]);
  let xvel = cwc.utils.ByteTools.signedBytesToInt([data[4], data[5]]);
  let yvel = cwc.utils.ByteTools.signedBytesToInt([data[6], data[7]]);
  let speed = cwc.utils.ByteTools.bytesToInt([data[8], data[9]]);

  if (xpos != this.locationPosX_ || ypos != this.locationPosY_) {
    this.locationPosX_ = xpos;
    this.locationPosY_ = ypos;
    this.eventHandler.dispatchEvent(
      cwc.protocol.sphero.classic.Events.locationData({x: xpos, y: ypos}));
  }

  if (xvel != this.locationVelX_ || yvel != this.locationVelY_) {
    this.locationVelX_ = xvel;
    this.locationVelY_ = yvel;
    this.eventHandler.dispatchEvent(
      cwc.protocol.sphero.classic.Events.velocityData({x: xvel, y: yvel}));
  }

  if (speed != this.locationSpeed_) {
    this.locationSpeed_ = speed;
    this.eventHandler.dispatchEvent(
      cwc.protocol.sphero.classic.Events.speedValue(speed));
  }
};


/**
 * @param {Object} data
 * @private
 */
cwc.protocol.sphero.classic.Api.prototype.parseCollisionData_ = function(data) {
  let x = cwc.utils.ByteTools.signedBytesToInt([data[0], data[1]]);
  let y = cwc.utils.ByteTools.signedBytesToInt([data[2], data[3]]);
  let z = cwc.utils.ByteTools.signedBytesToInt([data[4], data[5]]);
  let axis = data[6] == 0x01 ? 'y' : 'x';
  let xMagnitude = cwc.utils.ByteTools.signedBytesToInt([data[7], data[8]]);
  let yMagnitude = cwc.utils.ByteTools.signedBytesToInt([data[9], data[10]]);
  let speed = data[11];
  this.eventHandler.dispatchEvent(
    cwc.protocol.sphero.classic.Events.collision({
      x: x,
      y: y,
      z: z,
      axis: axis,
      magnitude: {
        x: xMagnitude,
        y: yMagnitude,
      },
      speed: speed,
    }));
};


/**
 * Handles packets from the Bluetooth socket.
 * @param {Event} e
 * @private
 */
cwc.protocol.sphero.classic.Api.prototype.handleOnReceive_ = function(e) {
  let dataBuffer = this.streamReader_.readByHeader(e.data);
  if (!dataBuffer) {
    return;
  }

  // Verify packet length.
  let packetLength = dataBuffer[4] + 5;
  if (dataBuffer.length < packetLength) {
    this.streamReader_.addBuffer(dataBuffer);
    return;
  } else if (dataBuffer.length > packetLength) {
    dataBuffer = dataBuffer.slice(0, packetLength);
    this.streamReader_.addBuffer(dataBuffer.slice(packetLength));
  }

  // Handling packet message.
  let messageType = dataBuffer[1];
  let messageResponse = dataBuffer[2];
  let seq = dataBuffer[3];
  let len = dataBuffer[4];
  let data = dataBuffer.slice(5, 4 + len);
  if (messageType === cwc.protocol.sphero.v1.ResponseType.ACKNOWLEDGEMENT) {
    if (len = 1 &&
       messageResponse === cwc.protocol.sphero.classic.ResponseType.PRE_SLEEP) {
      console.warn('Pre-sleep warning (10 sec)');
      return;
    }
    // Handles received data and callbacks from the Bluetooth socket.
    switch (seq) {
      case cwc.protocol.sphero.classic.CallbackType.RGB:
        console.log('RGB:', data[0], data[1], data[2]);
        break;
      case cwc.protocol.sphero.classic.CallbackType.LOCATION:
        console.log('Location', data);
        this.updateLocationData_(data);
        break;
      default:
        console.log('Received type', seq, 'with', len,
          ' bytes of unknown data:', data);
    }
  } else if (messageType ===
      cwc.protocol.sphero.v1.ResponseType.ASYNCHRONOUS) {
    // Handles async packets from the Bluetooth socket.
    switch (messageResponse) {
      case cwc.protocol.sphero.classic.MessageType.COLLISION_DETECTED:
        console.log('Collision', data);
        this.parseCollisionData_(data);
        break;
      default:
        console.log('Received message', messageResponse, 'with', len,
          ' bytes of unknown data:', data);
    }
  } else {
    console.error('Data error ...', dataBuffer);
  }
};


/**
 * @param {!Array} buffer
 * @param {Number=} checksum
 * @return {!boolean}
 * @private
 */
cwc.protocol.sphero.classic.Api.prototype.verifiyChecksum_ = function(buffer,
    checksum) {
  // SOP1 always 0xFF and minimum packet size of 6
  if (!buffer || buffer[0] !== 0xFF || buffer.length < 6) {
    return false;
  }
  let packetLength = buffer[4] + 4;
  if (!checksum) {
    checksum = buffer[packetLength];
  }
  let bufferChecksum = 0;
  for (let i = 2; i < packetLength; i++) {
    bufferChecksum += buffer[i];
  }

  return (checksum === (bufferChecksum % 256) ^ 0xFF) ? true : false;
};
