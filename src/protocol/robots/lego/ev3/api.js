/**
 * @fileoverview Handles the communication with the EV3 unit.
 *
 * This api allows to read and control the Lego Mindstorm EV3 sensors and
 * actors over an Bluetooth connection.
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
goog.provide('cwc.protocol.lego.ev3.Api');

goog.require('cwc.protocol.lego.ev3.ColorSensorMode');
goog.require('cwc.protocol.lego.ev3.Device');
goog.require('cwc.protocol.lego.ev3.DeviceType');
goog.require('cwc.protocol.lego.ev3.Devices');
goog.require('cwc.protocol.lego.ev3.Events');
goog.require('cwc.protocol.lego.ev3.Handler');
goog.require('cwc.protocol.lego.ev3.InputPort');
goog.require('cwc.protocol.lego.ev3.InputPort');
goog.require('cwc.protocol.lego.ev3.IrSensorMode');
goog.require('cwc.protocol.lego.ev3.LedColor');
goog.require('cwc.protocol.lego.ev3.LedMode');
goog.require('cwc.protocol.lego.ev3.Monitoring');
goog.require('cwc.protocol.lego.ev3.MotorMode');
goog.require('cwc.protocol.lego.ev3.OutputPort');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.Logger');
goog.require('cwc.utils.StreamReader');

goog.require('goog.events');
goog.require('goog.events.EventTarget');


/**
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.lego.ev3.Api = function() {
  /** @type {string} */
  this.name = 'EV3 API';

  /** @type {boolean} */
  this.prepared = false;

  /** @type {cwc.protocol.bluetooth.classic.Device} */
  this.device = null;

  /** @type {Object} */
  this.deviceData = {};

  /** @type {!string} */
  this.firmware = '';

  /** @type {!cwc.protocol.lego.ev3.Handler} */
  this.handler = new cwc.protocol.lego.ev3.Handler();

  /** @private {!Object} */
  this.devices_ = {};

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name);

  /** @private {!goog.events.EventTarget} */
  this.eventHandler_ = new goog.events.EventTarget();

  /** @private {number} */
  this.eventTimerUpdatedDevices = null;

  /** @type {!cwc.protocol.lego.ev3.Monitoring} */
  this.monitoring = new cwc.protocol.lego.ev3.Monitoring(this);

  /** @private {!cwc.utils.StreamReader} */
  this.streamReader_ = new cwc.utils.StreamReader().setMinimumSize(5);

  /** @private {!cwc.utils.Logger|null} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * Connects the EV3 unit.
 * @param {!cwc.protocol.bluetooth.classic.Device} device
 * @return {boolean} Was able to prepare and connect to the EV3.
 * @export
 */
cwc.protocol.lego.ev3.Api.prototype.connect = function(device) {
  if (!device) {
    return false;
  } else if (!device.isConnected()) {
    this.log_.error('EV3 unit is not ready yet...');
    return false;
  }

  if (!this.prepared) {
    this.log_.info('Prepare EV3 bluetooth api for', device.getAddress());
    this.log_.info(this.devices_);
    this.eventHandler_.dispatchEvent(cwc.protocol.lego.ev3.Events.connect(
      'Prepare EV3 api for' + device.getAddress(), 2));
    this.device = device;
    this.prepare();
    this.eventHandler_.dispatchEvent(cwc.protocol.lego.ev3.Events.connect(
      'Ready ...', 3));
  }

  return true;
};


/**
 * @return {!boolean}
 */
cwc.protocol.lego.ev3.Api.prototype.isConnected = function() {
  return (this.device && this.device.isConnected()) ? true : false;
};


/**
 * @export
 */
cwc.protocol.lego.ev3.Api.prototype.prepare = function() {
  this.events_.listen(this.device.getEventHandler(),
    cwc.protocol.bluetooth.classic.Events.Type.ON_RECEIVE,
    this.handleOnReceive_.bind(this));
  this.exec('playTone', {'frequency': 2000, 'duration': 200, 'volume': 25});
  this.exec('getFirmware');
  this.exec('getBattery');
  this.getDeviceTypes();
  this.exec('playTone', {'frequency': 3000, 'duration': 200, 'volume': 50});
  this.drawLogo_();
  this.prepared = true;
};


/**
 * Disconnects the EV3 unit.
 */
cwc.protocol.lego.ev3.Api.prototype.disconnect = function() {
  if (this.device) {
    this.device.disconnect();
  }
  this.monitor(false);
  this.cleanUp();
};


/**
 * Resets the EV3 connection.
 */
cwc.protocol.lego.ev3.Api.prototype.reset = function() {
  if (this.device) {
    this.device.reset();
  }
};


/**
 * Executer for the default handler commands.
 * @param {!string} command
 * @param {Object=} data
 * @export
 */
cwc.protocol.lego.ev3.Api.prototype.exec = function(command, data = {}) {
  this.send(this.handler[command](data));
};


/**
 * @param {!ArrayBuffer} buffer
 * @private
 */
cwc.protocol.lego.ev3.Api.prototype.send = function(buffer) {
  if (this.device) {
    this.device.send(buffer);
  }
};


