/**
 * @fileoverview Blockly Toolbox.
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
goog.provide('cwc.ui.BlocklyToolbox');

goog.require('cwc.utils.Logger');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.BlocklyToolbox = function(helper) {
  /** @type {string} */
  this.name = 'BlocklyToolbox';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {Function} */
  this.template = null;

  /** @type {!Object} */
  this.data = {type: '', files: []};

  /** @type {boolean} */
  this.autoCollapse = false;

  /** @private {!string} */
  this.rowItemClass_ = 'blocklyTreeRowItem';

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * Enables additional DOM manipulations.
 */
cwc.ui.BlocklyToolbox.prototype.decorate = function() {
  let treeRoot = document.getElementsByClassName('blocklyTreeRoot')[0];
  if (!treeRoot) {
    return;
  }

  let treeLabels = treeRoot.getElementsByClassName('blocklyTreeLabel');
  for (let name in treeLabels) {
    if (Object.prototype.hasOwnProperty.call(treeLabels, name)) {
      let treeLabel = treeLabels[name];
      if (!treeLabel.textContent) {
        continue;
      }
      let label = treeLabel.textContent.replace(/([^a-z0-9 ]+)/gi, '')
        .replace(/( )+/g, '_').toLowerCase();
      let blocklyTreeRowItem = treeLabel.parentNode.parentNode;
      if (blocklyTreeRowItem) {
        goog.dom.classlist.add(blocklyTreeRowItem, this.rowItemClass_);
        goog.dom.classlist.add(blocklyTreeRowItem,
          this.rowItemClass_ + '_' + label);
      }
    }
  }
};


/**
 * @param {boolean} enable
 */
cwc.ui.BlocklyToolbox.prototype.setAutoCollapse = function(enable) {
  this.autoCollapse = enable;
};


/**
 * @return {boolean}
 */
cwc.ui.BlocklyToolbox.prototype.getAutoCollapse = function() {
  return this.autoCollapse;
};


/**
 * @param {!Object} data
 */
cwc.ui.BlocklyToolbox.prototype.setData = function(data) {
  this.data = data;
};


/**
 * @return {!Object}
 */
cwc.ui.BlocklyToolbox.prototype.getData = function() {
  return this.data;
};


/**
 * @param {!Function} template
 * @param {Object=} data
 */
cwc.ui.BlocklyToolbox.prototype.setTemplate = function(template,
    data = undefined) {
  this.template = template;
  if (data) {
    this.setData(data);
  }
};


/**
 * @return {Function}
 */
cwc.ui.BlocklyToolbox.prototype.getTemplate = function() {
  return this.template;
};


/**
 * Update the toolbox with the template
 * @param {Function=} template
 * @param {Object=} data
 */
cwc.ui.BlocklyToolbox.prototype.update = function(template = this.template,
    data = this.data) {
  if (!template) {
    this.log_.warn('Was unable to update Blockly toolbox.');
  }

  let blocklyInstance = this.helper.getInstance('blockly');
  if (blocklyInstance) {
    let workspace = blocklyInstance.getWorkspace();
    if (workspace) {
      workspace.updateToolbox(template(data).content);
      this.decorate();
    }
  }
};


/**
 * @param {!Array} files
 */
cwc.ui.BlocklyToolbox.prototype.setFiles = function(files) {
  if (!this.template) {
    return;
  }
  this.clearSelection();
  let data = this.data || {};
  data.files = files;
  this.data = data;
  this.update();
};


/**
 * Clear selection of the toolbox of the current workspace.
 */
cwc.ui.BlocklyToolbox.prototype.clearSelection = function() {
  let toolbox = this.getToolbox_();
  if (toolbox) {
    toolbox.clearSelection();
  }
};


/**
 * Collapse Toolbox without the optional label.
 * @param {string=} ignoreLabel
 */
cwc.ui.BlocklyToolbox.prototype.collapse = function(ignoreLabel = '') {
  let treeRoot = document.getElementsByClassName('blocklyTreeRoot')[0];
  if (!treeRoot) {
    return;
  }
  let itemClassName = this.rowItemClass_ + '_' + ignoreLabel
    .replace(/([^a-z0-9 ]+)/gi, '')
    .replace(/( )+/g, '_')
    .toLowerCase();
  let skipItem = treeRoot.getElementsByClassName(itemClassName)[0];
  if (ignoreLabel && !skipItem) {
    return;
  }

  let items = treeRoot.getElementsByClassName(this.rowItemClass_);
  for (let name in items) {
    if (Object.prototype.hasOwnProperty.call(items, name)) {
      let item = items[name];
      if (item !== skipItem) {
        if (item.getAttribute && item.getAttribute('aria-expanded') == 'true') {
          if (item.id && this.getToolboxTree_()) {
            this.getToolboxTree_().childIndex_[item.id].collapse();
          }
        }
      }
    }
  }
};


/**
 * @return {Blockly.Toolbox}
 */
cwc.ui.BlocklyToolbox.prototype.getToolbox_ = function() {
  let blocklyInstance = this.helper.getInstance('blockly');
  if (blocklyInstance) {
    let workspace = blocklyInstance.getWorkspace();
    if (workspace) {
      return workspace.toolbox_;
    }
  }
  return null;
};


/**
 * @return {Blockly.Toolbox.TreeControl}
 */
cwc.ui.BlocklyToolbox.prototype.getToolboxTree_ = function() {
  let toolbox = this.getToolbox_();
  if (toolbox) {
    return toolbox.tree_;
  }
  return null;
};
