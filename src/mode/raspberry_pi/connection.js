/**
 * @fileoverview Connection for the Raspberry Pi modification.
 *
 * @license Copyright 2017 The Coding with Chrome Authors.
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
goog.provide('cwc.mode.raspberryPi.Connection');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.raspberryPi.Connection = function(helper) {
  /** @type {string} */
  this.name = 'Raspberry Pi Connection';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.protocol.raspberry_pi.Api} */
  this.api = helper.getInstance('raspberryPi', true);

  /** @type {!number} */
  this.connectMonitorInterval = 5000;

  /** @type {goog.Timer} */
  this.connectMonitor = new goog.Timer(this.connectMonitorInterval);

  /** @type {!Array} */
  this.listener = [];
};


/**
 * Connects the Raspberry Pi unit.
 * @export
 */
cwc.mode.raspberryPi.Connection.prototype.init = function() {
  this.addEventListener_(this.connectMonitor, goog.Timer.TICK,
    this.connect.bind(this));
  this.connectMonitor.start();
  this.connect();
};


/**
 * Connects the Raspberry Pi.
 * @param {Event=} opt_event
 * @export
 */
cwc.mode.raspberryPi.Connection.prototype.connect = function(opt_event) {
  if (!this.isConnected()) {
    this.api.autoConnect();
  }
};


/**
 * Stops the current executions.
 */
cwc.mode.raspberryPi.Connection.prototype.stop = function() {
  var runnerInstance = this.helper.getInstance('runner');
  if (runnerInstance) {
    runnerInstance.terminate();
  }
  this.api.stop();
};


/**
 * Resets the connection.
 * @param {Event=} opt_event
 * @export
 */
cwc.mode.raspberryPi.Connection.prototype.reset = function(opt_event) {
  if (this.isConnected()) {
    this.api.reset();
  }
};


/**
 * @return {!boolean}
 * @export
 */
cwc.mode.raspberryPi.Connection.prototype.isConnected = function() {
  return this.api.isConnected();
};


/**
 * @return {!cwc.protocol.raspberryPi.Api}
 * @export
 */
cwc.mode.raspberryPi.Connection.prototype.getApi = function() {
  return this.api;
};


/**
 * Stops the EV3 unit.
 */
cwc.mode.raspberryPi.Connection.prototype.stop = function() {
  var runnerInstance = this.helper.getInstance('runner');
  if (runnerInstance) {
    runnerInstance.terminate();
  }
  this.api.stop();
};


/**
 * @return {}
 */
cwc.mode.raspberryPi.Connection.prototype.getEventHandler = function() {
  return this.api.getEventHandler();
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.raspberryPi.Connection.prototype.cleanUp = function() {
  console.log('Clean up Raspberry Pi connection ...');
  if (this.connectMonitor) {
    this.connectMonitor.stop();
  }
  this.stop();
  this.helper.removeEventListeners(this.listener, this.name);
};


/**
 * Adds an event listener for a specific event on a native event
 * target (such as a DOM element) or an object that has implemented
 * {@link goog.events.Listenable}.
 *
 * @param {EventTarget|goog.events.Listenable} src
 * @param {string} type
 * @param {function(?)} listener
 * @param {boolean=} opt_useCapture
 * @param {Object=} opt_listenerScope
 * @private
 */
cwc.mode.raspberryPi.Connection.prototype.addEventListener_ = function(src,
    type, listener, opt_useCapture, opt_listenerScope) {
  var eventListener = goog.events.listen(src, type, listener, opt_useCapture,
      opt_listenerScope);
  goog.array.insert(this.listener, eventListener);
};
