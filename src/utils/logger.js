/**
 * @fileoverview Basic custom Logger.
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
goog.provide('cwc.utils.LogLevel');
goog.provide('cwc.utils.Logger');


/** @define {boolean} */
const ENABLE_LOGGING = true;


/**
 * Log levels:
 * 0 (NONE)      off
 * 1 (ALERT)     action must be taken immediately
 * 2 (CRITICAL)  critical conditions
 * 3 (ERROR)     error conditions
 * 4 (WARNING)   warning conditions
 * 5 (NOTICE)    normal but significant condition
 * 6 (INFO)      informational
 * 7 (DEBUG)     debug-level messages
 * 8 (TRACE)     trace-level messages
 * @enum {number}
 */
cwc.utils.LogLevel = {
  NONE: 0,
  ALERT: 1,
  CRITICAL: 2,
  ERROR: 3,
  WARNING: 4,
  NOTICE: 5,
  INFO: 6,
  DEBUG: 7,
  TRACE: 8,
};


/**
 * @param {string=} name
 * @param {number=} logLevel
 * @constructor
 * @export
 */
cwc.utils.Logger = function(name = 'Logger',
    logLevel = cwc.utils.LogLevel.NOTICE) {
  /** @type {!string} */
  this.name = name;

  /** @type {!string} */
  this.displayName = this.name ? '%c' + this.name : '';

  /** @type {!number} */
  this.logLevel = typeof cwc.config !== 'undefined' ?
    Number(cwc.config.Logging.LEVEL) : logLevel;

  /** @type {!boolean} */
  this.enabled_ = ENABLE_LOGGING;

  /** @type {!Function} */
  this.trace = function() {};

  /** @type {!Function} */
  this.debug = function() {};

  /** @type {!Function} */
  this.info = function() {};

  /** @type {!Function} */
  this.notice = function() {};

  /** @type {!Function} */
  this.warn = function() {};

  /** @type {!Function} */
  this.error = function() {};

  /** @type {!Function} */
  this.critical = function() {};

  /** @type {!Function} */
  this.alert = function() {};

  // Disable logging styles for specific environments like Mocha, Jasmine, ...
  if ((window['mocha'] || window['jasmine'] || window['__karma__']) &&
      this.name) {
    this.displayName = '[' + this.name + ']';
  }

  this.setLogLevel(this.logLevel);
};


/**
 * @param {!cwc.utils.LogLevel} logLevel
 * @export
 */
cwc.utils.Logger.prototype.setLogLevel = function(logLevel) {
  this.logLevel = logLevel;

  // Trace logger
  this.setLogger_('trace', cwc.utils.LogLevel.TRACE, console.log);

  // Debug logger
  this.setLogger_('debug', cwc.utils.LogLevel.DEBUG, console.log);

  // Info logger
  this.setLogger_('info', cwc.utils.LogLevel.INFO, console.log);

  // Notice logger
  this.setLogger_('notice', cwc.utils.LogLevel.NOTICE, console.log);

  // Warn logger
  this.setLogger_('warn', cwc.utils.LogLevel.WARN, console.warn);

  // Error logger
  this.setLogger_('error', cwc.utils.LogLevel.ERROR, console.error);

  // Critical logger
  this.setLogger_('critical', cwc.utils.LogLevel.CRITICAL, console.error);

  // Critical logger
  this.setLogger_('alert', cwc.utils.LogLevel.ALERT, console.error);
};


/**
 * @param {!string} name
 * @param {!cwc.utils.LogLevel} logLevel
 * @param {!Function} logger
 * @private
 */
cwc.utils.Logger.prototype.setLogger_ = function(name, logLevel, logger) {
  // Enable logger for all errors and higher by default.
  if ((this.enabled_ || this.logLevel <= 3) && this.logLevel >= logLevel) {
    this[name] = this.log_(logger);
  } else {
    this[name] = function() {};
  }
};


/**
 * @param {!Function} logger
 * @return {Function}
 * @private
 */
cwc.utils.Logger.prototype.log_ = function(logger) {
  if (this.displayName.includes('%c')) {
    return Function.prototype.bind.call(logger, console, this.displayName,
      'font-weight: bold;');
  } else {
    return Function.prototype.bind.call(logger, console, this.displayName);
  }
};
