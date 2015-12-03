/**
 * @fileoverview Messager for the Coding with Chrome editor.
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
goog.require('goog.dom.classlist');
goog.require('goog.soy');


/**
 * @enum {string}
 */
cwc.ui.MessageType = {
  DEBUG: 'Debug',
  INFO: 'Info',
  ERROR: 'Error',
  PROMOTION: 'Promotion',
  WARNING: 'Warning'
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
  this.nodeWarp = null;

  /** @type {Element} */
  this.nodeContainer = null;
};


/**
 * Decorates the given node and adds a ui messanger.
 * @param {Element} node The target node to add the ui messagner.
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

  this.nodeContainer = goog.dom.getElement(
      this.prefix + 'butterBar-container');
  this.nodeWarp = goog.dom.getElement(this.prefix + 'butterBar-wrap');
  this.hide();
};


/**
 * @param {!string} message Shows info message.
 */
cwc.ui.Message.prototype.info = function(message) {
  this.showMessage_(message, cwc.ui.MessageType.INFO);
  goog.Timer.callOnce(this.hide.bind(this), 5000);
};


/**
 * @param {!string} message Shows error message.
 */
cwc.ui.Message.prototype.error = function(message) {
  this.showMessage_(message, cwc.ui.MessageType.ERROR);
};


/**
 * @param {!string} message Shows promotion message.
 */
cwc.ui.Message.prototype.promo = function(message) {
  this.showMessage_(message, cwc.ui.MessageType.PROMOTION);
};


/**
 * @param {!string} message Shows warning message.
 */
cwc.ui.Message.prototype.warning = function(message) {
  this.showMessage_(message, cwc.ui.MessageType.WARNING);
};


/**
 * Renders content and shows defined butter bar.
 * @param {string} message
 * @param {cwc.ui.MessageType=} opt_type
 * @private
 */
cwc.ui.Message.prototype.showMessage_ = function(message, opt_type) {
  var type = opt_type || cwc.ui.MessageType.INFO;
  console.log('[' + opt_type + '] :' + message);
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
 * Shows the butter bar.
 */
cwc.ui.Message.prototype.show = function() {
  goog.style.setElementShown(this.node, true);
  goog.style.setStyle(this.node, 'width', '100%');
  goog.style.setStyle(this.nodeContainer, 'width', '100%');
};


/**
 * Hides the butter bar.
 */
cwc.ui.Message.prototype.hide = function() {
  goog.Timer.callOnce(function() {
    goog.style.setElementShown(this.node, false);
    goog.style.setStyle(this.node, 'width', '1px');
    goog.style.setStyle(this.nodeContainer, 'width', '1px');
  }.bind(this), 1000);
};


/**
 * Base container for all messages.
 * @param {string} message Message to display
 * @return {Element}
 */
cwc.ui.Message.prototype.buildContent = function(message) {
  var content = goog.dom.createDom('span', undefined, message + '\u00A0');
  var hideLink = goog.dom.createDom('span', 'fava-style-link', 'Dismiss');
  content.appendChild(hideLink);
  return content;
};
