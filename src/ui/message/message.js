/**
 * @fileoverview UI Messenger for the Coding with Chrome editor.
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
goog.provide('cwc.ui.Message');
goog.provide('cwc.ui.MessageType');

goog.require('cwc.soy.ui.Message');
goog.require('goog.Timer');
goog.require('goog.array');
goog.require('goog.dom.classes');
goog.require('goog.dom.classlist');
goog.require('goog.soy');


/**
 * @enum {string}
 */
cwc.ui.MessageType = {
  CONFIRM: 'confirm',
  DEBUG: 'debug',
  ERROR: 'error',
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning'
};



/**
 * @constructor
 * @struct
 * @final
 */
cwc.ui.Message = function() {
  /** @type {string} */
  this.name = 'Message';

  /** @type {Element} */
  this.node = null;

  /** @type {string} */
  this.prefix = 'message-';

  /** @type {Element} */
  this.nodeBody = null;

  /** @type {Element} */
  this.nodeText = null;

  /** @type {cwc.ui.MessageType} */
  this.messageType = null;
};


/**
 * Decorates the given node and adds a ui messenger.
 * @param {Element} node The target node to add the ui messenger.
 * @param {string=} opt_prefix Additional prefix for the ids of the
 *    inserted elements and style definitions.
 */
cwc.ui.Message.prototype.decorate = function(node, opt_prefix) {
  this.node = node;
  this.prefix = opt_prefix + this.prefix;

  goog.soy.renderElement(
      this.node,
      cwc.soy.ui.Message.messageTemplate,
      {'prefix': this.prefix}
  );

  goog.style.installStyles(
      cwc.soy.ui.Message.messageStyle({ 'prefix': this.prefix })
  );

  this.nodeBody = goog.dom.getElement(this.prefix + 'body');
  this.nodeText = goog.dom.getElement(this.prefix + 'text');
  this.hide();
};


/**
 * @param {!string} message Shows info message.
 */
cwc.ui.Message.prototype.info = function(message) {
  this.showMessage(message, cwc.ui.MessageType.INFO);
};


/**
 * @param {!string} message Shows promotion message.
 */
cwc.ui.Message.prototype.success = function(message) {
  this.showMessage(message, cwc.ui.MessageType.SUCCESS);
};


/**
 * @param {!string} message Shows error message.
 */
cwc.ui.Message.prototype.error = function(message) {
  this.showMessage(message, cwc.ui.MessageType.ERROR);
};


/**
 * @param {!string} message Shows warning message.
 */
cwc.ui.Message.prototype.warning = function(message) {
  this.showMessage(message, cwc.ui.MessageType.WARNING);
};


/**
 * Renders content and shows defined message window.
 * @param {string} message
 * @param {cwc.ui.MessageType=} opt_type
 * @export
 */
cwc.ui.Message.prototype.showMessage = function(message, opt_type) {
  var type = opt_type || cwc.ui.MessageType.INFO;
  var prefix = '[' + type + ' message]';

  switch (type) {
    case cwc.ui.MessageType.INFO:
    case cwc.ui.MessageType.SUCCESS:
      console.info(prefix, message);
      goog.Timer.callOnce(this.autoHide.bind(this),  5000);
      break;
    case cwc.ui.MessageType.WARNING:
      console.warn(prefix, message);
      break;
    case cwc.ui.MessageType.ERROR:
      console.error(prefix, message);
      break;
    default:
      console.log(prefix, message);
  }

  if (this.nodeBody && this.nodeText) {
    goog.dom.classes.set(this.nodeBody, this.prefix + 'type-' + type);
    goog.dom.setTextContent(this.nodeText, message);
    this.messageType = type;
    this.show();
  }
};


/**
 * @param {Event} event
 */
cwc.ui.Message.prototype.dismiss = function(event) {
  var eventTarget = event.target;
  if (goog.dom.classlist.contains(eventTarget, 'fava-style-link')) {
    this.hide();
  }
};


/**
 * Shows the message window.
 */
cwc.ui.Message.prototype.show = function() {
  goog.style.setElementShown(this.node, true);
  goog.style.setStyle(this.node, 'width', '100%');
  goog.style.setStyle(this.nodeBody, 'width', '100%');
};


/**
 * Auto hides the message window.
 */
cwc.ui.Message.prototype.autoHide = function() {
  if (this.messageType == cwc.ui.MessageType.INFO ||
      this.messageType == cwc.ui.MessageType.SUCCESS) {
    this.hide();
  }
};


/**
 * Hides the message window.
 */
cwc.ui.Message.prototype.hide = function() {
  goog.style.setElementShown(this.node, false);
  goog.style.setStyle(this.node, 'width', '1px');
  goog.style.setStyle(this.nodeBody, 'width', '1px');
};
