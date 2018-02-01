/**
 * @fileoverview Message pane.
 *
 * @license Copyright 2017 The Coding with Chrome Authors.
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
goog.provide('cwc.ui.Message');

goog.require('cwc.soy.ui.Message');


/**
 * Class represents the monitor inside the ui.
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.Message = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('message');

  /** @type {Element} */
  this.node = null;
};


cwc.ui.Message.prototype.decorate = function(node) {
  if (node) {
    this.node = node;
  } else {
    this.node = goog.dom.getElement(this.prefix + 'chrome');
  }

  if (!this.node) {
    this.log_.error('Invalid Status node:', this.node);
    return;
  }

  goog.soy.renderElement(
      this.node,
      cwc.soy.ui.Message.template, {
        'prefix': this.prefix,
      }
  );
};
