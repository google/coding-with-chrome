/**
 * @fileoverview Help menu for the Coding with Chrome editor.
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
goog.provide('cwc.HelpMenu');

goog.require('cwc.soy.Help');
goog.require('cwc.ui.Debug');
goog.require('cwc.utils.Helper');

goog.require('goog.soy');
goog.require('goog.ui.Dialog');



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.HelpMenu = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;
};


/**
 * Shows the help for the first steps.
 * @param {Event=} opt_event
 */
cwc.HelpMenu.prototype.showFirstSteps = function(opt_event) {
  var dialog = new goog.ui.Dialog();
  dialog.setTitle('Coding with Chrome: First Steps');
  dialog.setContent(cwc.soy.Help.firstSteps());
  dialog.setButtonSet(goog.ui.Dialog.ButtonSet.createOk());
  dialog.setDisposeOnHide(true);
  dialog.render();
  dialog.setVisible(true);
};


/**
 * Shows the general help.
 * @param {Event=} opt_event
 */
cwc.HelpMenu.prototype.showHelp = function(opt_event) {
  var dialog = new goog.ui.Dialog();
  dialog.setTitle('Coding with Chrome: Help');
  dialog.setContent('Not implemented yet …');
  dialog.setButtonSet(goog.ui.Dialog.ButtonSet.createOk());
  dialog.setDisposeOnHide(true);
  dialog.render();
  dialog.setVisible(true);
};


/**
 * Shows the about information.
 * @param {Event=} opt_event
 */
cwc.HelpMenu.prototype.showAbout = function(opt_event) {
  var dialog = new goog.ui.Dialog();
  dialog.setTitle('About Coding with Chrome');
  dialog.setContent(cwc.soy.Help.about({
    'manifest': chrome.runtime.getManifest()}));
  dialog.setButtonSet(goog.ui.Dialog.ButtonSet.createOk());
  dialog.setDisposeOnHide(true);
  dialog.render();
  dialog.setVisible(true);
};


/**
 * Shows some debug information.
 * @param {Event=} opt_event
 */
cwc.HelpMenu.prototype.showDebug = function(opt_event) {
  var layoutInstance = this.helper.getInstance('layout', true);
  var debugInstance = this.helper.getInstance('debug', true);
  var overlayNode = layoutInstance.getOverlay();
  debugInstance.decorate(overlayNode);
  layoutInstance.showOverlay(true);
};


/**
 * Shows the available keyboard shortcuts.
 * @param {Event=} opt_event
 */
cwc.HelpMenu.prototype.showKeyboardShortcut = function(opt_event) {
  var dialog = new goog.ui.Dialog();
  dialog.setTitle('Coding with Chrome: Keyboard Shortcuts');
  dialog.setContent(cwc.soy.Help.keyboardShortcut());
  dialog.setButtonSet(goog.ui.Dialog.ButtonSet.createOk());
  dialog.setDisposeOnHide(true);
  dialog.render();
  dialog.setVisible(true);
};