/**
 * @param {!string} command
 * @param {Object=} data
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Api.prototype.getBuffer = function(command, data = {}) {
  return this.handler[command](data);
};


/**
 * @return {Object}
 */
cwc.protocol.lego.ev3.Api.prototype.getDeviceData = function() {
  return this.deviceData;
};


/**
 * @return {!goog.events.EventTarget}
 */
cwc.protocol.lego.ev3.Api.prototype.getEventHandler = function() {
  return this.eventHandler_;
};


/**
 * @param {!Object} data
 */
cwc.protocol.lego.ev3.Api.prototype.setSensorMode = function(data) {
  if (this.devices_['port'][data['port']].mode !== data['mode']) {
    this.monitoring.stop();
    this.exec('getSensorData', data);
    this.exec('getDeviceType', {'port': data['port']});
  }
};


/**
 * @param {!boolean} enable
 * @export
 */
cwc.protocol.lego.ev3.Api.prototype.monitor = function(enable) {
  if (enable && this.isConnected()) {
    this.monitoring.start();
  } else if (!enable) {
    this.monitoring.stop();
  }
};


/**
 * @return {!cwc.protocol.lego.ev3.Devices}
 */
cwc.protocol.lego.ev3.Api.prototype.getDevices = function() {
  return this.devices_;
};


/**
 * Detects all connected devices.
 */
cwc.protocol.lego.ev3.Api.prototype.getDeviceTypes = function() {
  this.log_.info('Get device types ...');
  this.monitoring.stop();
  this.devices_['actor'] = {};
  this.devices_['port'] = {};
  this.devices_['sensor'] = {};
  for (let port in cwc.protocol.lego.ev3.InputPort) {
    if (cwc.protocol.lego.ev3.InputPort.hasOwnProperty(port)) {
      this.exec('getDeviceType', {
        'port': cwc.protocol.lego.ev3.InputPort[port]});
    }
  }
};


/**
 * Basic cleanup for the EV3 unit.
 */
cwc.protocol.lego.ev3.Api.prototype.cleanUp = function() {
  this.log_.info('Clean up ...');
  this.exec('stop');
  this.exec('clear');
  this.events_.clear();
  this.monitoring.cleanUp();
};


/**
 * Handles received data and callbacks from the Bluetooth socket.
 * @param {Event} e
 * @private
 */
cwc.protocol.lego.ev3.Api.prototype.handleOnReceive_ = function(e) {
  let dataBuffer = this.streamReader_.read(e.data);
  if (!dataBuffer) {
    return;
  }

  // Verify packet length.
  let packetLength = cwc.utils.ByteTools.bytesToInt(
    [dataBuffer[1], dataBuffer[0]]) + 2;
  if (dataBuffer.length < packetLength) {
    this.streamReader_.addBuffer(dataBuffer);
    return;
  } else if (dataBuffer.length > packetLength) {
    dataBuffer = dataBuffer.slice(0, packetLength);
    this.streamReader_.addBuffer(dataBuffer.slice(packetLength));
  }

  let callback =
    /** @type {cwc.protocol.lego.ev3.CallbackType} */ (dataBuffer[2]);
  let port = /** @type {cwc.protocol.lego.ev3.InputPort} */ (dataBuffer[3]);
  let data = dataBuffer.slice(5);

  // Handles the different callback types.
  switch (callback) {
    case cwc.protocol.lego.ev3.CallbackType.FIRMWARE:
      this.firmware = cwc.utils.ByteTools.toUTF8(data);
      this.log_.info('EV3 Firmware Version', this.firmware);
      break;
    case cwc.protocol.lego.ev3.CallbackType.BATTERY:
      this.log_.info('EV3 Battery level', data);
      break;
    case cwc.protocol.lego.ev3.CallbackType.DEVICE_NAME:
      this.updateDeviceType_(port, cwc.utils.ByteTools.toString(data));
      break;
    case cwc.protocol.lego.ev3.CallbackType.DEVICE_PCT_VALUE:
    case cwc.protocol.lego.ev3.CallbackType.DEVICE_RAW_VALUE:
      this.updateDeviceData_(port, data[0]);
      break;
    case cwc.protocol.lego.ev3.CallbackType.DEVICE_SI_VALUE:
      this.updateDeviceData_(
        port, cwc.utils.ByteTools.bytesToFloat32(data).toFixed(1));
      break;
    case cwc.protocol.lego.ev3.CallbackType.ACTOR_VALUE:
      this.updateDeviceData_(
        port, cwc.utils.ByteTools.bytesToInt32Alternative(data));
      break;
  }
};


/**
 * @param {!cwc.protocol.lego.ev3.InputPort} port
 * @param {!number} value
 * @private
 */
cwc.protocol.lego.ev3.Api.prototype.updateDeviceData_ = function(port, value) {
  if (typeof this.deviceData[port] !== 'undefined' &&
      this.deviceData[port] === value) {
    return;
  }
  this.deviceData[port] = value;
  this.eventHandler_.dispatchEvent(
    cwc.protocol.lego.ev3.Events.changedSensorValue(
      port, value, this.devices_['port'][port].type));
};


