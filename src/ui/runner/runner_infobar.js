/**
 * @fileoverview Runner infobar for the Coding with Chrome editor.
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
goog.provide('cwc.ui.RunnerInfobar');
goog.provide('cwc.ui.RunnerInfobarLevel');

goog.require('cwc.soy.RunnerInfobar');
goog.require('cwc.utils.Helper');

goog.require('goog.debug.DivConsole');
goog.require('goog.debug.HtmlFormatter');
goog.require('goog.debug.Logger');
goog.require('goog.debug.Logger.Level');
goog.require('goog.dom');


/**
 * @enum {number}
 */
cwc.ui.RunnerInfobarLevel = {
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
cwc.ui.RunnerInfobar = function(helper, prefix) {
  /** @type {Element} */
  this.node = null;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = prefix;

  /** @type {string} */
  this.generalPrefix = this.helper.getPrefix();

  /** @type {goog.debug.Logger.Level} */
  this.logLevel = new goog.debug.Logger.Level('ALL', 99);

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
  this.nodeWarnNum = null;

  /** @type {boolean} */
  this.infoTerminalVisible = true;

  /** @type {boolean} */
  this.infoMsgVisible = true;

  /** @type {number} */
  this.debugNum = 0;

  /** @type {number} */
  this.infoNum = 0;

  /** @type {number} */
  this.warnNum = 0;

  /** @type {number} */
  this.errorNum = 0;

  /** @type {Element|StyleSheet} */
  this.styleSheet = null;
};


/**
 * @param {Element} node
 */
cwc.ui.RunnerInfobar.prototype.decorate = function(node) {
  this.node = node;

  if (!this.styleSheet) {
    this.styleSheet = goog.style.installStyles(
        cwc.soy.RunnerInfobar.style({ 'prefix': this.prefix }));
  }

  goog.soy.renderElement(
      this.node,
      cwc.soy.RunnerInfobar.template,
      { 'prefix': this.prefix }
  );

  this.nodeTerminal = goog.dom.getElement(this.prefix + 'info-terminal');
  this.nodeConsole = goog.dom.getElement(this.prefix + 'info-console');
  this.nodeInfoMsg = goog.dom.getElement(this.prefix + 'info-messages');
  this.nodeDebugNum = goog.dom.getElement(this.prefix + 'info-debug-num');
  this.nodeInfoNum = goog.dom.getElement(this.prefix + 'info-info-num');
  this.nodeWarnNum = goog.dom.getElement(this.prefix + 'info-warn-num');
  this.nodeErrorNum = goog.dom.getElement(this.prefix + 'info-error-num');

  this.logConsole = new goog.debug.DivConsole(this.nodeConsole);
  this.logConsole.setFormatter(this.logFormatter);
  this.logConsole.setCapturing(false);
  this.logFormatter.showAbsoluteTime = false;

  goog.events.listen(this.nodeTerminal, goog.events.EventType.CLICK,
      this.toggleTerminal, false, this);

  goog.events.listen(this.nodeInfoMsg, goog.events.EventType.CLICK,
      this.toggleInfobar, false, this);

  this.updateOverview();
  this.toggleInfobar();
};


/**
 * Shows / hides terminal button.
 * @param {boolean} enable
 */
cwc.ui.RunnerInfobar.prototype.enableTerminal = function(enable) {
  goog.style.setElementShown(this.nodeTerminal, enable);
};


/**
 * Shows / hides the console.
 */
cwc.ui.RunnerInfobar.prototype.toggleTerminal = function() {
  var runnerInstance = this.helper.getInstance('runner');
  if (runnerInstance) {
    this.infoTerminalVisible = !this.infoTerminalVisible;
    runnerInstance.showTerminal(this.infoTerminalVisible);
  }
};


/**
 * Shows / hides the console.
 */
cwc.ui.RunnerInfobar.prototype.toggleInfobar = function() {
  this.infoMsgVisible = !this.infoMsgVisible;
  goog.style.setElementShown(this.nodeConsole, this.infoMsgVisible);
};


/**
 * Clears the console.
 */
cwc.ui.RunnerInfobar.prototype.clear = function() {
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
 * Updates the status overview.
 */
cwc.ui.RunnerInfobar.prototype.updateOverview = function() {
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

  if (this.errorNum && !this.infoMsgVisible) {
    this.toggleInfobar();
  }

};


/**
 * @param {Event} e
 */
cwc.ui.RunnerInfobar.prototype.addMessage = function(e) {
  var level = e.level;
  var message = e.message || '';
  var logLevel = goog.debug.Logger.Level.getPredefinedLevel('ALL');
  var logLevelName = 'Unknown';

  if (level == cwc.ui.RunnerInfobarLevel.DEBUG) {
    this.debugNum = (this.debugNum || 0) + 1;
    logLevel = goog.debug.Logger.Level.getPredefinedLevel('FINE');
    logLevelName = 'Debug';
    message = goog.debug.expose(e);
  } else if (level == cwc.ui.RunnerInfobarLevel.INFO) {
    this.infoNum = (this.infoNum || 0) + 1;
    logLevel = goog.debug.Logger.Level.getPredefinedLevel('INFO');
    logLevelName = 'Info';
  } else if (level == cwc.ui.RunnerInfobarLevel.WARN) {
    this.warnNum = (this.warnNum || 0) + 1;
    logLevel = goog.debug.Logger.Level.getPredefinedLevel('WARNING');
    logLevelName = 'Warn';
  } else if (level == cwc.ui.RunnerInfobarLevel.ERROR) {
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
cwc.ui.RunnerInfobar.prototype.addLogRecord = function(level, msg,
    logger_name, opt_time, opt_sequence_number) {
  if (!this.logConsole) {
    return;
  }

  var logEntry = new goog.debug.LogRecord(level, msg, logger_name,
      opt_time, opt_sequence_number);
  this.logConsole.addLogRecord(logEntry);
};
