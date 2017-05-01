/**
 * @fileoverview layout for mbot modification.
 *
 * @license Copyright 2016 Shenzhen Maker Works Co, Ltd. All Rights Reserved.
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
 * @author wangyu@makeblock.cc (Yu Wang)
 */
goog.provide('cwc.mode.makeblock.mbotRanger.blockly.Layout');

goog.require('cwc.soy.mode.makeblock.mbotRanger.blockly.Layout');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.makeblock.mbotRanger.blockly.Layout = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;
};


/**
 * Decorates the mbot layout.
 */
cwc.mode.makeblock.mbotRanger.blockly.Layout.prototype.decorate = function() {
  let layoutInstance = this.helper.getInstance('layout', true);
  layoutInstance.decorateSimpleTwoColumnLayout();
  layoutInstance.setFixRightComponentSize(400);
  layoutInstance.setHandleSize(1);

  let nodes = layoutInstance.getNodes();
  console.log('Adding Content');

  goog.soy.renderElement(
      nodes['content-left'],
      cwc.soy.mode.makeblock.mbotRanger.blockly.Layout.editor,
      {'prefix': this.helper.getPrefix('mbot-ranger-editor')}
  );

  goog.soy.renderElement(
      nodes['content-right'],
      cwc.soy.mode.makeblock.mbotRanger.blockly.Layout.runner,
      {'prefix': this.helper.getPrefix('mbot-ranger-runner')}
  );
};
