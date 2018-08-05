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
goog.provide('cwc.mode.sphero.sprkPlus.Monitor');

goog.require('cwc.lib.protocol.sphero.sprkPlus.Events');
goog.require('cwc.soy.mode.sphero.sprkPlus.Monitor');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.Helper');

goog.require('goog.events');
goog.require('goog.events.EventType');


goog.scope(function() {
const Events = goog.module.get('cwc.lib.protocol.sphero.sprkPlus.Events');

/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @param {!cwc.mode.sphero.sprkPlus.Connection} connection
 * @struct
 * @final
 */
cwc.mode.sphero.sprkPlus.Monitor = function(helper, connection) {
  /** @type {string} */
  this.name = 'Sphero SPRK+ Monitor';

  /** @type {string} */
  this.prefix = helper.getPrefix('sphero-sprk-plus-monitor');

  /** @type {Element} */
  this.node = null;

  /** @type {!Object.<Element>} */
  this.nodeCache = {};

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.mode.sphero.sprkPlus.Connection} */
  this.connection = connection;

  /** @type {boolean} */
  this.prepared = false;

  /** @private {!cwc.protocol.lego.ev3.Api} */
  this.api_ = this.connection.getApi();

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, this.prefix, this);
};


/**
 * Decorates the EV3 monitor window.
 * @param {!Element} node
 */
cwc.mode.sphero.sprkPlus.Monitor.prototype.decorate = function(node) {
  this.node = node;

  goog.soy.renderElement(
    this.node,
    cwc.soy.mode.sphero.sprkPlus.Monitor.template, {
      prefix: this.prefix,
    }
  );

  this.nodeCache['rgb'] = goog.dom.getElement(this.prefix + 'rgb-value');
  this.nodeCache['position'] =
    goog.dom.getElement(this.prefix + 'position-value');
  this.nodeCache['port_2'] = goog.dom.getElement(this.prefix + 'port_2-value');
  this.nodeCache['gyroscope'] = goog.dom.getElement(
    this.prefix + 'gyroscope-value');
  this.nodeCache['motion_sensor'] = goog.dom.getElement(
    this.prefix + 'motion_sensor-value');

  // Event Handler
  let eventTarget = this.connection.getEventTarget();

  // Monitor sensor data
  this.events_.listen(eventTarget,
    Events.Type.RGB, (e) => {
      this.nodeCache['rgb'].firstChild.nodeValue =
        `rgb(${e.data.r}, ${e.data.g}, ${e.data.b})`;
    });

  this.events_.listen(eventTarget,
    Events.Type.POSITION, (e) => {
      this.nodeCache['position'].firstChild.nodeValue =
        `x:${e.data.x} cm, y:${e.data.y} cm`;
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
cwc.mode.sphero.sprkPlus.Monitor.prototype.cleanUp = function() {
  console.log('Clean up Sphero SRPK+ monitor panel...');
  this.events_.clear();
};
});
