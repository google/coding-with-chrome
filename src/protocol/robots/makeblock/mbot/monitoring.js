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
goog.provide('cwc.protocol.makeblock.mbot.Monitoring');

goog.require('cwc.utils.Events');
goog.require('cwc.utils.Logger');

goog.require('goog.Timer');


/**
 * @enum {!numbers}
 */
cwc.protocol.makeblock.mbot.MonitoringIntervals = {
  'LIGHTSENSOR': 1500,
  'LINEFOLLOWER': 200,
  'ULTRASONIC': 200,
};


/**
 * @constructor
 * @param {!cwc.protocol.makeblock.mbot.Api} api
 * @struct
 * @final
 */
cwc.protocol.makeblock.mbot.Monitoring = function(api) {
  /** @type {!cwc.protocol.makeblock.mbot.Api} */
  this.api = api;

  /** @type {string} */
  this.name = 'mBot Monitoring';

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
cwc.protocol.makeblock.mbot.Monitoring.prototype.start = function() {
  if (this.started) {
    return;
  }
  this.log_.info('Starting...');
  this.enableMonitor('LIGHTSENSOR',
    cwc.protocol.makeblock.mbot.CallbackType.LIGHTSENSOR,
    cwc.protocol.makeblock.mbot.Device.LIGHTSENSOR,
    cwc.protocol.makeblock.mbot.Port.LIGHTSENSOR,
  );
  this.enableMonitor('LINEFOLLOWER',
    cwc.protocol.makeblock.mbot.CallbackType.LINEFOLLOWER,
    cwc.protocol.makeblock.mbot.Device.LINEFOLLOWER,
    cwc.protocol.makeblock.mbot.Port.LINEFOLLOWER,
  );
  this.enableMonitor('ULTRASONIC',
    cwc.protocol.makeblock.mbot.CallbackType.ULTRASONIC,
    cwc.protocol.makeblock.mbot.Device.ULTRASONIC,
    cwc.protocol.makeblock.mbot.Port.ULTRASONIC,
  );
  this.started = true;
};


/**
 * stop sending reading sensor signals.
 * @export
 */
cwc.protocol.makeblock.mbot.Monitoring.prototype.stop = function() {
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
 * @param {!cwc.protocol.makeblock.mbot.MonitoringIntervals} name
 * @param {!cwc.protocol.makeblock.mbot.IndexType} index
 * @param {!cwc.protocol.makeblock.mbot.Device} device
 * @param {!cwc.protocol.makeblock.mbot.Port} port
 */
cwc.protocol.makeblock.mbot.Monitoring.prototype.enableMonitor = function(
    name, index, device, port) {
  if (typeof this.monitor_[name] !== 'undefined') {
    clearInterval(this.monitor_[name]);
    this.monitor_[name] = undefined;
  }
  let interval = cwc.protocol.makeblock.mbot.MonitoringIntervals[name];
  let buffer = this.api.getBuffer('getSensorData', {
    'index': index, 'device': device, 'port': port,
  });
  this.api.send(buffer);
  this.log_.info('Enable monitoring for', name, 'with interval', interval);
  this.monitor_[name] = setInterval(
    this.api.send.bind(this.api), interval, buffer);
};


cwc.protocol.makeblock.mbot.Monitoring.prototype.cleanUp = function() {
  this.log_.info('Clean up ...');
  this.events_.clear();
  this.stop();
};
