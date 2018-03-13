/**
 * @fileoverview Show an debug screen for simple testing.
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
goog.provide('cwc.ui.Debug');

goog.require('cwc.config.Debug');
goog.require('cwc.mode.Type');
goog.require('cwc.soy.Debug');
goog.require('cwc.utils.DialogType');
goog.require('cwc.ui.NotificationType');
goog.require('cwc.utils.Helper');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 */
cwc.ui.Debug = function(helper) {
  /** @type {string} */
  this.name = 'Debug';

  /** @type {!boolean} */
  this.enabled = false;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('debug');

  /** @type {Element} */
  this.node = null;
};


/**
 * Prepares the debug screen.
 */
cwc.ui.Debug.prototype.prepare = function() {
  let userConfigInstance = this.helper.getInstance('userConfig');
  if (userConfigInstance) {
    this.enabled = userConfigInstance.get(cwc.userConfigType.GENERAL,
        cwc.userConfigName.DEBUG_MODE) || false;
  }

  if (!this.enabled) {
    return;
  }

  console.log('Enable debug mode ...');

  // Show Developer Tools for native application.
  if (typeof window['nw'] !== 'undefined') {
    console.log('Show developer tools...');
    window['nw']['Window']['get']()['showDevTools']();
  }
};


/**
 * Decorates the given node and adds the debug screen.
 * @param {Element} node
 * @param {string=} opt_prefix
 */
cwc.ui.Debug.prototype.decorate = function(node, opt_prefix) {
  this.node = node;
  this.prefix = (opt_prefix || '') + this.prefix;
  goog.soy.renderElement(
      this.node,
      cwc.soy.Debug.template, {
        prefix: this.prefix,
        mode_types: cwc.mode.Type,
        dialog_types: cwc.utils.DialogType,
        message_types: cwc.ui.NotificationType,
      }
  );

  this.addEvents();
};


/**
 * Adds click events.
 */
cwc.ui.Debug.prototype.addEvents = function() {
  goog.events.listen(goog.dom.getElement(this.prefix + 'close'),
    goog.events.EventType.CLICK, this.close, false, this);

  this.addChangeHandler(goog.dom.getElement(this.prefix + 'message_types'),
      this.handleMessageType);

  let dialogInstance = this.helper.getInstance('dialog');
  this.addLinkHandler(goog.dom.getElement(this.prefix + 'dialog_show'),
    function() {
      this.helper.getInstance('dialog').show();
    });
  this.addLinkHandler(goog.dom.getElement(this.prefix + 'dialog_showModal'),
    function() {
      this.helper.getInstance('dialog').showModal();
    });
  this.addLinkHandler(goog.dom.getElement(this.prefix + 'dialog_close'),
    function() {
      this.helper.getInstance('dialog').close();
    });
  this.addLinkHandler(goog.dom.getElement(this.prefix + 'dialog_showPrompt'),
    function() {
      dialogInstance.showPrompt('Prompt', 'Whats your name', 'nobody').then(
        function(result) {
          console.log('Test result', result);
        }
      );
    });

  this.addLinkHandler(goog.dom.getElement(this.prefix + 'i18n_untranslated'),
    function() {
      this.helper.getInstance('i18n').getToDo();
    });
};


/**
 * @param {?} opt_event
 */
cwc.ui.Debug.prototype.close = function(opt_event) {
  let layoutInstance = this.helper.getInstance('layout', true);
  layoutInstance.showOverlay(false);
};


/**
 * @param {?} event
 */
cwc.ui.Debug.prototype.handleMessageType = function(event) {
  let target = event.target;
  let messageType = target.options[target.selectedIndex].value;
  console.log('MessageType:', messageType);
  if (messageType) {
    this.newMessage(cwc.ui.NotificationType[messageType]);
  }
};


/**
 * @param {Element} element
 * @param {Function} func
 */
cwc.ui.Debug.prototype.addLinkHandler = function(element, func) {
  goog.events.listen(element, goog.events.EventType.CLICK, func, false, this);
};


/**
 * @param {Element} element
 * @param {Function} func
 */
cwc.ui.Debug.prototype.addChangeHandler = function(element, func) {
  goog.events.listen(element, goog.events.EventType.CHANGE, func, false, this);
};


/**
 * Creates a new mode of the given type.
 * @param {string} type
 */
cwc.ui.Debug.prototype.newMessage = function(type) {
  let messageInstance = this.helper.getInstance('message');
  if (messageInstance) {
    messageInstance.showMessage('Test message: ' + type, type);
  }
};


/**
 * @param {string=} optName
 * @return {!boolean}
 * @export
 */
cwc.ui.Debug.prototype.isEnabled = function(optName) {
  if (!optName) {
    return this.enabled;
  }

  let name = optName || 'ENABLED';
  if (name in cwc.config.Debug) {
    return cwc.config.Debug[name];
  }
  return false;
};
