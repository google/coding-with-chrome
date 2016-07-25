/**
 * @fileoverview Command library for the simple framework.
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
goog.provide('cwc.framework.simple.Command');

goog.require('cwc.utils.Dialog');

goog.require('goog.dom');



/**
 * Simple command framework.
 * @param {Element=} opt_target
 * @constructor
 * @struct
 * @final
 * @export
 */
cwc.framework.simple.Command = function(opt_target) {
  /** @type {Element|undefined} */
  this.target = opt_target;

  /** @private {cwc.utils.Dialog} */
  this.dialog_ = new cwc.utils.Dialog();
};


/**
 * @export
 */
cwc.framework.simple.Command.prototype.getTarget = function() {
  return this.target || document.body;
};


/**
 * Writes a text on screen.
 * @param {!string} text
 * @export
 */
cwc.framework.simple.Command.prototype.write = function(text) {
  this.addNode_(goog.dom.createTextNode(text));
};


/**
 * @param {!string} title
 * @param {!string} content
 * @export
 */
cwc.framework.simple.Command.prototype.showAlert = function(title, content) {
  this.dialog_.showContent(title, content);
};


/**
 * @param {!string} title
 * @param {!string} content
 * @param {string=} opt_value
 * @export
 */
cwc.framework.simple.Command.prototype.showPrompt = function(title, content,
    opt_value) {
  return this.dialog_.showPrompt(title, content, opt_value);
};


/**
 * @param {!string} title
 * @param {!string} content
 * @param {!Function}
 * @export
 */
cwc.framework.simple.Command.prototype.showYesNo = function(title, content) {
  return this.dialog_.showYesNo(title, content);
};


/**
 * Maps function to the global window name space.
 * @export
 */
cwc.framework.simple.Command.prototype.mapGlobal = function() {
  if (!window) {
    throw 'Window name space is not available in this instance.';
  }
  window['command'] = {
    'write': this.write.bind(this),
    'showAlert': this.showAlert.bind(this),
    'showPrompt': this.showPrompt.bind(this),
    'showYesNo': this.showYesNo.bind(this)
  };
};


/**
 * Appends the given element to the Stage environment.
 * @param {Node} node The object which should be added.
 * @private
 */
cwc.framework.simple.Command.prototype.addNode_ = function(node) {
  var target = this.getTarget();
  if (node && target) {
    goog.dom.appendChild(target, node);
  }
};
