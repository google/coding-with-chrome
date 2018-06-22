/**
 * @fileoverview EV3 monitoring logic.
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
goog.provide('cwc.protocol.lego.ev3.Monitoring');

goog.require('cwc.protocol.lego.ev3.Device');
goog.require('cwc.protocol.lego.ev3.Events');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.Logger');

goog.require('goog.Timer');
goog.require('goog.events');
goog.require('goog.events.EventTarget');


/**
 * @enum {!numbers}
 */
cwc.protocol.lego.ev3.MonitoringIntervals = {
  'COL-AMBIENT': 200,
  'COL-COLOR': 200,
  'COL-REFLECT': 200,
  'GYRO-ANG': 150,
  'GYRO-RATE': 150,
  'IR-PROX': 200,
  'IR-REMOTE': 200,
  'IR-SEEK': 200,
  'L-MOTOR-DEG': 2000,
  'L-MOTOR-ROT': 2000,
  'M-MOTOR-DEG': 2000,
  'M-MOTOR-ROT': 2000,
  'TOUCH': 500,
  'US-DIST-CM': 200,
  'US-DIST-IN': 200,
  'US-LISTEN': 200,
};


/**
 * @constructor
 * @param {!cwc.protocol.lego.ev3.Api} api
 * @struct
 * @final
 */
cwc.protocol.lego.ev3.Monitoring = function(api) {
  /** @type {!cwc.protocol.lego.ev3.Api} */
  this.api = api;

  /** @type {string} */
  this.name = 'EV3 Monitoring';

  /** @type {goog.events.EventTarget} */
  this.eventHandler = api.getEventHandler();

  /** @type {boolean} */
  this.started = false;

  /** @type {Object} */
  this.devices_ = {};

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name);

  /** @private {!Object} */
  this.monitor_ = {};

  /** @private {!cwc.utils.Logger|null} */
  this.log_ = new cwc.utils.Logger(this.name);

  this.events_.listen(this.api.getEventHandler(),
    cwc.protocol.lego.ev3.Events.Type.CHANGED_DEVICES,
    this.handleDeviceChanges_, false, this);
};


/**
 * Starts the port monitoring.
 */
cwc.protocol.lego.ev3.Monitoring.prototype.start = function() {
  if (this.started || !this.devices_) {
    return;
  }
  if (Object.keys(this.devices_).length > 0) {
    this.log_.info('Starting...');
  } else {
    this.log_.warn('Unable to find any devices for monitoring!');
    return;
  }
  Object.keys(this.devices_).forEach(function(port) {
    if (this.devices_[port] && !this.monitor_[port]) {
      this.enableMonitor(
        port, this.devices_[port].type, this.devices_[port].mode);
    }
  }.bind(this));
  this.started = true;
};


/**
 * Stops the port monitoring.
 */
cwc.protocol.lego.ev3.Monitoring.prototype.stop = function() {
  if (!this.started) {
    return;
  }
  this.log_.info('Stopping...');
  Object.keys(this.monitor_).forEach(function(port) {
    clearInterval(this.monitor_[port]);
    this.monitor_[port] = undefined;
  }.bind(this));
  this.started = false;
};


/**
 * @param {number} port
 * @param {string} type
 * @param {number=} mode
 */
cwc.protocol.lego.ev3.Monitoring.prototype.enableMonitor = function(
    port, type, mode = 0) {
  if (!port || !type) {
    return;
  }
  if (typeof this.monitor_[port] !== 'undefined') {
    clearInterval(this.monitor_[port]);
    this.monitor_[port] = undefined;
  }
  if (type === cwc.protocol.lego.ev3.Device.NONE.type) {
    return;
  }

  let command = 'getSensorData';
  switch (type) {
    case cwc.protocol.lego.ev3.DeviceType.TOUCH:
      command = 'getSensorDataPct';
      break;
    case cwc.protocol.lego.ev3.DeviceType.GYRO_ANG:
    case cwc.protocol.lego.ev3.DeviceType.GYRO_RATE:
    case cwc.protocol.lego.ev3.DeviceType.US_DIST_CM:
    case cwc.protocol.lego.ev3.DeviceType.US_DIST_IN:
    case cwc.protocol.lego.ev3.DeviceType.US_LISTEN:
      command = 'getSensorDataSi';
      break;
    case cwc.protocol.lego.ev3.DeviceType.L_MOTOR_DEG:
    case cwc.protocol.lego.ev3.DeviceType.L_MOTOR_ROT:
    case cwc.protocol.lego.ev3.DeviceType.M_MOTOR_DEG:
    case cwc.protocol.lego.ev3.DeviceType.M_MOTOR_ROT:
      command = 'getActorData';
      break;
  }
  let interval = cwc.protocol.lego.ev3.MonitoringIntervals[type];
  let buffer = this.api.getBuffer(command, {'port': port, 'mode': mode});
  this.api.send(buffer);
  this.log_.info('Enable monitoring for', type, 'on port', port,
    'with interval', interval);
  this.monitor_[port] = setInterval(
    this.api.send.bind(this.api), interval, buffer);
};


cwc.protocol.lego.ev3.Monitoring.prototype.cleanUp = function() {
  this.log_.info('Clean up ...');
  this.events_.clear();
  this.stop();
  this.devices_ = {};
};


/**
 * @param {Event} event
 * @private
 */
cwc.protocol.lego.ev3.Monitoring.prototype.handleDeviceChanges_ = function(
  event) {
  if (!event.data) {
    return;
  }

  let changedDevices = false;
  let eventData = event.data['port'];
  for (let port in eventData) {
    if (typeof this.devices_[port] === 'undefined' ||
        this.devices_[port].type !== eventData[port].type ||
        this.devices_[port].mode !== eventData[port].mode) {
      this.devices_[port] = eventData[port];
      changedDevices = true;
    }
  }
  if (changedDevices) {
    this.stop();
    this.start();
  }
};
