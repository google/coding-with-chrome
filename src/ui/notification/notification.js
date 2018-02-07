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
goog.provide('cwc.ui.Notification');
goog.provide('cwc.ui.NotificationType');

goog.require('cwc.soy.ui.Notification');
goog.require('cwc.utils.Logger');

goog.require('goog.Timer');
goog.require('goog.dom.classlist');
goog.require('goog.soy');


/**
 * @enum {string}
 */
cwc.ui.NotificationType = {
  CONFIRM: 'confirm',
  DEBUG: 'debug',
  ERROR: 'error',
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
};


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.Notification = function(helper) {
  /** @type {string} */
  this.name = 'Notification';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('notification');

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.snackbar = null;

  /** @type {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * Decorates the given node and adds a ui messenger.
 * @param {Element} node The target node to add the ui messenger.
 */
cwc.ui.Notification.prototype.decorate = function(node) {
  this.node = node;

  goog.soy.renderElement(
      this.node,
      cwc.soy.ui.Notification.template,
      {'prefix': this.prefix}
  );

  this.snackbar = goog.dom.getElement(this.prefix + 'snackbar');
};


/**
 * @param {!string} message Shows info message.
 */
cwc.ui.Notification.prototype.info = function(message) {
  this.showMessage(message, cwc.ui.NotificationType.INFO);
};


/**
 * @param {!string} message Shows promotion message.
 */
cwc.ui.Notification.prototype.success = function(message) {
  this.showMessage(message, cwc.ui.NotificationType.SUCCESS);
};


/**
 * @param {!string} message Shows error message.
 */
cwc.ui.Notification.prototype.error = function(message) {
  this.showMessage(message, cwc.ui.NotificationType.ERROR);
};


/**
 * @param {!string} message Shows warning message.
 */
cwc.ui.Notification.prototype.warning = function(message) {
  this.showMessage(message, cwc.ui.NotificationType.WARNING);
};


/**
 * Renders content and shows defined message window.
 * @param {string} message
 * @param {cwc.ui.NotificationType=} optType
 */
cwc.ui.Notification.prototype.showMessage = function(message, optType) {
  let type = optType || cwc.ui.NotificationType.INFO;
  let prefix = '[' + type + ' notification]';

  // Console logging
  switch (type) {
    case cwc.ui.NotificationType.INFO:
    case cwc.ui.NotificationType.SUCCESS:
      this.log_.notice(prefix, message);
      break;
    case cwc.ui.NotificationType.WARNING:
      this.log_.warn(prefix, message);
      break;
    case cwc.ui.NotificationType.ERROR:
      this.log_.error(prefix, message);
      break;
    default:
      this.log_.info(prefix, message);
  }

  // Visual output
  if (this.snackbar) {
    this.showSnackbarMessage(message, optType);
  }
};


/**
 * Renders content and shows defined message snackbar.
 * @param {string} message
 * @param {cwc.ui.NotificationType=} optType
 */
cwc.ui.Notification.prototype.showSnackbarMessage = function(message, optType) {
  let snackbarData = {
    message: message,
    timeout: null,
  };

  switch (optType || cwc.ui.NotificationType.INFO) {
    case cwc.ui.NotificationType.INFO:
    case cwc.ui.NotificationType.SUCCESS:
      snackbarData['timeout'] = 3000;
      break;
    case cwc.ui.NotificationType.ERROR:
    case cwc.ui.NotificationType.WARNING:
      snackbarData['actionHandler'] = this.close.bind(this);
      snackbarData['actionText'] = 'Dismiss';
      snackbarData['timeout'] = 30000;
      break;
  }
  goog.dom.classlist.add(this.snackbar, 'mdl-snackbar--active');
  this.snackbar['MaterialSnackbar']['showSnackbar'](snackbarData);
};


cwc.ui.Notification.prototype.close = function() {
  if (this.snackbar) {
    goog.dom.classlist.remove(this.snackbar, 'mdl-snackbar--active');
  }
};
