/**
 * @fileoverview Preview Messenger for the Coding with Chrome editor.
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
goog.provide('cwc.Messenger');

goog.require('cwc.MessengerEvents');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.Logger');

goog.require('goog.events.EventTarget');


/**
 * @param {goog.events.EventTarget=} eventTarget
 * @constructor
 * @struct
 * @final
 */
cwc.Messenger = function(eventTarget) {
  /** @type {string} */
  this.name = 'Messenger';

  /** @type {string} */
  this.appOrigin = '';

  /** @type {Object} */
  this.appWindow = null;

  /** @type {Object} */
  this.target = null;

  /** @type {string} */
  this.targetOrigin = '*';

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, '', this);

  /** @private {!goog.events.EventTarget} */
  this.eventTarget_ = eventTarget || new goog.events.EventTarget();

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);

  /** @private {Object} */
  this.listener_ = {};

  /** @private {Object} */
  this.listenerScope_ = this;

  /** @type {string} */
  this.token_ = String(new Date().getTime());

  // External listener
  this.addListener('__handshake__', this.handleHandshake_);
};


/**
 * Adds the command to the listener.
 * @param {string} name
 * @param {!Function} func
 * @param {?=} scope
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.Messenger.prototype.addListener = function(name, func,
    scope = this.listenerScope_) {
  if (!name) {
    this.log_.error('Listener name is undefined!');
    return;
  } else if (!func || typeof func !== 'function') {
    this.log_.error('Listener function', name, 'is undefined!');
    return;
  } else if (typeof this.listener_[name] !== 'undefined') {
    this.log_.error('Listener', name, 'is already defined!');
    return;
  }
  this.listener_[name] = scope ? func.bind(scope) : func;
  this.log_.info('Added message listener', name);
  return this;
};


/**
 * Adds listener commands provided by api implementations.
 * @param {!Object} api
 * @export
 */
cwc.Messenger.prototype.addApiListener = function(api) {
  if (!api) {
    this.log_.error('Invalid api', api);
    return;
  }
  if (!api.handler) {
    this.log_.error('Unable to get api handler for', api);
    return;
  }
  if (!api.handler.__proto__) {
    this.log_.error('Unable to detect api any commands', api.handler);
    return;
  }
  let commandList = Object.getOwnPropertyNames(api.handler.__proto__);
  for (let i = 0; i < commandList.length; i++) {
    let command = commandList[i];
    if (!command.endsWith('_') && !command.endsWith('_$') &&
         command !== 'constructor') {
      this.addListener(command, function(data) {
        api.exec(command, data);
      });
    }
  }
};


/**
 * @param {EventTarget|goog.events.Listenable} eventTarget
 * @param {string} event
 * @param {string} command
 * @export
 */
cwc.Messenger.prototype.addEventListener = function(eventTarget, event,
    command) {
  this.events_.listen(eventTarget, event, function(e) {
    this.send(command, {
      'data': e.data,
      'source': e.source,
    });
  });
  this.log_.info('Added', event, 'event listener', command);
};


/**
 * @param {string!} name
 * @param {Object|number|string|Array=} value
 */
cwc.Messenger.prototype.send = function(name, value = {}) {
  if (!this.target || !this.target.contentWindow) {
    return;
  }
  this.target.contentWindow.postMessage({
    'name': name,
    'value': value,
  }, this.targetOrigin);
};


/**
 * @param {string} appOrigin
 * @export
 */
cwc.Messenger.prototype.setAppOrigin = function(appOrigin) {
  if (appOrigin) {
    this.appOrigin = appOrigin;
  }
};


/**
 * @param {!Object} appWindow
 * @export
 */
cwc.Messenger.prototype.setAppWindow = function(appWindow) {
  if (appWindow) {
    this.appWindow = appWindow;
  }
};


/**
 * @param {Object} target
 */
cwc.Messenger.prototype.setTarget = function(target) {
  if (!target) {
    this.log_.error('Was not able to init target', target);
    return;
  }
  this.target = target;
  this.events_.listen(window, 'message', this.handleMessage_);

  // Detected when target is possible loaded and ready.
  if (target.nodeName === 'IFRAME') {
    this.target['onload'] = this.handleContentLoad_.bind(this);
  } else {
    this.target.addEventListener('contentload',
      this.handleContentLoad_.bind(this), false);
  }
};


/**
 * Sets the listener scope.
 * @param {!Function} scope
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.Messenger.prototype.setListenerScope = function(scope) {
  if (scope && typeof scope !== 'function' && typeof scope !== 'object') {
    throw new Error('Invalid scope!', scope);
  } else if (scope) {
    this.listenerScope_ = scope;
  }
  return this;
};


cwc.Messenger.prototype.cleanUp = function() {
  this.log_.info('Clean up ...');
  this.events_.clear();
};


/**
 * @param {Event} event
 * @private
 */
cwc.Messenger.prototype.handleContentLoad_ = function(event) {
  if (event && event['target'] && event['target']['src'] === 'about:blank') {
    return;
  }
  this.token_ = String(new Date().getTime());
  this.log_.info('Sending handshake with token', this.token_);
  this.send('__handshake__', {
    'token': this.token_,
    'start_time': new Date().getTime(),
  });
};


/**
 * Handles the received messages and executes the predefined actions.
 * @param {Event} event
 * @private
 */
cwc.Messenger.prototype.handleMessage_ = function(event) {
  event = event.getBrowserEvent();
  if (!event) {
    throw new Error('Was not able to get browser event!');
  }
  if (!this.appWindow && 'source' in event) {
    this.setAppWindow(event['source']);
  } else if (this.appWindow !== event['source']) {
    this.log_.error('App window is not matching!');
    return;
  }
  if (!this.appOrigin && 'origin' in event) {
    this.setAppOrigin(event['origin']);
  } else if (this.appOrigin !== event['origin']) {
    this.log_.error('App origin is not matching!');
    return;
  }
  if (typeof this.listener_[event['data']['name']] === 'undefined') {
    throw new Error('Name ' + event['data']['name'] + ' is not defined!');
  }
  this.listener_[event['data']['name']](event['data']['value']);
  this.eventTarget_.dispatchEvent(cwc.MessengerEvents.execCommand(
    event['data']['name'], event['data']['value']));
};


/**
 * @param {!Object} data
 * @private
 */
cwc.Messenger.prototype.handleHandshake_ = function(data) {
  let token = data['token'];
  if (!token || this.token_ !== token) {
    this.log_.error('Received wrong handshake token:', token, this.token_);
    return;
  }
  this.log_.info('Received handshake with token:', token);
  let startTime = data['start_time'];
  let pingTime = data['ping_time'];
  if (startTime && pingTime) {
    let endTime = new Date().getTime();
    this.log_.info(
      'send=', pingTime - startTime + 'ms',
      'response=', endTime - pingTime + 'ms',
      'delay=', endTime - startTime + 'ms');
  }
};
