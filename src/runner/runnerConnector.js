/**
 * @fileoverview Runner for the Coding with Chrome editor.
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
goog.provide('cwc.runner.Connector');

goog.require('goog.events');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventType');



/**
 * @param {!cwc.utils.Helper} helper
 * @param {string=} opt_name
 * @constructor
 * @struct
 * @final
 */
cwc.runner.Connector = function(helper, opt_name) {
  /** @type {!string} */
  this.name = 'Runner Connector' || opt_name;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.utils.Logger} */
  this.log_ = helper.getLogger();

  /** @type {!Object} */
  this.commands = {};

  /** @type {!Object} */
  this.monitor = {};

  /** @type {Object} */
  this.target = null;

  /** @type {!string} */
  this.targetOrigin = '*';

  /** @type {!boolean} */
  this.listen = false;

  /** @type {!Array} */
  this.listener = [];

  /** @type {!boolean} */
  this.directUpdate = false;

  /** @type {!number} */
  this.token = new Date().getTime();

  /** @type {!Object} */
  this.pingTime = {};

  /** @type {!number} */
  this.pingCounter = 0;

  /** @type {Object} */
  this.pingTestWorker = null;
};


/**
 * Inits the runner instance.
 * @param {boolean} opt_listen
 */
cwc.runner.Connector.prototype.init = function(opt_listen) {
  if (opt_listen) {
    this.initListener();
  }
  this.addCommand('__direct_update__', this.enableDirectUpdate_.bind(this));
  this.addCommand('__handshake__', this.handleHandshake_.bind(this));
  this.addCommand('__pong__', this.handlePong_.bind(this));
};


cwc.runner.Connector.prototype.initListener = function() {
  this.addEventListener_(window, 'message', this.handleMessage_, false, this);
  this.listen = true;
};


/**
 * Inits the runner instance.
 * @param {Object} content
 */
cwc.runner.Connector.prototype.setTarget = function(target) {
  if (!target) {
    console.error('Was not able to init runner with', target);
    return;
  }
  this.targetLoaded = false;
  this.target = target;
  this.target.addEventListener('contentload',
      this.handleContentLoad_.bind(this), false);
};


/**
 * @param {string!} command
 * @param {object|number|string|array=} opt_value
 */
cwc.runner.Connector.prototype.send = function(command, opt_value) {
  if (!this.target || !this.target.contentWindow || !this.targetLoaded) {
    return;
  }

  this.target.contentWindow.postMessage({
    'command': command, 'value': opt_value },
    this.targetOrigin);
};


/**
 * @export
 */
cwc.runner.Connector.prototype.start = function() {
  this.executeCommand('__init__', null, true);
  if (this.listen) {
    console.log('Sending handhshake with token', this.token);
    this.send('__handshake__', this.token);
  }
};


/**
 * @private
 */
cwc.runner.Connector.prototype.enableDirectUpdate_ = function() {
  console.log('Enabled direct update ...');
  this.directUpdate = true;
};


/**
 * @param {!string} name
 * @param {!function(?)} func
 * @param {?} opt_scope
 * @export
 */
cwc.runner.Connector.prototype.addCommand = function(name, func, opt_scope) {
  if (!func) {
    console.error('Runner function is undefined for', name);
    return;
  }
  if (opt_scope) {
    this.commands[name] = func.bind(opt_scope);
  } else {
    this.commands[name] = func;
  }
};


/**
 * @param {!string} name
 * @param {!function(?)} func
 * @param {?} opt_scope
 * @export
 */
cwc.runner.Connector.prototype.addMonitor = function(name, func, opt_scope) {
  if (!func) {
    console.error('Runner monitor function is undefined for', name);
    return;
  }
  if (opt_scope) {
    this.monitor[name] = func.bind(opt_scope);
  } else {
    this.monitor[name] = func;
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
  var customEvent = function(e) {
    this.send(command, e.data);
  };
  this.addEventListener_(event_handler, event, customEvent, false, this);
};


/**
 * @param {!string} name
 * @param {?} value
 * @param {boolean=} opt_ignore_unknown
 * @export
 */
cwc.runner.Connector.prototype.executeCommand = function(name, value,
    opt_ignore_unknown) {
  if (typeof this.commands[name] === 'undefined') {
    if (!opt_ignore_unknown) {
      console.log('Runner connector received unknow command', name,
        'with value', value);
    }
    return;
  }
  this.commands[name](value);

  if (typeof this.monitor[name] === 'undefined') {
    return;
  }
  this.monitor[name](value);
};


/**
 * @export
 */
cwc.runner.Connector.prototype.ping = function() {
  var pingId = this.pingCounter++;
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
  this.target.executeScript({
    code: 'console.log("Hello World");' });
};


/**
 * @param {goog.events.BrowserEvent} event
 * @private
 */
cwc.runner.Connector.prototype.handleMessage_ = function(event) {
  var browserEvent = event.getBrowserEvent();
  if (!browserEvent) {
    console.error('Was not able to get browser event!');
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
    console.error('Recieved wrong handshake token:', token);
    return;
  }
  console.log('Recieved handshake with token:', token);
  this.executeCommand('__start__', null, true);
  this.ping();
  this.send('__start__');
};


/**
 * @param {!Object} data
 * @private
 */
cwc.runner.Connector.prototype.handlePong_ = function(data) {
  var currentTime = new Date().getTime();
  var sendTime =  data['time'] - this.pingTime[data['id']];
  var responseTime = currentTime - data['time'];
  var delay = currentTime - this.pingTime[data['id']];
  console.log('PONG from', data['id'], ':', 'send=', sendTime + 'ms',
      'response=', responseTime + 'ms', 'delay=', delay + 'ms');
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
cwc.runner.Connector.prototype.addEventListener_ = function(src, type,
    listener, opt_useCapture, opt_listenerScope) {
  var eventListener = goog.events.listen(src, type, listener, opt_useCapture,
      opt_listenerScope);
  goog.array.insert(this.listener, eventListener);
};


/**
 * Clears all object based events.
 */
cwc.runner.Connector.prototype.cleanUp = function() {
  this.listener = this.helper.removeEventListeners(this.listener, this.name);
};
