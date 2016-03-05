/**
 * @fileoverview Monitor for the EV3 modification.
 *
 * @license Copyright 2015 Google Inc. All Rights Reserved.
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
goog.provide('cwc.mode.ev3.Monitor');

goog.require('cwc.protocol.ev3.Api');
goog.require('cwc.protocol.ev3.Events');
goog.require('cwc.soy.mode.ev3.Monitor');
goog.require('cwc.utils.Helper');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @param {!cwc.mode.ev3.Connection} connection
 * @struct
 * @final
 */
cwc.mode.ev3.Monitor = function(helper, connection) {
  /** @type {string} */
  this.name = 'EV3 Monitor';

  /** @type {Element} */
  this.nodeIntro = null;

  /** @type {Element} */
  this.nodeMonitor = null;

  /** @type {Element} */
  this.nodeMonitorValues = null;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.mode.ev3.Connection} */
  this.connection = connection;

  /** @type {!cwc.protocol.ev3.Api} */
  this.api = this.connection.getApi();

  /** @type {string} */
  this.prefix = helper.getPrefix('ev3-monitor');

  /** @type {boolean} */
  this.prepared = false;

  /** @type {!Array} */
  this.listener = [];

  if (!this.connection) {
    console.error('Missing connection instance !');
  }

};


/**
 * Decorates the EV3 monitor window.
 */
cwc.mode.ev3.Monitor.prototype.decorate = function() {
  var runnerInstance = this.helper.getInstance('runner', true);
  var runnerMonitor = runnerInstance.getMonitor();
  if (!runnerMonitor) {
    console.error('Runner Monitor is not there!', this.runner);
    return;
  }

  this.nodeIntro = runnerMonitor.getIntroNode();
  this.nodeMonitor = runnerMonitor.getMonitorNode();

  goog.soy.renderElement(
      this.nodeIntro,
      cwc.soy.mode.ev3.Monitor.intro, {
        'prefix': this.prefix
      }
  );

  goog.soy.renderElement(
      this.nodeMonitor,
      cwc.soy.mode.ev3.Monitor.template, {
        'prefix': this.prefix
      }
  );

  if (!this.styleSheet) {
    this.styleSheet = goog.style.installStyles(
      cwc.soy.mode.ev3.Monitor.style({'prefix': this.prefix}));
  }

  this.nodeMonitorValues = goog.dom.getElement(this.prefix + 'monitor');

  // Update Event
  var eventHandler = this.connection.getEventHandler();
  this.addEventListener_(eventHandler,
      cwc.protocol.ev3.Events.Type.CHANGED_VALUES, this.updateDeviceData, false,
      this);

  // Monitoring
  this.updateDeviceData();

  // Unload event
  var layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    let eventHandler = layoutInstance.getEventHandler();
    this.addEventListener_(eventHandler, goog.events.EventType.UNLOAD,
        this.cleanUp, false, this);
  }

  runnerInstance.enableMonitor(true);
};


/**
 * Updates device Data.
 * @param {Event=} opt_event
 */
cwc.mode.ev3.Monitor.prototype.updateDeviceData = function(opt_event) {
  goog.soy.renderElement(
      this.nodeMonitorValues,
      cwc.soy.mode.ev3.Monitor.monitorValues,
      {'prefix': this.prefix, 'devices': this.connection.getDeviceData()}
  );
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.ev3.Monitor.prototype.cleanUp = function() {
  if (this.timerMonitor) {
    this.timerMonitor.stop();
  }
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
cwc.mode.ev3.Monitor.prototype.addEventListener_ = function(src, type,
    listener, opt_useCapture, opt_listenerScope) {
  var eventListener = goog.events.listen(src, type, listener, opt_useCapture,
      opt_listenerScope);
  goog.array.insert(this.listener, eventListener);
};
