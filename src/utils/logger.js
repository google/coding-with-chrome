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


/**
 * Log levels:
 * 0 (AUTO)      Automatic handling
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
  AUTO: 0,
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
 * @constructor
 * @param {number=} logLevel
 * @param {string=} optName
 * @final
 */
cwc.utils.Logger = function(logLevel = cwc.utils.LogLevel.NOTICE, optName) {
  /** @type {!number} */
  this.logLevel = logLevel;

  /** @type {!string} */
  this.name = optName || '';

  /** @private {Object} */
  this.cache_ = {};
};


/**
 * Trace logger.
 * @param {...*} args
 */
cwc.utils.Logger.prototype.trace = function(...args) {
  if (this.logLevel >= cwc.utils.LogLevel.TRACE) {
    Function.prototype.apply.apply(console.log, [console, args]);
  }
};


/**
 * Debug logger.
 * @param {...*} args
 */
cwc.utils.Logger.prototype.debug = function(...args) {
  if (this.logLevel >= cwc.utils.LogLevel.DEBUG) {
    Function.prototype.apply.apply(console.log, [console, args]);
  }
};


/**
 * Info logger.
 * @param {...*} args
 */
cwc.utils.Logger.prototype.info = function(...args) {
  if (this.logLevel >= cwc.utils.LogLevel.INFO) {
    Function.prototype.apply.apply(console.log, [console, args]);
  }
};


/**
 * Notice logger.
 * @param {...*} args
 */
cwc.utils.Logger.prototype.notice = function(...args) {
  if (this.logLevel >= cwc.utils.LogLevel.NOTICE) {
    Function.prototype.apply.apply(console.log, [console, args]);
  }
};


/**
 * Warn logger.
 * @param {...*} args
 */
cwc.utils.Logger.prototype.warn = function(...args) {
  if (this.logLevel >= cwc.utils.LogLevel.WARNING &&
      JSON.stringify(this.cache_.warn) != JSON.stringify(args)) {
    Function.prototype.apply.apply(console.warn, [console, args]);
    this.cache_.warn = args;
  }
};


/**
 * Error logger.
 * @param {...*} args
 */
cwc.utils.Logger.prototype.error = function(...args) {
  if (this.logLevel >= cwc.utils.LogLevel.ERROR &&
      JSON.stringify(this.cache_.error) != JSON.stringify(args)) {
    Function.prototype.apply.apply(console.error, [console, args]);
    this.cache_.error = args;
  }
};


/**
 * Critical logger.
 * @param {...*} args
 */
cwc.utils.Logger.prototype.critical = function(...args) {
  if (this.logLevel >= cwc.utils.LogLevel.CRITICAL) {
    Function.prototype.apply.apply(console.error, [console, args]);
  }
};


/**
 * Alert logger.
 * @param {...*} args
 */
cwc.utils.Logger.prototype.alert = function(...args) {
  if (this.logLevel >= cwc.utils.LogLevel.ALERT) {
    Function.prototype.apply.apply(console.error, [console, args]);
  }
};
