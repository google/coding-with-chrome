/**
 * @fileoverview Simulation for the Sphero SPRK+ modification.
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
goog.provide('cwc.mode.sphero.sprkPlus.Simulation');

goog.require('cwc.MessengerEvents');
goog.require('cwc.mode.sphero.sprkPlus.SimulationCommand');
goog.require('cwc.ui.Turtle');
goog.require('cwc.utils.Events');


goog.scope(function() {
const Events = goog.module.get('cwc.lib.protocol.sphero.sprkPlus.Events');

/**
 * @param {!cwc.utils.Helper} helper
 * @param {!cwc.mode.sphero.sprkPlus.Connection} connection
 * @constructor
 */
cwc.mode.sphero.sprkPlus.Simulation = function(helper, connection) {
  /** @type {string} */
  this.name = 'Sphero SPRK+ Simulation';

  /** @type {string} */
  this.prefix = helper.getPrefix('sphero-sprk-plus-simulation');

  /** @type {!cwc.mode.sphero.sprkPlus.Connection} */
  this.connection = connection;

  /** @type {Element} */
  this.node = null;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.sprite = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAA' +
    'DE6YVjAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAxAAAAMQBz4pYTAAAABl0RVh0U29mdH' +
    'dhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAKwSURBVEiJtdY9b9NAGAfw/9m5OG9qm6atSB' +
    'NRXhbUJVXldAgqDG2XdELqUGBCiA/AJ2CDhR0GxMJSJFbKgCrEYlTFUlSpHUBVWgWaRDImSW' +
    'Unjs/2sVBU0ryoov6PZ+v53fl0vodgQBRFCUej0ZVYLJYXRXGOc54khIxxzhuEkKrrukXDMD' +
    '6Ypvkxl8u1+9UhvQZVVaXRaPR+JBJ5Qim9MmgiAOA4zlGr1XpeKpVe5PP5zlCkUChcSyQSb0' +
    'OhkDyseHcsyyrour6ezWZLfZFisZibmJh4J4pisleRWq2GcrkMXdfR6XTAOYckSRgdHUUqlc' +
    'LMzAw8z6tomrY2Pz//5Qyiqur1ycnJz5TSVC9AURTs7u4OXMn09DTy+Txc162Vy+Xbi4uL3w' +
    'BAAIC9vb3g+Pj4Rj8AAAzDGAgAgGma4JyDUnopnU6/UVWVAkAAAAghj4btwfLyMvb39//5XJ' +
    '7nIRQKYWxsDMlkErOzsxBFEQAgSdJCOBx+COAlUVU1MjU19TUQCKSHTvWcsW27XKlUbgjBYH' +
    'DFDwAAgsHg5Xg8viTEYrG8H8BJKKWrAiFkzk9EFMU5AUDPM3GBSQqEkLifAiEkIXDOf/mJcM' +
    '5/CgCqfiIAqoLneUU/BcdxikK73d70E2GMvRcsy9pyHOe7H4Bt2+VGo/FJkGW51Wq1nvmBmK' +
    'b5NJfLtQUAMAzjlWVZhYsEbNvebrfbr4E/v3pZlpmu6+uMsaOLABzHqWmadk+WZfYXAYBsNl' +
    'tqNBprrutW/gdwXfdI07Q7p6/gM3f8zs7O1ZGRkQ1JkhbOC9i2vd1sNu9mMpmD0+NC94uZTO' +
    'bg8PDwZrPZfMAYO+h+3iuMsR/Hx8ePTdO81Q0AfVqikyiKEo7H40uU0tVAIHDSd8U553VCSJ' +
    'UxVnQcZ7Ner28N6rt+A5fqLKDwdn52AAAAAElFTkSuQmCC';

  /** @type {!cwc.ui.Turtle} */
  this.turtle = new cwc.ui.Turtle(helper, this.sprite);

  /** @private {Object} */
  this.cache_ = {};

  /** @type {boolean} */
  this.connected_ = false;

  /** @type {!cwc.mode.sphero.SimulationCommand} */
  this.commands_ = new cwc.mode.sphero.sprkPlus.SimulationCommand(this.turtle);

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, this.prefix, this);
};


/**
 * Decorates the simulation for the EV3 modification.
 * @param {!Element} node
 * @export
 */
cwc.mode.sphero.sprkPlus.Simulation.prototype.decorate = function(node) {
  this.node = node;

  // Decorate turtle
  this.turtle.decorate(node);

  // Unload event
  let layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    this.events_.listen(layoutInstance.getEventTarget(),
        goog.events.EventType.UNLOAD, this.cleanUp);
  }

  // Command event
  let previewInstance = this.helper.getInstance('preview');
  if (previewInstance) {
    this.events_.listen(previewInstance.getEventTarget(),
        cwc.MessengerEvents.Type.COMMAND, this.handleCommand_);
  }

  // Roboter event
  let connectionEvent = this.connection.getEventTarget();
  this.events_.listen(
    connectionEvent, Events.Type.POSITION, this.handlePosition_);
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.sphero.sprkPlus.Simulation.prototype.cleanUp = function() {
  console.log('Clean up Sphero simulation ...');
  this.events_.clear();
};


/**
 * @param {!Event} e
 * @private
 */
cwc.mode.sphero.sprkPlus.Simulation.prototype.handleCommand_ = function(e) {
  if (typeof this.commands_[e.data['name']] === 'undefined') {
    return;
  }
  let commandName = e.data['name'];
  if (commandName === '__handshake__') {
    this.cache_ = {};
    this.connected_ = false;
  }
  // Exclude specific commands if device is connected.
  if (this.connected_) {
    switch (commandName) {
      case 'roll':
        return;
    }
  }
  this.commands_[commandName](e.data['value']);
};


/**
 * @param {!Event} e
 * @private
 */
cwc.mode.sphero.sprkPlus.Simulation.prototype.handlePosition_ = function(e) {
  if (this.cache_['position'] &&
      this.cache_['position']['x'] === e.data['x'] &&
      this.cache_['position']['y'] === e.data['y']) {
    return;
  }
  this.connected_ = true;
  this.commands_['position'](e.data);
  this.cache_['position'] = e.data;
};
});
