/**
 * @fileoverview Runner for the Coding with Chrome editor.
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
goog.provide('cwc.runner.Connector');

goog.require('cwc.utils.Logger');

goog.require('goog.events');
goog.require('goog.events.BrowserEvent');


/**
 * @param {!cwc.utils.Helper} helper
 * @param {string=} name
 * @constructor
 * @struct
 * @final
 */
cwc.runner.Connector = function(helper, name = 'Runner Connector') {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.name = name;

  /** @type {!Object} */
  this.commands = {};

  /** @type {!Object} */
  this.monitor = {};

  /** @type {Object} */
  this.target = null;

  /** @type {boolean} */
  this.targetLoaded = false;

  /** @type {!string} */
  this.targetOrigin = '*';

  /** @type {!boolean} */
  this.listen = false;

  /** @private {!Array} */
  this.listener_ = [];

  /** @type {!boolean} */
  this.directUpdate = false;

  /** @type {!string} */
  this.token = String(new Date().getTime());

  /** @type {!Object} */
  this.pingTime = {};

  /** @type {!number} */
  this.pingCounter = 0;

  /** @type {!number} */
  this.pingTestWorker = 0;

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * Inits the runner instance.
 * @param {boolean=} opt_listen
 */
cwc.runner.Connector.prototype.init = function(opt_listen) {
  if (opt_listen) {
    this.addEventListener_(window, 'message', this.handleMessage_, false, this);
    this.listen = true;
  }
  this.addCommand('__direct_update__', this.enableDirectUpdate_, this);
  this.addCommand('__handshake__', this.handleHandshake_, this);
  this.addCommand('__pong__', this.handlePong_, this);
};


/**
 * @param {Object} target
 */
cwc.runner.Connector.prototype.setTarget = function(target) {
  if (!target) {
    this.log_.error('Was not able to init runner with', target);
    return;
  }
  this.targetLoaded = false;
  this.target = target;
  this.target.addEventListener('contentload',
      this.handleContentLoad_.bind(this), false);
};


/**
 * @param {string!} command
 * @param {Object|number|string|Array=} optValue
 */
cwc.runner.Connector.prototype.send = function(command, optValue) {
  if (!this.target || !this.target.contentWindow || !this.targetLoaded) {
    return;
  }

  this.target.contentWindow.postMessage({
    'command': command, 'value': optValue},
    this.targetOrigin);
};


/**
 * @export
 */
cwc.runner.Connector.prototype.start = function() {
  this.executeCommand('__init__', null, true);
  if (this.listen) {
    this.log_.info('Sending handshake with token', this.token);
    this.send('__handshake__', this.token);
  }
};


/**
 * @private
 */
cwc.runner.Connector.prototype.enableDirectUpdate_ = function() {
  this.log_.info('Enabled direct update ...');
  this.directUpdate = true;
};


/**
 * @param {!string} name
 * @param {!function(?)} func
 * @param {?=} scope
 * @export
 */
cwc.runner.Connector.prototype.addCommand = function(name, func, scope) {
  if (!func || typeof func !== 'function') {
    this.log_.error('Invalid function for', name);
    return;
  }
  this.log_.info('Adding command', name, func);
  if (scope) {
    this.commands[name] = func.bind(scope);
  } else {
    this.commands[name] = func;
  }
};


/**
 * @param {!cwc.runner.profile.ev3.Command|
 *         cwc.runner.profile.makeblock.mbot.Command|
 *         cwc.runner.profile.makeblock.mbotRanger.Command|
 *         cwc.runner.profile.raspberryPi.Command|
 *         cwc.runner.profile.sphero.Command} profile
 * @param {?=} scope
 * @export
 */
cwc.runner.Connector.prototype.addCommandProfile = function(profile, scope) {
  if (!profile) {
    this.log_.error('Invalid command profile', profile);
    return;
  }
  if (!profile.__proto__) {
    this.log_.error('Unable to detect commands', profile);
    return;
  }
  let commandList = Object.getOwnPropertyNames(profile.__proto__);
  console.log(profile, commandList);
  for (let i = 0; i < commandList.length; i++) {
    let command = commandList[i];
    if (!command.endsWith('_') && command !== 'constructor') {
      this.addCommand(command, profile[command], scope || profile);
    }
  }
};


/**
 * @param {!function(?)} func
 * @param {?=} opt_scope
 * @export
 */
cwc.runner.Connector.prototype.setStartEvent = function(func, opt_scope) {
  this.addCommand('__start__', func, opt_scope);
};


/**
 * @param {!string} name
 * @param {!function(?)} func
 * @param {?=} opt_scope
 * @export
 */
cwc.runner.Connector.prototype.addMonitor = function(name, func, opt_scope) {
  if (!func) {
    this.log_.error('Runner monitor function is undefined for', name);
    return;
  }
  if (opt_scope) {
    this.monitor[name] = func.bind(opt_scope);
  } else {
    this.monitor[name] = func;
  }
};


/**
 * @param {!cwc.runner.profile.ev3.Monitor|
 *         cwc.runner.profile.makeblock.mbot.Monitor|
 *         cwc.runner.profile.makeblock.mbotRanger.Monitor|
 *         cwc.runner.profile.sphero.Monitor} profile
 * @param {?=} scope
 * @export
 */
cwc.runner.Connector.prototype.addMonitorProfile = function(profile, scope) {
  if (!profile) {
    this.log_.error('Invalid monitor profile', profile);
    return;
  }
  if (!profile.__proto__) {
    this.log_.error('Unable to detect monitors', profile);
    return;
  }
  let monitorList = Object.getOwnPropertyNames(profile.__proto__);
  console.log(profile, monitorList);
  for (let i = 0; i < monitorList.length; i++) {
    let monitor = monitorList[i];
    if (!monitor.endsWith('_') && monitor !== 'constructor') {
      this.addMonitor(monitor, profile[monitor], scope || profile);
    }
  }
};


/**
 * @param {EventTarget|goog.events.Listenable} event_handler
 * @param {!string} event
 * @param {!string} command
 * @export
 */
cwc.runner.Connector.prototype.addEvent = function(event_handler, event,
    command) {
  let customEvent = function(e) {
    this.send(command, e.data);
  };
  this.addEventListener_(event_handler, event, customEvent, false, this);
};


/**
 * @param {!string} name
 * @param {?=} value
 * @param {boolean=} opt_ignore_unknown
 * @export
 */
cwc.runner.Connector.prototype.executeCommand = function(name, value,
    opt_ignore_unknown) {
  if (typeof this.commands[name] === 'undefined') {
    if (!opt_ignore_unknown) {
      this.log_.warn('Received unknown command', name, 'with value', value);
    }
    return;
  }
  this.commands[name](value);
  this.executeMonitor(name, value);
};


/**
 * @param {!string} name
 * @param {?=} value
 * @export
 */
cwc.runner.Connector.prototype.executeMonitor = function(name, value) {
  if (typeof this.monitor[name] === 'undefined') {
    return;
  }
  this.monitor[name](value);
};


/**
 * @export
 */
cwc.runner.Connector.prototype.ping = function() {
  let pingId = this.pingCounter++;
  this.pingTime[pingId] = new Date().getTime();
  this.send('__ping__', pingId);
};


/**
 * @param {boolean=} opt_disable
 * @export
 */
cwc.runner.Connector.prototype.pingTest = function(opt_disable) {
  if (opt_disable && this.pingTestWorker) {
    clearInterval(this.pingTestWorker);
  } else if (!this.pingTestWorker) {
    this.pingTestWorker = setInterval(this.ping.bind(this), 0);
  }
};


/**
 * @param {goog.events.BrowserEvent=} opt_event
 * @private
 */
cwc.runner.Connector.prototype.handleContentLoad_ = function(opt_event) {
  this.targetLoaded = true;
};


/**
 * @param {goog.events.BrowserEvent} event
 * @private
 */
cwc.runner.Connector.prototype.handleMessage_ = function(event) {
  let browserEvent = event.getBrowserEvent();
  if (!browserEvent) {
    this.log_.error('Was not able to get browser event!');
    return;
  }

  this.executeCommand(browserEvent['data']['command'],
      browserEvent['data']['value']);
};


/**
 * @param {!string} token
 * @private
 */
cwc.runner.Connector.prototype.handleHandshake_ = function(token) {
  if (!token || this.token !== token) {
    this.log_.error('Received wrong handshake token:', token);
    return;
  }
  console.log('Received handshake with token:', token);
  this.handleStart_();
};


/**
 * @private
 */
cwc.runner.Connector.prototype.handleStart_ = function() {
  this.executeCommand('__start__', null, true);
  this.executeMonitor('reset');
  this.ping();
  this.send('__start__');
};


/**
 * @param {!Object} data
 * @private
 */
cwc.runner.Connector.prototype.handlePong_ = function(data) {
  let sendTime = data['time'] - this.pingTime[data['id']];
  let responseTime = new Date().getTime() - data['time'];
  let delay = new Date().getTime() - this.pingTime[data['id']];
  this.log_.info('PONG from', data['id'], ':', 'send=', sendTime + 'ms',
      'response=', responseTime + 'ms', 'delay=', delay + 'ms');
};


/**
 * Adds an event listener for a specific event on a native event
 * target (such as a DOM element) or an object that has implemented
 * {@link goog.events.Listenable}.
 *
 * @param {EventTarget|goog.events.Listenable} src
 * @param {string} type
 * @param {Function} listener
 * @param {boolean=} capture
 * @param {Object=} scope
 * @private
 */
cwc.runner.Connector.prototype.addEventListener_ = function(src, type, listener,
    capture = false, scope = undefined) {
  let eventListener = goog.events.listen(src, type, listener, capture, scope);
  goog.array.insert(this.listener_, eventListener);
};


/**
 * Clears all object based events.
 */
cwc.runner.Connector.prototype.cleanUp = function() {
  this.listener_ = this.helper.removeEventListeners(this.listener_, this.name);
};
