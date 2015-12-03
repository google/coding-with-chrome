/**
 * @fileoverview Editor for the Coding with Chrome editor.
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

goog.provide('cwc.ui.PreviewInfobar');
goog.provide('cwc.ui.PreviewInfobarLevel');

goog.require('cwc.soy.PreviewInfobar');
goog.require('cwc.utils.Helper');

goog.require('goog.debug.DivConsole');
goog.require('goog.debug.HtmlFormatter');
goog.require('goog.debug.Logger');
goog.require('goog.debug.Logger.Level');
goog.require('goog.dom');
goog.require('goog.style');


/**
 * @const
 */
cwc.ui.PreviewInfobarLevel = {
  DEBUG: -1,
  INFO: 0,
  WARN: 1,
  ERROR: 2
};



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @param {!string} prefix
 * @struct
 */
cwc.ui.PreviewInfobar = function(helper, prefix) {
  /** @type {Element} */
  this.node = null;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = prefix;

  /** @type {string} */
  this.generalPrefix = this.helper.getPrefix();

  /** @type {goog.debug.DivConsole} */
  this.logConsole = null;

  /** @type {goog.debug.HtmlFormatter} */
  this.logFormatter = new goog.debug.HtmlFormatter();

  /** @type {Element} */
  this.nodeConsole = null;

  /** @type {Element} */
  this.nodeDebugNum = null;

  /** @type {Element} */
  this.nodeErrorNum = null;

  /** @type {Element} */
  this.nodeInfoNum = null;

  /** @type {Element} */
  this.nodeInfoMsg = null;

  /** @type {Element} */
  this.nodeMessages = null;

  /** @type {Element} */
  this.nodeWarnNum = null;

  /** @type {Element} */
  this.nodeStatusText = null;

  /** @type {number} */
  this.debugNum = 0;

  /** @type {number} */
  this.infoNum = 0;

  /** @type {number} */
  this.warnNum = 0;

  /** @type {number} */
  this.errorNum = 0;
};


/**
 * @param {Element} node
 */
cwc.ui.PreviewInfobar.prototype.decorate = function(node) {
  this.node = node;

  goog.style.installStyles(
      cwc.soy.PreviewInfobar.style({ 'prefix': this.prefix })
  );

  goog.soy.renderElement(
      this.node,
      cwc.soy.PreviewInfobar.template,
      { 'prefix': this.prefix }
  );

  this.nodeMessages = goog.dom.getElement(this.prefix + 'infobar-message');
  this.nodeStatusText = goog.dom.getElement(this.prefix + 'info-status');
  this.nodeConsole = goog.dom.getElement(this.prefix + 'info-console');
  this.nodeInfoMsg = goog.dom.getElement(this.prefix + 'info-messages');
  this.nodeDebugNum = goog.dom.getElement(this.prefix + 'info-debug-num');
  this.nodeInfoNum = goog.dom.getElement(this.prefix + 'info-info-num');
  this.nodeWarnNum = goog.dom.getElement(this.prefix + 'info-warn-num');
  this.nodeErrorNum = goog.dom.getElement(this.prefix + 'info-error-num');
  this.nodeStatusText = goog.dom.getElement(this.prefix + 'info-status-text');

  this.logConsole = new goog.debug.DivConsole(this.nodeConsole);
  this.logConsole.setFormatter(this.logFormatter);
  this.logConsole.setCapturing(false);
  this.logFormatter.showAbsoluteTime = false;

  goog.events.listen(this.nodeInfoMsg, goog.events.EventType.CLICK,
      this.toggleConsole, false, this);

  this.updateOverview();
};


/**
 * Shows / hides the console.
 */
cwc.ui.PreviewInfobar.prototype.toggleConsole = function() {
  if (this.nodeConsole) {
    var consoleStatus = goog.style.isElementShown(this.nodeConsole);
    goog.style.setElementShown(this.nodeConsole, !consoleStatus);
  }
};


/**
 * Shows the console.
 */
