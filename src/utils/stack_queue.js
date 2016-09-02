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
  DELAY: 'delay'
};



/**
 * @constructor
 * @param {!cwc.utils.StackType} type
 * @param {Function=} opt_func
 * @param {string|number=} opt_value
 * @param {string=} opt_name
 * @final
 */
cwc.utils.StackEntry = function(type, opt_func, opt_value, opt_name) {
  /** @private {cwc.utils.StackType} */
  this.type_ = type;

  /** @private {Function|undefined} */
  this.func_ = opt_func;

  /** @private {string|number} */
  this.value_ = opt_value || '';

  /** @private {string} */
  this.name_ = opt_name || '';
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
 * @param {number=} opt_no_autostart
 */
cwc.utils.StackQueue = function(opt_no_autostart) {

  /** @private {boolean} */
  this.autopause_ = false;

  /** @private {Object} */
  this.stack_ = {};

  /** @type {number|string} */
  this.default_group = 'default';

  /** @type {boolean} */
  this.autoStart = opt_no_autostart == true ? false : true;

  /** @type {boolean} */
  this.active = false;

  /** @type {boolean} */
  this.run = false;

};


/**
 * Add command to the stack queue.
 * @param {!Function} command
 * @param {number|string=} opt_group
 * @export
 */
cwc.utils.StackQueue.prototype.addCommand = function(command, opt_group) {
  this.addStack_(new cwc.utils.StackEntry(cwc.utils.StackType.CMD, command),
    opt_group);
};


/**
 * Pause the stack queue for the given delay.
 * @param {number} delay in ms
 * @param {number|string=} opt_group
 * @export
 */
cwc.utils.StackQueue.prototype.addDelay = function(delay, opt_group) {
  this.addStack_(new cwc.utils.StackEntry(
    cwc.utils.StackType.DELAY, null, delay), opt_group);
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
    this.run = false;
    this.active = true;
    this.handleQueue_();
  }
};


/**
 * Stops the stack queue timer.
 * @export
 */
cwc.utils.StackQueue.prototype.stop = function() {
  if (this.active) {
    this.run = false;
    this.active = false;
  }
};


/**
 * Gets the next entry of the stack queue.
 * @param {number|string=} opt_group
 * @return {?cwc.utils.StackEntry}
 * @export
 */
cwc.utils.StackQueue.prototype.getNext = function(opt_group) {
  var group = opt_group || this.default_group;
  if (this.stack_[group] && this.stack_[group].length > 0) {
    return this.stack_[group].shift();
  }
  return null;
};


/**
 * Returns the next valid command.
 * @param {number|string=} opt_group
 * @return {Function|undefined}
 * @export
 */
cwc.utils.StackQueue.prototype.getNextCommand = function(opt_group) {
  var stackItem = null;
  while ((stackItem = this.getNext(opt_group))) {
    if (stackItem.getType() == cwc.utils.StackType.CMD) {
      return stackItem.getFunc();
    }
  }
  return null;
};


/**
 * Adds the entry to the stack queue.
 * @param {cwc.utils.StackEntry} stack_entry
 * @param {number|string=} opt_group
 * @private
 */
cwc.utils.StackQueue.prototype.addStack_ = function(stack_entry, opt_group) {
  var group = opt_group || this.default_group;
  if (!(group in this.stack_)) {
    this.stack_[group] = [];
  }
  this.stack_[group].push(stack_entry);
  if (this.autoStart) {
    this.start();
  }
};


/**
 * Handles the stack queue ticks.
 * @param {Event=} opt_event
 * @private
 */
cwc.utils.StackQueue.prototype.handleQueue_ = function(opt_event) {
  if (!this.active || this.run) {
    return;
  }

  if (!(this.default_group in this.stack_) ||
      this.stack_[this.default_group].length <= 0) {
    this.active = false;
    return;
  }

  var task = this.stack_[this.default_group].shift();
  var type = task.getType();
  var value = task.getValue();
  switch (type) {
    case cwc.utils.StackType.CMD:
      var func = task.getFunc();
      if (func && typeof func === 'function') {
        this.run = true;
        func(value);
        this.run = false;
        this.handleQueue_();
      }
      break;
    case cwc.utils.StackType.DELAY:
      this.run = true;
      window.setTimeout(function() {
        this.run = false;
        this.handleQueue_();
      }.bind(this), value);
      break;
    default:
      console.error('Unknown Stack Type', type);
  }
};