/**
 * @param {!cwc.protocol.lego.ev3.InputPort} port
 * @param {!string} type
 * @private
 */
cwc.protocol.lego.ev3.Api.prototype.updateDeviceType_ = function(port, type) {
  if (type === cwc.protocol.lego.ev3.DeviceType.PORT_ERROR) {
    this.log_.error('Received Port Error on port', port, '!');
    this.log_.error('PLEASE RESTART THE EV3 TO FIX THIS ERROR !');
    return;
  }
  if (!type || type === cwc.protocol.lego.ev3.DeviceType.UNKNOWN) {
    this.log_.error('Unknown device on port', port, '!');
    this.log_.error('Please re-connect device on port', port, '!');
    return;
  }
  if (type === cwc.protocol.lego.ev3.DeviceType.TERMINAL) {
    this.log_.warn('Please check connection on port', port, '!');
    return;
  }
  if (typeof cwc.protocol.lego.ev3.Device[type] === 'undefined') {
    this.log_.warn('Unknown device "' + type + '" on port', port);
    this.log_.warn('Please check re-connect device on port', port, '!');
    return;
  }

  // Store detected sensors changes for automatic mapping.
  let device = cwc.protocol.lego.ev3.Device[type];
  if (typeof this.devices_['port'][port] === 'undefined' ||
      this.devices_['port'][port].type !== type ||
      this.devices_['port'][port].mode !== device.mode) {
    if (type !== cwc.protocol.lego.ev3.Device.NONE.type) {
      this.log_.info('Found', type, 'on port', port);
    }
    this.devices_['port'][port] = device;
    let group = this.devices_['port'][port].group;

    // Sensor Mapping
    if (!this.devices_['sensor'][type]) {
      this.devices_['sensor'][type] = [port];
    } else if (!this.devices_['sensor'][type].includes(port)) {
      this.devices_['sensor'][type].push(port);
    }
    if (!this.devices_['sensor'][group]) {
      this.devices_['sensor'][group] = [port];
    } else if (!this.devices_['sensor'][group].includes(port)) {
      this.devices_['sensor'][group].push(port);
    }

    // Actor Mapping
    if (port >= 16) {
      let devicePort = Math.pow(2, port - 16);
      if (!this.devices_['actor'][type]) {
        this.devices_['actor'][type] = [devicePort];
      } else if (!this.devices_['actor'][type].includes(devicePort)) {
        this.devices_['actor'][type].push(devicePort);
      }
      if (!this.devices_['actor'][group]) {
        this.devices_['actor'][group] = [devicePort];
      } else if (!this.devices_['actor'][group].includes(devicePort)) {
        this.devices_['actor'][group].push(devicePort);
      }
    }

    // Combine repeating device changed events.
    if (this.eventTimerUpdatedDevices !== null) {
      clearTimeout(this.eventTimerUpdatedDevices);
    }
    this.eventTimerUpdatedDevices = setTimeout(() => {
      if (this.handler) {
        this.handler.setDevices_(this.devices_);
      }

      this.eventHandler_.dispatchEvent(
        cwc.protocol.lego.ev3.Events.changedDevices(this.devices_));
    }, 50);
  }
};


/**
 * Draws CWC logo on the EV3 unit.
 * @private
 */
cwc.protocol.lego.ev3.Api.prototype.drawLogo_ = function() {
  this.exec('drawClean');

  this.exec('drawLine', {'x1': 33, 'y1': 108, 'x2': 143, 'y2': 108});
  this.exec('drawLine', {'x1': 148, 'y1': 108, 'x2': 148, 'y2': 128});
  this.exec('drawLine', {'x1': 28, 'y1': 128, 'x2': 148, 'y2': 128});
  this.exec('drawLine', {'x1': 33, 'y1': 108, 'x2': 28, 'y2': 128});

  this.exec('drawLine', {'x1': 38, 'y1': 28, 'x2': 148, 'y2': 28});
  this.exec('drawLine', {'x1': 148, 'y1': 28, 'x2': 143, 'y2': 100});
  this.exec('drawLine', {'x1': 33, 'y1': 100, 'x2': 143, 'y2': 100});
  this.exec('drawLine', {'x1': 28, 'y1': 28, 'x2': 33, 'y2': 100});

  this.exec('drawLine', {'x1': 48, 'y1': 48, 'x2': 128, 'y2': 48});
  this.exec('drawLine', {'x1': 128, 'y1': 48, 'x2': 125, 'y2': 80});
  this.exec('drawLine', {'x1': 51, 'y1': 80, 'x2': 125, 'y2': 80});
  this.exec('drawLine', {'x1': 48, 'y1': 48, 'x2': 51, 'y2': 80});

  this.exec('drawLine', {'x1': 38, 'y1': 38, 'x2': 138, 'y2': 38});
  this.exec('drawLine', {'x1': 138, 'y1': 38, 'x2': 134, 'y2': 90});
  this.exec('drawLine', {'x1': 43, 'y1': 90, 'x2': 133, 'y2': 90});
  this.exec('drawLine', {'x1': 38, 'y1': 38, 'x2': 42, 'y2': 90});

  this.exec('drawUpdate');
};
