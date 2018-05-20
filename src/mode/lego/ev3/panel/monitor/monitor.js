/**
 * @fileoverview Monitor for the EV3 modification.
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
goog.provide('cwc.mode.lego.ev3.Monitor');

goog.require('cwc.protocol.lego.ev3.Api');
goog.require('cwc.protocol.lego.ev3.Events');
goog.require('cwc.protocol.lego.ev3.RobotType');
goog.require('cwc.protocol.lego.ev3.Robots');
goog.require('cwc.soy.mode.ev3.Monitor');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.Gamepad.Events');
goog.require('cwc.utils.Helper');

goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.KeyboardShortcutHandler');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @param {!cwc.mode.lego.ev3.Connection} connection
 * @struct
 * @final
 */
cwc.mode.lego.ev3.Monitor = function(helper, connection) {
  /** @type {string} */
  this.name = 'EV3 Monitor';

  /** @type {string} */
  this.prefix = helper.getPrefix('ev3-monitor');

  /** @type {Element} */
  this.node = null;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.mode.lego.ev3.Connection} */
  this.connection = connection;

  /** @type {boolean} */
  this.prepared = false;

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, this.prefix);
};


/**
 * Decorates the EV3 monitor window.
 * @param {!Element} node
 */
cwc.mode.lego.ev3.Monitor.prototype.decorate = function(node) {
  this.node = node;

  goog.soy.renderElement(
    this.node,
    cwc.soy.mode.ev3.Monitor.waitingForData, {
      prefix: this.prefix,
    }
  );

  let eventHandler = this.connection.getEventHandler();

  // Monitor device data
  this.events_.listen(eventHandler,
    cwc.protocol.lego.ev3.Events.Type.CHANGED_DEVICES, this.updateDevices,
    false, this);

  // Monitor sensor data
  for (let device in cwc.protocol.lego.ev3.DeviceType) {
    if (cwc.protocol.lego.ev3.DeviceType.hasOwnProperty(device)) {
      this.events_.listen(eventHandler,
        cwc.protocol.lego.ev3.DeviceType[device], this.updateDeviceData,
        false, this);
    }
  }

  // Unload event
  let layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    let eventHandler = layoutInstance.getEventHandler();
    this.events_.listen(eventHandler, goog.events.EventType.UNLOAD,
        this.cleanUp, false, this);
  }
};


/**
 * Updates device Data in monitor tab.
 * @param {Event=} event
 */
cwc.mode.lego.ev3.Monitor.prototype.updateDevices = function(event) {
  goog.soy.renderElement(
    this.node,
    cwc.soy.mode.ev3.Monitor.template, {
      prefix: this.prefix,
      devices: event.data,
    }
  );
};


/**
 * Updates device Data in monitor tab.
 * @param {Event=} event
 */
cwc.mode.lego.ev3.Monitor.prototype.updateDeviceData = function(event) {
  if (!event || typeof event.data === 'undefined') {
    return;
  }
  goog.dom.getElement(this.prefix + 'port-' + event.source + '-value')
    .textContent = event.data;
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.lego.ev3.Monitor.prototype.cleanUp = function() {
  console.log('Clean up EV3 monitor ...');
  this.events_.clear();
};
