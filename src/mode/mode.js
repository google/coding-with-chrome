/**
 * @fileoverview Editor mode for the Coding with Chrome editor.
 *
 * @license Copyright 2018 The Coding with Chrome Authors.
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
goog.provide('cwc.mode.Mod');


/**
 * Editor mod configuration.
 * @param {!Object} config_data
 * @constructor
 * @struct
 */
cwc.mode.Mod = function(config_data) {
  /** @type {!Array} */
  this.authors = config_data.authors || [];

  /** @type {boolean} */
  this.autoPreview = config_data.auto_preview || false;

  /** @type {!Array} */
  this.services = config_data.services || [];

  /** @type {boolean} */
  this.showBlockly = config_data.show_blockly || false;

  /** @type {boolean} */
  this.runPreview = config_data.run_preview || false;

  /** @type {string} */
  this.name = config_data.name || '';

  /** @type {string} */
  this.template = config_data.template || '';

  /** @type {string} */
  this.icon = config_data.icon || '';

  /** @type {!Object} */
  this.mod = config_data.mod || {};

  /** @type {!Array} Supported mime types */
  this.mimeTypes = config_data.mime_types || [];
};


/**
 * @param {cwc.utils.Helper=} helper
 * @return {!Object}
 */
cwc.mode.Mod.prototype.getMod = function(helper) {
  if (!goog.isFunction(this.mod)) {
    console.error('Mod for', this.name, 'is not a function!');
  }
  let Mod = this.mod;
  return new Mod(helper, this.showBlockly);
};
