/**
 * @fileoverview Navigation for the Coding with Chrome editor.
 *
 * @license Copyright 2015 Google Inc. All Rights Reserved.
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
goog.provide('cwc.ui.Navigation');

goog.require('cwc.soy.ui.Navigation');
goog.require('cwc.ui.Helper');

goog.require('goog.ui.Button');
goog.require('goog.ui.LinkButtonRenderer');



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.Navigation = function(helper) {
  /** @type {string} */
  this.name = 'Navigation';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = 'navigation-';

  /** @type {string} */
  this.generalPrefix = this.helper.getPrefix();

  /** @type {!goog.ui.MenuItem} */
  this.menuNew = cwc.ui.Helper.getNavigationItem('New project',
      'Start a new project', this.requestShowSelectScreen, this);

  /** @type {!goog.ui.MenuItem} */
  this.menuOpen = cwc.ui.Helper.getNavigationItem('Open ...',
      'Open a local file ...', this.requestOpenFile, this);

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeItems = null;
};


/**
 * Decorates the given node and adds the navigation.
 * @param {Element} node The target node to add the navigation.
 * @param {string=} opt_prefix Additional prefix for the ids of the
 *    inserted elements and style definitions.
 * @export
 */
cwc.ui.Navigation.prototype.decorate = function(node, opt_prefix) {
  this.node = node;
  this.prefix = opt_prefix + this.prefix;

  goog.soy.renderElement(
      this.node, cwc.soy.ui.Navigation.template, {'prefix': this.prefix});

  this.nodeItems = goog.dom.getElement(this.prefix + 'items');
  this.menuNew.render(this.nodeItems);
  this.menuOpen.render(this.nodeItems);
};


/**
 * Toggle the drawer.
 */
cwc.ui.Navigation.prototype.toggle = function() {
  var mdlLayout = document.querySelector('.mdl-layout');
  if (mdlLayout) {
    mdlLayout.MaterialLayout.toggleDrawer();
  }
};


/**
 * Shows new file dialog.
 */
cwc.ui.Navigation.prototype.requestShowSelectScreen = function() {
  var selectScreenInstance = this.helper.getInstance('selectScreen');
  if (selectScreenInstance) {
    selectScreenInstance.requestShowSelectScreen(this.toggle);
  }
};


/**
 * Request to open a existing file from the local drive.
 */
cwc.ui.Navigation.prototype.requestOpenFile = function() {
  var fileLoaderInstance = this.helper.getInstance('fileLoader');
  if (fileLoaderInstance) {
    fileLoaderInstance.requestLoadFile(this.toggle);
  }
};
