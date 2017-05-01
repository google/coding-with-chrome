/**
 * @fileoverview Runner terminal for the Coding with Chrome editor.
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
goog.provide('cwc.ui.RunnerTerminal');

goog.require('cwc.soy.RunnerTerminal');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 */
cwc.ui.RunnerTerminal = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('runner-terminal');

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeOutput = null;
};


/**
 * @param {Element} node
 * @export
 */
cwc.ui.RunnerTerminal.prototype.decorate = function(node) {
  this.node = node;

  goog.soy.renderElement(
      this.node,
      cwc.soy.RunnerTerminal.template,
      {'prefix': this.prefix}
  );

  this.nodeOutput = goog.dom.getElement(this.prefix + 'output');
  this.write('Runner Terminal loaded...\n\n');
};


/**
 * Writes data to terminal output.
 * @param {string} data
 * @export
 */
cwc.ui.RunnerTerminal.prototype.write = function(data) {
  this.nodeOutput.innerText += data;
  this.nodeOutput.scrollTop = this.nodeOutput.scrollHeight;
};


/**
 * Clears terminal output.
 * @export
 */
cwc.ui.RunnerTerminal.prototype.clear = function() {
  this.nodeOutput.innerText = '';
};
