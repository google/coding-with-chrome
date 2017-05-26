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
 * @final
 */
cwc.utils.Logger = function(name = 'Logger',
    logLevel = cwc.utils.LogLevel.NOTICE) {
  /** @type {!string} */
  this.name = name;

  /** @type {!Array} */
  this.displayName = this.name ? ['%c' + this.name, 'font-weight: bold;'] : [];

  /** @type {!number} */
  this.logLevel = typeof cwc.config !== 'undefined' ?
    Number(cwc.config.Logging.LEVEL) : logLevel;

  /** @type {!boolean} */
  this.enabled_ = ENABLE_LOGGING;

  /** Disable logging styles for specific environments */
  if ((window.mocha || window.jasmine) && this.name) {
    this.displayName = ['[' + this.name + ']'];
  }
};


/**
 * Trace logger.
 * @param {...*} args
 */
cwc.utils.Logger.prototype.trace = function(...args) {
  if (this.enabled_ && this.logLevel >= cwc.utils.LogLevel.TRACE) {
    Function.prototype.apply.apply(
      console.log, [console, this.displayName.concat(args)]);
  }
};


/**
 * Debug logger.
 * @param {...*} args
 */
cwc.utils.Logger.prototype.debug = function(...args) {
  if (this.enabled_ && this.logLevel >= cwc.utils.LogLevel.DEBUG) {
    Function.prototype.apply.apply(
      console.log, [console, this.displayName.concat(args)]);
  }
};


/**
 * Info logger.
 * @param {...*} args
 */
cwc.utils.Logger.prototype.info = function(...args) {
  if (this.enabled_ && this.logLevel >= cwc.utils.LogLevel.INFO) {
    Function.prototype.apply.apply(
      console.log, [console, this.displayName.concat(args)]);
  }
};


/**
 * Notice logger.
 * @param {...*} args
 */
cwc.utils.Logger.prototype.notice = function(...args) {
  if (this.enabled_ && this.logLevel >= cwc.utils.LogLevel.NOTICE) {
    Function.prototype.apply.apply(
      console.log, [console, this.displayName.concat(args)]);
  }
};


/**
 * Warn logger.
 * @param {...*} args
 */
cwc.utils.Logger.prototype.warn = function(...args) {
  if (this.enabled_ && this.logLevel >= cwc.utils.LogLevel.WARNING) {
    Function.prototype.apply.apply(
      console.warn, [console, this.displayName.concat(args)]);
  }
};


/**
 * Error logger.
 * @param {...*} args
 */
cwc.utils.Logger.prototype.error = function(...args) {
  if (this.enabled_ && this.logLevel >= cwc.utils.LogLevel.ERROR) {
    Function.prototype.apply.apply(
      console.error, [console, this.displayName.concat(args)]);
  }
};


/**
 * Critical logger.
 * @param {...*} args
 */
cwc.utils.Logger.prototype.critical = function(...args) {
  if (this.enabled_ && this.logLevel >= cwc.utils.LogLevel.CRITICAL) {
    Function.prototype.apply.apply(
      console.error, [console, this.displayName.concat(args)]);
  }
};


/**
 * Alert logger.
 * @param {...*} args
 */
cwc.utils.Logger.prototype.alert = function(...args) {
  if (this.enabled_ && this.logLevel >= cwc.utils.LogLevel.ALERT) {
    Function.prototype.apply.apply(
      console.error, [console, this.displayName.concat(args)]);
  }
};
