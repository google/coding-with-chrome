/**
 * @fileoverview UI Messenger for the Coding with Chrome editor.
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
goog.provide('cwc.ui.Message');
goog.provide('cwc.ui.MessageType');

goog.require('cwc.soy.ui.Message');
goog.require('goog.Timer');
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
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.Message = function(helper) {
  /** @type {string} */
  this.name = 'Message';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('message');

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.snackbar = null;
};


/**
 * Decorates the given node and adds a ui messenger.
 * @param {Element} node The target node to add the ui messenger.
 */
cwc.ui.Message.prototype.decorate = function(node) {
  this.node = node;

  goog.soy.renderElement(
      this.node,
      cwc.soy.ui.Message.template,
      {'prefix': this.prefix}
  );

  this.snackbar = goog.dom.getElement(this.prefix + 'snackbar');
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
  var snackbarData = {
    message: message,
    timeout: null
  };

  // Console logging
  switch (type) {
    case cwc.ui.MessageType.INFO:
    case cwc.ui.MessageType.SUCCESS:
      console.info(prefix, message);
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

  // Visual output
  if (this.snackbar) {
    switch (type) {
      case cwc.ui.MessageType.INFO:
      case cwc.ui.MessageType.SUCCESS:
        snackbarData['timeout'] = 3000;
        break;
      case cwc.ui.MessageType.ERROR:
      case cwc.ui.MessageType.WARNING:
        snackbarData['actionHandler'] = this.close.bind(this);
        snackbarData['actionText'] = 'Dismiss';
        snackbarData['timeout'] = 30000;
        break;
    }
    goog.dom.classlist.add(this.snackbar, 'mdl-snackbar--active');
    this.snackbar['MaterialSnackbar']['showSnackbar'](snackbarData);
  }

};


cwc.ui.Message.prototype.close = function() {
  if (this.snackbar) {
    goog.dom.classlist.remove(this.snackbar, 'mdl-snackbar--active');
  }
};
