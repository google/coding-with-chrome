/**
 * @fileoverview Toolbar of the AIY functions.
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
 * @author fstanis@google.com (Filip Stanis)
 */
goog.provide('cwc.mode.aiy.Toolbar');

goog.require('cwc.utils.mime.Type');
goog.require('cwc.soy.ui.EditorToolbar');
goog.require('cwc.ui.Helper');

goog.require('goog.dom.classlist');
goog.require('goog.ui.MenuItem');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.aiy.Toolbar = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('aiy-toolbar');

  /** @type {Element} */
  this.statusNode = null;
};


/**
 * Decorates the toolbar.
 */
cwc.mode.aiy.Toolbar.prototype.decorate = function() {
  this.statusNode = goog.dom.getElement(this.prefix + 'status');
}

/**
 * Uploads the file to the AIY device.
 * @param {!string} id ID of button to add event to
 * @param {!Function} callback callback on toolbar button click
 */
cwc.mode.aiy.Toolbar.prototype.on = function(id, callback) {
  let node = goog.dom.getElement(this.prefix + id);
  if (!node) {
    throw new Error(`Invalid id: ${id}`);
  }
  goog.events.listen(node, goog.events.EventType.CLICK, callback);
};


/**
 * Sets the AIY status.
 * @param {!string} status
 */
cwc.mode.aiy.Toolbar.prototype.setStatus = function(status) {
  this.statusNode.innerText = status;
}
