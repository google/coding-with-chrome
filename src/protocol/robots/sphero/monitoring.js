/**
 * @fileoverview Sphero monitoring logic.
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
goog.provide('cwc.protocol.sphero.Monitoring');

goog.require('goog.Timer');




/**
 * @constructor
 * @param {!cwc.protocol.sphero.Api} api
 * @struct
 * @final
 */
cwc.protocol.sphero.Monitoring = function(api) {
  /** @type {!cwc.protocol.sphero.Api} */
  this.api = api;

  /** @type {boolean} */
  this.monitor = false;

  /** @type {!number} */
  this.monitorLocationInterval = 1000;  // Duration in ms.

  /** @type {goog.Timer} */
  this.monitorLocation = new goog.Timer(this.monitorLocationInterval);

  /** @type {boolean} */
  this.started = false;

  /** @type {!Array} */
  this.listener = [];

  // Monitor Events
  this.addEventListener_(this.monitorLocation, goog.Timer.TICK,
    this.api.getLocation, false, this.api);
};


/**
 * Starts the monitoring.
 */
cwc.protocol.sphero.Monitoring.prototype.start = function() {
  if (this.started) {
    return;
  }
  console.log('Starting Sphero Monitoring ...');
  this.monitorLocation.start();
  this.started = true;
};


/**
 * Stops the port monitoring.
 */
cwc.protocol.sphero.Monitoring.prototype.stop = function() {
  if (!this.started) {
    return;
  }
  console.log('Stopping Sphero Monitoring ...');
  this.monitorLocation.stop();
  this.started = false;
};


/**
 * Adds an event listener for a specific event on a native event
 * target (such as a DOM element) or an object that has implemented
 * {@link goog.events.Listenable}.
 *
 * @param {EventTarget|goog.events.Listenable} src
 * @param {string} type
 * @param {function()} listener
 * @param {boolean=} opt_useCapture
 * @param {Object=} opt_listenerScope
 * @private
 */
cwc.protocol.sphero.Monitoring.prototype.addEventListener_ = function(src, type,
    listener, opt_useCapture, opt_listenerScope) {
  var eventListener = goog.events.listen(src, type, listener, opt_useCapture,
      opt_listenerScope);
  goog.array.insert(this.listener, eventListener);
};
