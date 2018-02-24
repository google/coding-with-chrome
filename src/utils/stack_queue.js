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
  PROMISE: 'promise',
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
  /** @type {number|string} */
  this.default_group = 'default';

  /** @type {boolean} */
  this.autoStart = autostart;

  /** @type {boolean} */
  this.active = false;

  /** @type {boolean} */
  this.run = false;

  /** @private {Object} */
  this.stack_ = {};
};


/**
 * Add command to the stack queue.
 * @param {!Function} command
 * @param {number|string=} group
 * @export
 */
cwc.utils.StackQueue.prototype.addCommand = function(command, group) {
  if (command && command instanceof Function) {
    this.addStack_(
      new cwc.utils.StackEntry(cwc.utils.StackType.CMD, command), group
    );
  }
};


/**
 * Pause the stack queue for the given delay.
 * @param {number} delay in ms
 * @param {number|string=} group
 * @export
 */
cwc.utils.StackQueue.prototype.addDelay = function(delay, group) {
  this.addStack_(
    new cwc.utils.StackEntry(cwc.utils.StackType.DELAY, null, delay), group
  );
};


/**
 * Add promise command to the stack queue.
 * @param {!Function} command
 * @param {number|string=} group
 * @export
 */
cwc.utils.StackQueue.prototype.addPromise = function(command, group) {
  if (command && command instanceof Function) {
    this.addStack_(
      new cwc.utils.StackEntry(cwc.utils.StackType.PROMISE, command), group
    );
  }
};


/**
 * Clears the default Stack with queued commands.
 * @export
 */
cwc.utils.StackQueue.prototype.clear = function() {
  this.stack_[this.default_group] = [];
  this.run = false;
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
  let func = task.getFunc();
  switch (type) {
    case cwc.utils.StackType.CMD:
      this.run = true;
      func();
      this.run = false;
      this.handleQueue_();
      break;
    case cwc.utils.StackType.DELAY:
      this.run = true;
      setTimeout(function() {
        this.run = false;
        this.handleQueue_();
      }.bind(this), task.getValue());
      break;
    case cwc.utils.StackType.PROMISE:
      this.run = true;
      func().then(() => {
        this.run = false;
        this.handleQueue_();
      }).catch(() => {
        this.run = false;
        this.handleQueue_();
      });
      break;
    default:
      console.error('Unknown Stack Type', type);
  }
};
