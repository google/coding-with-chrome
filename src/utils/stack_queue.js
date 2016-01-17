/**
 * @fileoverview Basic general stack queue.
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
goog.provide('cwc.uitls.StackType');
goog.provide('cwc.utils.StackEntry');
goog.provide('cwc.utils.StackQueue');

goog.require('goog.Timer');


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
 * @param {!Function} func
 * @param {string|number=} opt_value
 * @param {string=} opt_name
 * @final
 */
cwc.utils.StackEntry = function(type, func, opt_value, opt_name) {
  /** @private {cwc.utils.StackType} */
  this.type_ = type;

  /** @private {Function} */
  this.func_ = func;

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
 * @return {Function}
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
 * @param {number=} opt_update_time
 */
cwc.utils.StackQueue = function(opt_update_time) {
  /** @private {boolean} */
  this.autopause_ = false;

  /** @private {Object} */
  this.stack_ = {};

  /** @private {goog.Timer} */
  this.timer_ = null;

  /** @private {number} */
  this.timerInterval_ = opt_update_time || 50;

  /** @type {number|string} */
  this.default_group = 'default';

  /** @type {boolean} */
  this.run = false;
};


/**
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
  if (this.timer_ && this.autopause_ && !opt_group) {
    this.startTimer();
    this.autopause_=false;
  }
};


/**
 * @param {!Function} command
 * @param {number|string=} opt_group
 * @export
 */
cwc.utils.StackQueue.prototype.addCommand = function(command, opt_group) {
  this.addStack_(new cwc.utils.StackEntry(cwc.utils.StackType.CMD, command),
    opt_group);
};


/**
 * @param {number} delay
 * @param {number|string=} opt_group
 * @export
 */
cwc.utils.StackQueue.prototype.addDelay = function(delay, opt_group) {
  this.addStack_(new cwc.utils.StackEntry(
    cwc.utils.StackType.DELAY, null, delay), opt_group);
};


/**
 * Clears the default Stack with queued commands.
 */
cwc.utils.StackQueue.prototype.clear = function() {
  this.stack_[this.default_group] = [];
};


/**
 * Sets and initializes the stack queue timer.
 * @param {number=} opt_interval
 * @export
 */
cwc.utils.StackQueue.prototype.setTimer = function(opt_interval) {
  this.timer_ = new goog.Timer(opt_interval || this.timerInterval_);
  goog.events.listen(this.timer_, goog.Timer.TICK,
      this.handleQueueEvent.bind(this));
};


/**
 * Starts the stack queue timer.
 * @export
 */
cwc.utils.StackQueue.prototype.startTimer = function() {
  if (!this.timer_) {
    this.setTimer();
  }
  this.timer_.start();
  this.run = false;
};


/**
 * Stops the stack queue timer.
 * @export
 */
cwc.utils.StackQueue.prototype.stopTimer = function() {
  if (this.timer_) {
    this.timer_.stop();
    this.run = false;
  }
};


/**
 * @param {Event=} opt_event
 */
cwc.utils.StackQueue.prototype.handleQueueEvent = function(opt_event) {
  if (!(this.default_group in this.stack_)) {
    return;
  }

  if (this.run) {
    return;
  }

  if (this.stack_[this.default_group].length <= 0) {
    this.stopTimer();
    this.autopause_ = true;
    return;
  }

  var task = this.stack_[this.default_group].shift();
  var type = task.getType();
  var value = task.getValue();
  switch (type) {
    case cwc.utils.StackType.CMD:
      var func = task.getFunc();
      this.run = true;
      if (goog.isFunction(func)) {
        func(value);
      }
      this.run = false;
      break;
    case cwc.utils.StackType.DELAY:
      this.stopTimer();
      var delayEvent = this.startTimer.bind(this);
      this.delayTimer = goog.Timer.callOnce(delayEvent, value);
      break;
    default:
      console.error('Unknow Stack Type', type);
  }
};


/**
 * @param {number|string=} opt_group
 * @return {?cwc.utils.StackEntry}
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
 * @return {?Function}
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
