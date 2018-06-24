/**
 * @fileoverview Handles the communication with the Sphero v1 unit.
 *
 * This api allows to read and control the Sphero sensors and actors over an
 * Bluetooth connection.
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
goog.provide('cwc.protocol.sphero.v1.Api');

goog.require('cwc.lib.protocol.bluetoothWeb.Profile');
goog.require('cwc.protocol.sphero.v1.CallbackType');
goog.require('cwc.protocol.sphero.v1.Events');
goog.require('cwc.protocol.sphero.v1.Handler');
goog.require('cwc.protocol.sphero.v1.MessageType');
goog.require('cwc.protocol.sphero.v1.Monitoring');
goog.require('cwc.utils.ByteTools');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.Logger');
goog.require('cwc.utils.StreamReader');

goog.require('goog.events.EventTarget');


goog.scope(function() {
const BluetoothProfile =
  goog.module.get('cwc.lib.protocol.bluetoothWeb.Profile');

/**
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.sphero.v1.Api = function() {
  /** @type {string} */
  this.name = 'Sphero v1';

  /** @type {boolean} */
  this.prepared = false;

  /** @type {cwc.protocol.bluetooth.lowEnergy.Device} */
  this.device = null;

  /** @type {!cwc.protocol.sphero.v1.Handler} */
  this.handler = new cwc.protocol.sphero.v1.Handler();

  /** @type {cwc.protocol.sphero.v1.Monitoring} */
  this.monitoring = new cwc.protocol.sphero.v1.Monitoring(this);

  /** @private {number} */
  this.locationPosX_ = 0;

  /** @private {number} */
  this.locationPosY_ = 0;

  /** @private {number} */
  this.locationVelX_ = 0;

  /** @private {number} */
  this.locationVelY_ = 0;

  /** @private {number} */
  this.locationSog_ = 0;

  /** @private {number} */
  this.locationSpeed_ = 0;

  /** @private {!Object} */
  this.profile_ = BluetoothProfile.Characteristic.SPHERO.spheroBLE;

  /** @private {!goog.events.EventTarget} */
  this.eventTarget_ = new goog.events.EventTarget();

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name);

  /** @private {!cwc.utils.StreamReader} */
  this.streamReader_ = new cwc.utils.StreamReader()
    .setChecksum(this.verifiyChecksum_)
    .setHeaders([[0xff, 0xff], [0xff, 0xfe]])
    .setMinimumSize(7);
};


/**
 * Connects the Sphero ball.
 * @param {!cwc.protocol.bluetooth.lowEnergy.Device} device
 * @return {boolean} Was able to prepare and connect to the Sphero.
 * @export
 */
cwc.protocol.sphero.v1.Api.prototype.connect = function(device) {
  if (!device || !device.isConnected()) {
    console.error('Sphero is not ready yet...');
    return false;
  }

  if (!this.prepared) {
    console.log('Preparing Sphero bluetooth LE api for', device.getId());
    this.eventTarget_.dispatchEvent(cwc.protocol.sphero.v1.Events.connect(
        'Preparing device ...', 1));
    this.device = device;

    // Enable Developer mode.
    this.device.sendRaw(
      new TextEncoder('utf-8').encode('011i3'), this.profile_.antiDOS, () => {
        this.eventTarget_.dispatchEvent(cwc.protocol.sphero.v1.Events.connect(
            'Enable developer mode ...', 2));
    });

    // Power on device.
    this.device.sendRaw(
      new Uint8Array([0x07]), this.profile_.txPower, () => {
        this.eventTarget_.dispatchEvent(cwc.protocol.sphero.v1.Events.connect(
            'Power on device. Waiting until device wakes up ...', 2));
    });

    // Wakeup device.
    this.device.sendRaw(
      new Uint8Array([0x01]), this.profile_.wake, () => {
        this.prepare();
        this.runTest();
        this.eventTarget_.dispatchEvent(cwc.protocol.sphero.v1.Events.connect(
            'Ready ...', 3));
    });
  }
  return true;
};


/**
 * @return {boolean}
 */
cwc.protocol.sphero.v1.Api.prototype.isConnected = function() {
  return (this.device && this.device.isConnected()) ? true : false;
};


/**
 * @export
 */
