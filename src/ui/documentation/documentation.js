/**
 * @fileoverview Document for Coding in Chrome editor.
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
goog.provide('cwc.ui.Documentation');

goog.require('cwc.soy.Documentation');
goog.require('cwc.utils.Helper');



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.Documentation = function(helper) {
  /** @type {Element} */
  this.node = null;

  /** @type {string} */
  this.prefix = 'documentation-';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;
};


/**
 * Decorates the given node and adds the file library.
 * @param {Element} node The target node to add the file library.
 * @param {string=} opt_prefix Additional prefix for the ids of the
 *    inserted elements and style definitions.
 */
cwc.ui.Documentation.prototype.decorate = function(node, opt_prefix) {
  this.node = node;
  this.prefix = opt_prefix + this.prefix;

  goog.soy.renderElement(
      this.node,
      cwc.soy.Documentation.documentationTemplate, {
        'prefix': this.prefix
      }
  );

  goog.style.installStyles(
      cwc.soy.Documentation.documentationStyle({
        'prefix': this.prefix
      })
  );
};
