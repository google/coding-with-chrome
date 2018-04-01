/**
 * @fileoverview Runner for the Sphero modification.
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
goog.provide('cwc.mode.sphero.Runner');

goog.require('cwc.runner.profile.sphero.Command');
goog.require('cwc.runner.profile.sphero.Monitor');
goog.require('cwc.ui.Runner');
goog.require('cwc.ui.Turtle');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.Helper');

goog.require('goog.dom');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @param {!cwc.mode.sphero.classic.Connection|
 *   cwc.mode.sphero.bb8.Connection|
 *   cwc.mode.sphero.sprkPlus.Connection|
 *   cwc.mode.sphero.ollie.Connection} connection
 * @struct
 * @final
 */
cwc.mode.sphero.Runner = function(helper, connection) {
  /** @type {string} */
  this.name = 'Sphero Runner';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = helper.getPrefix('sphero-runner');

  /**
   * @type {!cwc.mode.sphero.classic.Connection|
   *   cwc.mode.sphero.bb8.Connection|
   *   cwc.mode.sphero.sprkPlus.Connection|
   *   cwc.mode.sphero.ollie.Connection}
   */
  this.connection = connection;

  /** @type {!cwc.protocol.sphero.classic.Api} */
  this.api = this.connection.getApi();

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

  /** @type {!cwc.runner.profile.sphero.Monitor} */
  this.monitor = new cwc.runner.profile.sphero.Monitor(this.turtle);

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name);

  /** @type {!cwc.ui.Runner} */
  this.runner = new cwc.ui.Runner(helper);
};


/**
 * Decorates the runner object for the Sphero modification.
 * @export
 */
cwc.mode.sphero.Runner.prototype.decorate = function() {
  this.helper.setInstance('runner', this.runner, true);
  this.helper.setInstance('turtle', this.turtle, true);

  // Start Event
  this.runner.setStartEvent(this.handleStart_, this);

  // Commands
  this.runner.addCommandProfile(
    new cwc.runner.profile.sphero.Command(this.api));

  // Monitoring
  this.runner.addMonitor('roll', this.monitor.roll, this.monitor);

  this.runner.setCleanUpFunction(this.handleCleanUp.bind(this));
  this.runner.decorate();

  // Sphero Events
  let apiEventHandler = this.api.getEventHandler();
  if (!apiEventHandler) {
    console.error('Sphero API event handler is not defined!');
  }
  this.runner.addEvent(apiEventHandler,
    cwc.protocol.sphero.classic.Events.Type.COLLISION, 'collision');

  // Preview output
  let turtleNode = this.runner.getTurtleNode();
  this.turtle.decorate(turtleNode);

  // Unload event
  let layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    let eventHandler = layoutInstance.getEventHandler();
    this.events_.listen(eventHandler, goog.events.EventType.UNLOAD,
        this.cleanUp, false, this);
  }
};


/**
 * @private
 */
cwc.mode.sphero.Runner.prototype.handleStart_ = function() {
  this.monitor.reset();
  this.turtle.action('speed', 5);
  this.turtle.reset();
};


/**
 * Handles the cleanup and make sure that the Sphero stops.
 */
cwc.mode.sphero.Runner.prototype.handleCleanUp = function() {
  this.api.cleanUp();
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.sphero.Runner.prototype.cleanUp = function() {
  this.connection.cleanUp();
  this.events_.clear();
};
