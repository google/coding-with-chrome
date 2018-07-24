/**
 * @fileoverview Define monitors used in mbot protocol.
 *
 * monitor real time values in makeblock sensors
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
goog.provide('cwc.protocol.makeblock.mBotRanger.Monitoring');

goog.require('cwc.utils.Events');
goog.require('cwc.utils.Logger');

goog.require('goog.Timer');


/**
 * @enum {!numbers}
 */
cwc.protocol.makeblock.mBotRanger.MonitoringIntervals = {
  'LIGHTSENSOR_1': 1500,
  'LIGHTSENSOR_2': 1750,
  'LINEFOLLOWER': 250,
  'TEMPERATUR': 1500,
  'ULTRASONIC': 250,
};


/**
 * @constructor
 * @param {!cwc.protocol.makeblock.mBotRanger.Api} api
 * @struct
 * @final
 */
cwc.protocol.makeblock.mBotRanger.Monitoring = function(api) {
  /** @type {!cwc.protocol.makeblock.mBotRanger.Api} */
  this.api = api;

  /** @type {string} */
  this.name = 'mBot Ranger Monitoring';

  /** @type {boolean} */
  this.started = false;

  /** @private {!Object} */
  this.monitor_ = {};

  /** @private {!cwc.utils.Logger|null} */
  this.log_ = new cwc.utils.Logger(this.name);

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name);
};


/**
 * start sending reading sensor signals.
 * @export
 */
cwc.protocol.makeblock.mBotRanger.Monitoring.prototype.start = function() {
  if (this.started) {
    return;
  }
  this.log_.info('Starting...');
  this.enableMonitor('LIGHTSENSOR_1',
    cwc.protocol.makeblock.mBotRanger.IndexType.LIGHTSENSOR_1,
    cwc.protocol.makeblock.mBotRanger.Device.LIGHTSENSOR,
    cwc.protocol.makeblock.mBotRanger.Port.LIGHTSENSOR_1
  );
  this.enableMonitor('LIGHTSENSOR_2',
    cwc.protocol.makeblock.mBotRanger.IndexType.LIGHTSENSOR_2,
    cwc.protocol.makeblock.mBotRanger.Device.LIGHTSENSOR,
    cwc.protocol.makeblock.mBotRanger.Port.LIGHTSENSOR_2
  );
  this.enableMonitor('LINEFOLLOWER',
    cwc.protocol.makeblock.mBotRanger.IndexType.LINEFOLLOWER,
    cwc.protocol.makeblock.mBotRanger.Device.LINEFOLLOWER,
    cwc.protocol.makeblock.mBotRanger.Port.LINEFOLLOWER,
  );
  this.enableMonitor('TEMPERATUR',
    cwc.protocol.makeblock.mBotRanger.IndexType.TEMPERATURE,
    cwc.protocol.makeblock.mBotRanger.Device.TEMPERATURE,
    cwc.protocol.makeblock.mBotRanger.Port.TEMPERATURE
  );
  this.enableMonitor('ULTRASONIC',
    cwc.protocol.makeblock.mBotRanger.IndexType.ULTRASONIC,
    cwc.protocol.makeblock.mBotRanger.Device.ULTRASONIC,
    cwc.protocol.makeblock.mBotRanger.Port.ULTRASONIC
  );
  this.started = true;
};


/**
 * stop sending reading sensor signals.
 * @export
 */
cwc.protocol.makeblock.mBotRanger.Monitoring.prototype.stop = function() {
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
 * @param {!cwc.protocol.makeblock.mBotRanger.MonitoringIntervals} name
 * @param {!cwc.protocol.makeblock.mBotRanger.IndexType} index
 * @param {!cwc.protocol.makeblock.mBotRanger.Device} device
 * @param {!cwc.protocol.makeblock.mBotRanger.Port} port
 */
cwc.protocol.makeblock.mBotRanger.Monitoring.prototype.enableMonitor = function(
    name, index, device, port) {
  if (typeof this.monitor_[name] !== 'undefined') {
    clearInterval(this.monitor_[name]);
    this.monitor_[name] = undefined;
  }
  let interval = cwc.protocol.makeblock.mBotRanger.MonitoringIntervals[name];
  let buffer = this.api.getBuffer('getSensorData', {
    'index': index, 'device': device, 'port': port,
  });
  this.api.send(buffer);
  this.log_.info('Enable monitoring for', name, 'with interval', interval);
  this.monitor_[name] = setInterval(
    this.api.send.bind(this.api), interval, buffer);
};


cwc.protocol.makeblock.mBotRanger.Monitoring.prototype.cleanUp = function() {
  this.log_.info('Clean up ...');
  this.events_.clear();
  this.stop();
};
