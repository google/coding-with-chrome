/**
 * @fileoverview Monitor for the Lego WeDo 2.0 modification.
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
goog.provide('cwc.mode.lego.weDo2.Monitor');

goog.require('cwc.lib.protocol.lego.weDo2.Events');
goog.require('cwc.soy.mode.lego.weDo2.Monitor');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.Helper');

goog.require('goog.events');
goog.require('goog.events.EventType');


goog.scope(function() {
const Events = goog.require('cwc.lib.protocol.lego.weDo2.Events');

/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @param {!cwc.mode.lego.weDo2.Connection} connection
 * @struct
 * @final
 */
cwc.mode.lego.weDo2.Monitor = function(helper, connection) {
  /** @type {string} */
  this.name = 'Lego WeDo 2.0 Monitor';

  /** @type {string} */
  this.prefix = helper.getPrefix('lego-wedo2-monitor');

  /** @type {Element} */
  this.node = null;

  /** @type {!Object.<Element>} */
  this.nodeCache = {};

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.mode.lego.weDo2.Connection} */
  this.connection = connection;

  /** @type {boolean} */
  this.prepared = false;

  /** @enum {string} */
  this.namedSensorType = {
    0: 'None',
    1: 'Motor',
    34: 'Gyroscope',
    35: 'Motion sensor',
  };

  /** @private {!cwc.protocol.lego.ev3.Api} */
  this.api_ = this.connection.getApi();

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, this.prefix, this);
};


/**
 * Decorates the EV3 monitor window.
 * @param {!Element} node
 */
cwc.mode.lego.weDo2.Monitor.prototype.decorate = function(node) {
  this.node = node;

  goog.soy.renderElement(
    this.node,
    cwc.soy.mode.lego.weDo2.Monitor.template, {
      prefix: this.prefix,
    }
  );

  this.nodeCache['button'] = goog.dom.getElement(this.prefix + 'button-value');
  this.nodeCache['port_1'] = goog.dom.getElement(this.prefix + 'port_1-value');
  this.nodeCache['port_2'] = goog.dom.getElement(this.prefix + 'port_2-value');
  this.nodeCache['gyroscope'] = goog.dom.getElement(
    this.prefix + 'gyroscope-value');
  this.nodeCache['motion_sensor'] = goog.dom.getElement(
    this.prefix + 'motion_sensor-value');

  // Event Handler
  let eventTarget = this.connection.getEventTarget();

  // Monitor sensor data
  this.events_.listen(eventTarget,
    Events.Type.BUTTON_PRESSED, (e) => {
      this.nodeCache['button'].firstChild.nodeValue = e.data;
    });
  this.events_.listen(eventTarget,
    Events.Type.CHANGED_DEVICE, (e) => {
      let type = e.data;
      let port = e.source;
      if (port === 1) {
        this.nodeCache['port_1'].firstChild.nodeValue =
          this.namedSensorType[type];
      } else if (port === 2) {
        this.nodeCache['port_2'].firstChild.nodeValue =
          this.namedSensorType[type];
      }
    });

  // Unload event
  let layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    let eventTargetLayout = layoutInstance.getEventTarget();
    this.events_.listen(
      eventTargetLayout, goog.events.EventType.UNLOAD, this.cleanUp);
  }
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.lego.weDo2.Monitor.prototype.cleanUp = function() {
  console.log('Clean up Lego WeDo 2.0 monitor panel...');
  this.events_.clear();
};
});
