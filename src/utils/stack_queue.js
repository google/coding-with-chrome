/**
 * @fileoverview Basic general stack queue.
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
goog.provide('cwc.utils.StackEntry');
goog.provide('cwc.utils.StackQueue');
goog.provide('cwc.utils.StackType');


/**
 * @enum {!string}
 */
cwc.utils.StackType = {
  CMD: 'cmd',
  DELAY: 'delay',
};


/**
 * @constructor
 * @param {!cwc.utils.StackType} type
 * @param {Function=} func
 * @param {string|number=} value
 * @param {string=} name
 * @final
 */
cwc.utils.StackEntry = function(type, func = undefined, value = '', name = '') {
  /** @private {!cwc.utils.StackType} */
  this.type_ = type;

  /** @private {Function|undefined} */
  this.func_ = func;

  /** @private {string|number} */
  this.value_ = value;

  /** @private {string} */
  this.name_ = name;
};


/**
 * @return {cwc.utils.StackType}
 * @export
 */
cwc.utils.StackEntry.prototype.getType = function() {
  return this.type_;
};


/**
 * @return {Function|undefined}
 * @export
 */
cwc.utils.StackEntry.prototype.getFunc = function() {
  return this.func_;
};


/**
 * @return {string|number}
 * @export
 */
cwc.utils.StackEntry.prototype.getValue = function() {
  return this.value_;
};


/**
 * @return {string}
 * @export
 */
cwc.utils.StackEntry.prototype.getName = function() {
  return this.name_;
};


/**
 * @constructor
 * @param {boolean=} autostart
 */
cwc.utils.StackQueue = function(autostart = true) {
  /** @private {boolean} */
  this.autopause_ = false;

  /** @private {Object} */
  this.stack_ = {};

  /** @type {number|string} */
  this.default_group = 'default';

  /** @type {boolean} */
  this.autoStart = autostart;

  /** @type {boolean} */
  this.active = false;

  /** @type {boolean} */
  this.run = false;
};


/**
 * Add command to the stack queue.
 * @param {!Function} command
 * @param {number|string=} optGroup
 * @export
 */
cwc.utils.StackQueue.prototype.addCommand = function(command, optGroup) {
  this.addStack_(new cwc.utils.StackEntry(cwc.utils.StackType.CMD, command),
    optGroup);
};


/**
 * Pause the stack queue for the given delay.
 * @param {number} delay in ms
 * @param {number|string=} optGroup
 * @export
 */
cwc.utils.StackQueue.prototype.addDelay = function(delay, optGroup) {
  this.addStack_(new cwc.utils.StackEntry(
    cwc.utils.StackType.DELAY, null, delay), optGroup);
};


/**
 * Clears the default Stack with queued commands.
 * @export
 */
cwc.utils.StackQueue.prototype.clear = function() {
  this.stack_[this.default_group] = [];
};


/**
 * Sets and initializes the stack queue timer.
 * @param {number=} interval
 * @export
 */
cwc.utils.StackQueue.prototype.setTimerInterval = function(interval) {
  this.timerInterval_ = interval;
};


/**
 * Starts the stack queue timer.
 * @export
 */
cwc.utils.StackQueue.prototype.start = function() {
  if (!this.active) {
    this.active = true;
    this.autoStart = true;
    this.run = false;
    this.handleQueue_();
  }
};


/**
 * Stops the stack queue timer.
 * @param {Function=} callback
 * @export
 */
cwc.utils.StackQueue.prototype.stop = function(callback) {
  if (this.active) {
    this.active = false;
    this.autoStart = false;
    this.run = false;
    if (callback && typeof callback === 'function') {
      callback();
    }
  }
};


/**
 * Gets the next entry of the stack queue.
 * @param {number|string=} group
 * @return {?cwc.utils.StackEntry}
 * @export
 */
cwc.utils.StackQueue.prototype.getNext = function(group = this.default_group) {
  if (this.stack_[group] && this.stack_[group].length > 0) {
    return this.stack_[group].shift();
  }
  return null;
};


/**
 * Returns the next valid command.
 * @param {number|string=} optGroup
 * @return {Function|undefined}
 * @export
 */
cwc.utils.StackQueue.prototype.getNextCommand = function(optGroup) {
  let stackItem = null;
  while ((stackItem = this.getNext(optGroup))) {
    if (stackItem.getType() == cwc.utils.StackType.CMD) {
      return stackItem.getFunc();
    }
  }
  return null;
};


/**
 * Adds the entry to the stack queue.
 * @param {cwc.utils.StackEntry} stackEntry
 * @param {number|string=} group
 * @private
 */
cwc.utils.StackQueue.prototype.addStack_ = function(stackEntry,
    group = this.default_group) {
  if (!(group in this.stack_)) {
    this.stack_[group] = [];
  }
  this.stack_[group].push(stackEntry);
  if (this.autoStart) {
    this.start();
  }
};


/**
 * Handles the stack queue ticks.
 * @private
 */
cwc.utils.StackQueue.prototype.handleQueue_ = function() {
  if (!this.active || this.run) {
    return;
  }

  if (!(this.default_group in this.stack_) ||
      this.stack_[this.default_group].length <= 0) {
    this.active = false;
    return;
  }

  let task = this.stack_[this.default_group].shift();
  let type = task.getType();
  let value = task.getValue();
  let func = task.getFunc();
  switch (type) {
    case cwc.utils.StackType.CMD:
      if (func && typeof func === 'function') {
        this.run = true;
        func(value);
        this.run = false;
        this.handleQueue_();
      }
      break;
    case cwc.utils.StackType.DELAY:
      this.run = true;
      setTimeout(function() {
        this.run = false;
        this.handleQueue_();
      }.bind(this), value);
      break;
    default:
      console.error('Unknown Stack Type', type);
  }
};
