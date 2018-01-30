/**
 * @fileoverview Tutorial addon.
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
goog.provide('cwc.addon.Tutorial');

goog.require('cwc.mode.Modder.Events');
goog.require('cwc.soy.addon.Tutorial');
goog.require('cwc.ui.SelectScreen.Events');
goog.require('cwc.utils.Logger');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.addon.Tutorial = function(helper) {
  /** @type {!string} */
  this.name = 'Tutorial';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('addon-tutorial');

  /** @private {!string} */
  this.resourcesPath_ = '../../resources/tutorial/';

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


cwc.addon.Tutorial.prototype.prepare = function() {
  this.log_.info('Preparing tutorial addon ...');
  let selectScreenInstance = this.helper.getInstance('selectScreen');
  if (selectScreenInstance) {
    goog.events.listen(selectScreenInstance.getEventHandler(),
      cwc.ui.SelectScreen.Events.Type.VIEW_CHANGE,
      this.eventsSelectScreen, false, this);
  }

  let modeInstance = this.helper.getInstance('mode');
  if (modeInstance) {
    goog.events.listen(modeInstance.getEventHandler(),
      cwc.mode.Modder.Events.Type.MODE_CHANGE,
      this.eventsModder, false, this);
  }
};


cwc.addon.Tutorial.prototype.eventsSelectScreen = function(e) {
  let view = e.data;
  this.log_.info('Change View', view);
  if (view == 'basicOverview') {
    let navigationNode = goog.dom.getElement(
      'cwc-select-screen-normal-navigation-overview');
    navigationNode['style']['background'] = 'red';
    this.decorateBasic();
  }
};


cwc.addon.Tutorial.prototype.eventsModder = function(e) {
  let mode = e.data.mode;
  let file = e.data.file;
  this.log_.info('Change Mode', mode, 'for file', file);
  if (mode == 'basic_blockly' && file == 'tutorial-1.cwc') {
    this.log_.info('Adding message pane ...');
  }
};


cwc.addon.Tutorial.prototype.decorateBasic = function() {
  // Render cards
  let node = document.querySelector('.cwc-file-card-list > .__extension');
  let template = goog.soy.renderAsElement(cwc.soy.addon.Tutorial.basic, {
    prefix: this.prefix,
  });
  node.appendChild(template);

  // Event handler for the cards
  let basicCard = document.getElementById('cwc-addon-tutorial-link-basic');
  goog.events.listen(basicCard, goog.events.EventType.CLICK, function() {
      this.loadFile_('simple/blocks/tutorial-1.cwc');
    }, false, this);
};


/**
 * Loads file into editor.
 * @param {string} file_name Example file name to load.
 * @private
 */
cwc.addon.Tutorial.prototype.loadFile_ = function(file_name) {
  let loaderInstance = this.helper.getInstance('fileLoader');
  if (loaderInstance) {
    loaderInstance.loadExampleFile(this.resourcesPath_ + file_name);
  }
  let editorWindow = this.isChromeApp_ && chrome.app.window.get('editor');
  if (editorWindow) {
    editorWindow['clearAttention']();
  }
};
