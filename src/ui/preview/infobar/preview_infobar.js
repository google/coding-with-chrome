/**
 * @fileoverview Editor for the Coding with Chrome editor.
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

goog.provide('cwc.ui.PreviewInfobar');
goog.provide('cwc.ui.PreviewInfobarLevel');

goog.require('cwc.soy.ui.PreviewInfobar');
goog.require('cwc.utils.Helper');

goog.require('goog.debug.DivConsole');
goog.require('goog.debug.HtmlFormatter');
goog.require('goog.debug.LogRecord');
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
  ERROR: 2,
};


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 */
cwc.ui.PreviewInfobar = function(helper) {
  /** @type {Element} */
  this.node = null;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('preview-infobar');

  /** @type {goog.debug.DivConsole} */
  this.logConsole = null;

  /** @type {goog.debug.HtmlFormatter} */
  this.logFormatter = new goog.debug.HtmlFormatter();

  /** @type {Element} */
  this.nodeConsole = null;

  /** @type {Element} */
  this.nodeDebug = null;

  /** @type {Element} */
  this.nodeDebugNum = null;

  /** @type {Element} */
  this.nodeError= null;

  /** @type {Element} */
  this.nodeErrorNum = null;

  /** @type {Element} */
  this.nodeInfo = null;

  /** @type {Element} */
  this.nodeInfoNum = null;

  /** @type {Element} */
  this.nodeWarn = null;

  /** @type {Element} */
  this.nodeWarnNum = null;

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

  goog.soy.renderElement(
      this.node,
      cwc.soy.ui.PreviewInfobar.template, {
        'prefix': this.prefix,
      }
  );

  this.nodeConsole = goog.dom.getElement(this.prefix + 'console');
  this.nodeDebug = goog.dom.getElement(this.prefix + 'debug');
  this.nodeDebugNum = goog.dom.getElement(this.prefix + 'debug-num');
  this.nodeError = goog.dom.getElement(this.prefix + 'error');
  this.nodeErrorNum = goog.dom.getElement(this.prefix + 'error-num');
  this.nodeInfo = goog.dom.getElement(this.prefix + 'info');
  this.nodeInfoNum = goog.dom.getElement(this.prefix + 'info-num');
  this.nodeWarn = goog.dom.getElement(this.prefix + 'warn');
  this.nodeWarnNum = goog.dom.getElement(this.prefix + 'warn-num');

  this.logConsole = new goog.debug.DivConsole(this.nodeConsole);
  this.logConsole.setFormatter(this.logFormatter);
  this.logConsole.setCapturing(false);
  this.logFormatter.showAbsoluteTime = false;

  goog.events.listen(this.nodeDebug, goog.events.EventType.CLICK, function() {
    if (this.debugNum > 0) {
      this.toggleConsole();
    }
  }, false, this);

  goog.events.listen(this.nodeError, goog.events.EventType.CLICK, function() {
    if (this.errorNum > 0) {
      this.toggleConsole();
    }
  }, false, this);

  goog.events.listen(this.nodeInfo, goog.events.EventType.CLICK, function() {
    if (this.infoNum > 0) {
      this.toggleConsole();
    }
  }, false, this);

  goog.events.listen(this.nodeWarn, goog.events.EventType.CLICK, function() {
    if (this.warnNum > 0) {
      this.toggleConsole();
    }
  }, false, this);

  this.updateOverview();
};


/**
 * Shows / hides the console.
 */
cwc.ui.PreviewInfobar.prototype.toggleConsole = function() {
  if (this.nodeConsole) {
    let consoleStatus = goog.style.isElementShown(this.nodeConsole);
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

  if (this.warnNum || this.errorNum || this.infoNum > 1) {
    this.showConsole();
  } else {
    this.hideConsole();
  }
};


/**
 * @param {Object} event
 */
cwc.ui.PreviewInfobar.prototype.addMessage = function(event) {
  let level = event.level;
  let message = event.message || '';
  let logLevel = goog.debug.Logger.Level.getPredefinedLevel('ALL');
  let logLevelName = 'Unknown';

  if (level == cwc.ui.PreviewInfobarLevel.DEBUG) {
    this.debugNum = (this.debugNum || 0) + 1;
    logLevel = goog.debug.Logger.Level.getPredefinedLevel('FINE');
    logLevelName = 'Debug';
    message = goog.debug.expose(event);
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

  let logEntry = new goog.debug.LogRecord(level, msg, logger_name,
      opt_time, opt_sequence_number);
  this.logConsole.addLogRecord(logEntry);
};