cwc.ui.PreviewInfobar.prototype.showConsole = function() {
  if (this.nodeConsole) {
    goog.style.setElementShown(this.nodeConsole, true);
  }
};


/**
 * Hides the console.
 */
cwc.ui.PreviewInfobar.prototype.hideConsole = function() {
  if (this.nodeConsole) {
    goog.style.setElementShown(this.nodeConsole, false);
  }
};


/**
 * Clears the console.
 */
cwc.ui.PreviewInfobar.prototype.clear = function() {
  this.debugNum = 0;
  this.infoNum = 0;
  this.warnNum = 0;
  this.errorNum = 0;

  if (this.logConsole) {
    this.logConsole.clear();
  }

  if (this.logFormatter) {
    this.logFormatter.resetRelativeTimeStart();
  }

  this.updateOverview();
};


/**
 * @param {string} status
 */
cwc.ui.PreviewInfobar.prototype.setStatusText = function(status) {
  if (this.nodeStatusText) {
    goog.dom.setTextContent(this.nodeStatusText, status);
  }
};


/**
 * Updates the status overview.
 */
cwc.ui.PreviewInfobar.prototype.updateOverview = function() {
  if (this.nodeDebugNum) {
    goog.dom.setTextContent(this.nodeDebugNum, this.debugNum || '');
  }

  if (this.nodeInfoNum) {
    goog.dom.setTextContent(this.nodeInfoNum, this.infoNum || '');
  }

  if (this.nodeWarnNum) {
    goog.dom.setTextContent(this.nodeWarnNum, this.warnNum || '');
  }

  if (this.nodeErrorNum) {
    goog.dom.setTextContent(this.nodeErrorNum, this.errorNum || '');
  }

  if ((this.warnNum || this.errorNum || this.infoNum)) {
    this.showConsole();
  } else if ((this.debugNum + this.infoNum + this.warnNum +
      this.errorNum) == 0) {
    this.hideConsole();
  }
};


/**
 * @param {Event} event
 */
cwc.ui.PreviewInfobar.prototype.addMessage = function(event) {
  var level = event.level;
  var message = event.message || '';
  var line = event.line || null;
  var logLevel = goog.debug.Logger.Level.getPredefinedLevel('ALL');
  var logLevelName = 'Unknown';

  if (level == cwc.ui.PreviewInfobarLevel.DEBUG) {
    this.debugNum = (this.debugNum || 0) + 1;
    logLevel = goog.debug.Logger.Level.getPredefinedLevel('FINE');
    logLevelName = 'Debug';
  } else if (level == cwc.ui.PreviewInfobarLevel.INFO) {
    this.infoNum = (this.infoNum || 0) + 1;
    logLevel = goog.debug.Logger.Level.getPredefinedLevel('INFO');
    logLevelName = 'Info';
  } else if (level == cwc.ui.PreviewInfobarLevel.WARN) {
    this.warnNum = (this.warnNum || 0) + 1;
    logLevel = goog.debug.Logger.Level.getPredefinedLevel('WARNING');
    logLevelName = 'Warn';
  } else if (level == cwc.ui.PreviewInfobarLevel.ERROR) {
    this.errorNum = (this.errorNum || 0) + 1;
    logLevel = goog.debug.Logger.Level.getPredefinedLevel('SEVERE');
    logLevelName = 'Error';
  }

  this.addLogRecord(logLevel, message, logLevelName);
  this.updateOverview();
};


/**
 * Adds a new log entry to the log record.
 * @param {goog.debug.Logger.Level} level
 * @param {string} msg
 * @param {string} logger_name
 * @param {number=} opt_time
 * @param {number=} opt_sequence_number
 */
cwc.ui.PreviewInfobar.prototype.addLogRecord = function(level, msg,
    logger_name, opt_time, opt_sequence_number) {
  if (!this.logConsole) {
    return;
  }

  var logEntry = new goog.debug.LogRecord(level, msg, logger_name,
      opt_time, opt_sequence_number);
  this.logConsole.addLogRecord(logEntry);
};
