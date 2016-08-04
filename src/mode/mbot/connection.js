/**
 * @fileoverview handle mbot connection.
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
goog.provide('cwc.mode.mbot.Connection');

goog.require('cwc.protocol.mbot.Api');
goog.require('goog.Timer');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.mbot.Connection = function(helper) {
  /** @type {string} */
  this.name = 'mbot Connection';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {cwc.ui.ConnectionManager} */
  this.connectionManager = helper.getInstance('connectionManager');

  /** @type {!cwc.protocol.mbot.Api} */
  this.api = helper.getInstance('mbot', true);

  /** @type {goog.Timer} */
  this.connectMonitor = null;

  /** @type {!number} */
  this.connectMonitorInterval = 5000;

  /** @type {!Array} */
  this.listener = [];
};


/**
 * Connects the mbot unit.
 * @export
 */
cwc.mode.mbot.Connection.prototype.init = function() {
  if (!this.connectMonitor) {
    this.connectMonitor = new goog.Timer(this.connectMonitorInterval);
    this.addEventListener_(this.connectMonitor, goog.Timer.TICK,
      this.connect.bind(this));
  }
  this.connectMonitor.start();
  this.connect();
};


/**
 * Connects the mbot ball.
 * @param {Event=} opt_event
 * @export
 */
cwc.mode.mbot.Connection.prototype.connect = function(opt_event) {
  if (!this.isConnected()) {
    this.api.autoConnect();
  }
  this.api.monitor(true);
};


/**
 * Stops the current executions.
 * @export
 */
cwc.mode.mbot.Connection.prototype.stop = function() {
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
cwc.mode.mbot.Connection.prototype.reset = function(opt_event) {
  if (this.isConnected()) {
    this.api.reset();
  }
};


/**
 * @return {!boolean}
 * @export
 */
cwc.mode.mbot.Connection.prototype.isConnected = function() {
  return this.api.isConnected();
};


/**
 * @return {!cwc.protocol.mbot.Api}
 * @export
 */
cwc.mode.mbot.Connection.prototype.getApi = function() {
  return this.api;
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.mbot.Connection.prototype.cleanUp = function() {
  if (this.connectMonitor) {
    this.connectMonitor.stop();
  }
  this.api.monitor(false);
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
cwc.mode.mbot.Connection.prototype.addEventListener_ = function(src, type,
    listener, opt_useCapture, opt_listenerScope) {
  var eventListener = goog.events.listen(src, type, listener, opt_useCapture,
      opt_listenerScope);
  goog.array.insert(this.listener, eventListener);
};