cwc.protocol.sphero.v1.Api.prototype.prepare = function() {
  this.device.listen('22bb746f-2ba6-7554-2d6f-726568705327',
    this.handleData_.bind(this));
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
 * Disconnects the Sphero ball.
 */
cwc.protocol.sphero.v1.Api.prototype.disconnect = function() {
  if (this.device) {
    this.device.disconnect();
  }
  this.cleanUp();
};


/**
 * Executer for the default handler commands.
 * @param {string} command
 * @param {Object=} data
 * @export
 */
cwc.protocol.sphero.v1.Api.prototype.exec = function(command, data = {}) {
  this.send_(this.handler[command](data));
};


/**
 * Resets the Sphero ball connection.
 */
cwc.protocol.sphero.v1.Api.prototype.reset = function() {
  if (this.device) {
    this.device.reset();
  }
};


/**
 * @param {boolean} enable
 * @export
 */
cwc.protocol.sphero.v1.Api.prototype.monitor = function(enable) {
  if (enable && this.isConnected()) {
    this.monitoring.start();
  } else if (!enable) {
    this.monitoring.stop();
  }
};


/**
 * @return {!goog.events.EventTarget}
 */
cwc.protocol.sphero.v1.Api.prototype.getEventTarget = function() {
  return this.eventTarget_;
};


/**
 * Run self test.
 */
cwc.protocol.sphero.v1.Api.prototype.runTest = function() {
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
 * Basic cleanup for the Sphero ball.
 */
cwc.protocol.sphero.v1.Api.prototype.cleanUp = function() {
  console.log('Clean up Sphero v1 API…');
  this.exec('stop');
  this.events_.clear();
  this.monitoring.cleanUp();
};


/**
 * @param {!ArrayBuffer} buffer
 * @private
 */
cwc.protocol.sphero.v1.Api.prototype.send_ = function(buffer) {
  if (this.device) {
    this.device.send(buffer);
  }
};


/**
 * @param {Object} data
 * @private
 */
cwc.protocol.sphero.v1.Api.prototype.updateLocationData_ = function(data) {
  let xpos = cwc.utils.ByteTools.signedBytesToInt([data[0], data[1]]);
  let ypos = cwc.utils.ByteTools.signedBytesToInt([data[2], data[3]]);
  let xvel = cwc.utils.ByteTools.signedBytesToInt([data[4], data[5]]);
  let yvel = cwc.utils.ByteTools.signedBytesToInt([data[6], data[7]]);
  let speed = cwc.utils.ByteTools.bytesToInt([data[8], data[9]]);

  if (xpos != this.locationPosX_ || ypos != this.locationPosY_) {
    this.locationPosX_ = xpos;
    this.locationPosY_ = ypos;
    this.eventTarget_.dispatchEvent(
      cwc.protocol.sphero.v1.Events.locationData({x: xpos, y: ypos}));
  }

  if (xvel != this.locationVelX_ || yvel != this.locationVelY_) {
    this.locationVelX_ = xvel;
    this.locationVelY_ = yvel;
    this.eventTarget_.dispatchEvent(
      cwc.protocol.sphero.v1.Events.velocityData({x: xvel, y: yvel}));
  }

  if (speed != this.locationSpeed_) {
    this.locationSpeed_ = speed;
    this.eventTarget_.dispatchEvent(
      cwc.protocol.sphero.v1.Events.speedValue(speed));
  }
};


/**
 * @param {Object} data
 * @private
 */
cwc.protocol.sphero.v1.Api.prototype.parseCollisionData_ = function(data) {
  let x = cwc.utils.ByteTools.signedBytesToInt([data[0], data[1]]);
  let y = cwc.utils.ByteTools.signedBytesToInt([data[2], data[3]]);
  let z = cwc.utils.ByteTools.signedBytesToInt([data[4], data[5]]);
  let axis = data[6] == 0x01 ? 'y' : 'x';
  let xMagnitude = cwc.utils.ByteTools.signedBytesToInt([data[7], data[8]]);
  let yMagnitude = cwc.utils.ByteTools.signedBytesToInt([data[9], data[10]]);
  let speed = data[11];
  this.eventTarget_.dispatchEvent(
    cwc.protocol.sphero.v1.Events.collision({
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
 * @param {!Array} buffer
 * @private
 */
cwc.protocol.sphero.v1.Api.prototype.handleData_ = function(buffer) {
  let dataBuffer = this.streamReader_.readByHeader(buffer);
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
    // Handles received data and callbacks from the Bluetooth socket.
    switch (seq) {
      case cwc.protocol.sphero.v1.CallbackType.RGB:
        console.log('RGB:', data[0], data[1], data[2]);
        break;
      case cwc.protocol.sphero.v1.CallbackType.LOCATION:
        console.log('Location', data);
        this.updateLocationData_(data);
        break;
      default:
        console.log('Received type', seq, 'with', len,
          ' bytes of unknown data:', data);
    }
  } else if (messageType === cwc.protocol.sphero.v1.ResponseType.ASYNCHRONOUS) {
    // Handles async packets from the Bluetooth socket.
    switch (messageResponse) {
      case cwc.protocol.sphero.v1.MessageType.PRE_SLEEP:
        console.log('Sphero SPRK+ is tired ...');
        break;
      case cwc.protocol.sphero.v1.MessageType.COLLISION_DETECTED:
        console.log('Collision', data);
        this.parseCollisionData_(data);
        break;
      default:
        console.log('Received message', messageResponse, 'with', len,
          ' bytes of unknown data:', data);
    }
  } else {
    console.error('Data error ...');
  }
};


/**
 * @param {!Array} buffer
 * @param {Number=} checksum
 * @return {boolean}
 * @private
 */
cwc.protocol.sphero.v1.Api.prototype.verifiyChecksum_ = function(buffer,
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
});
