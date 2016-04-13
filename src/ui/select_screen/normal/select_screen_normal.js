/**
 * @fileoverview Select screen for the different coding modes and formats.
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
 * @author brunopanara@google.com (Bruno Panara)
 */
goog.provide('cwc.ui.SelectScreenNormal');

goog.require('cwc.file.Type');
goog.require('cwc.soy.SelectScreenNormal');
goog.require('cwc.utils.Helper');

goog.require('goog.dom');



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 */
cwc.ui.SelectScreenNormal = function(node_content, helper) {
  /** @type {string} */
  this.name = 'SelectScreenNormal';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = 'select-screen-normal-';

  /** @type {string} */
  this.generalPrefix = this.helper.getPrefix();

  /** @type {Element} */
  this.nodeContent = node_content;
};


/**
 * Decorates the given node and adds the start screen.
 * @param {Element} node
 * @param {string=} opt_prefix
 */
cwc.ui.SelectScreenNormal.prototype.decorate = function(opt_prefix) {
  this.prefix = (opt_prefix || '') + this.prefix;

  if (!this.styleSheet) {
    this.styleSheet = goog.style.installStyles(
        cwc.soy.SelectScreenNormal.style({ 'prefix': this.prefix }));
  }
};


/**
 * Shows the basic overview for normal users.
 */
cwc.ui.SelectScreenNormal.prototype.showOverview = function() {
  this.showTemplate_('overview');
  this.addMenuHandler_();
  this.setClickEvent_('link-basic', this.showBasicOverview);
  this.setClickEvent_('link-draw', this.showDrawOverview);
  this.setClickEvent_('link-music', this.showMusicOverview);
  this.setClickEvent_('link-robot', this.showRobotOverview);
};


/**
 * Shows the basic overview for normal users.
 */
cwc.ui.SelectScreenNormal.prototype.showBasicOverview = function() {
  this.showTemplate_('basicOverview');
  this.addMenuHandler_();
};


/**
 * Shows the draw overview for normal users.
 */
cwc.ui.SelectScreenNormal.prototype.showDrawOverview = function() {
  this.showTemplate_('drawOverview');
  this.addMenuHandler_();
};


/**
 * Shows the music overview for normal users.
 */
cwc.ui.SelectScreenNormal.prototype.showMusicOverview = function() {
  this.showTemplate_('musicOverview');
  this.addMenuHandler_();
};


/**
 * Shows the robot overview for normal users.
 */
cwc.ui.SelectScreenNormal.prototype.showRobotOverview = function() {
  this.showTemplate_('robotOverview');
  this.addMenuHandler_();
  this.addRobotMenuHandler_();
  this.setClickEvent_('link-ev3', this.showRobotEV3);
  this.setClickEvent_('link-sphero', this.showRobotSphero);
};


/**
 * Shows the robot overview for normal users.
 */
cwc.ui.SelectScreenNormal.prototype.showRobotEV3 = function() {
  this.showTemplate_('ev3Overview');
  this.addMenuHandler_();
  this.addRobotMenuHandler_();
  this.setClickEvent_('link-empty', this.newFile_, cwc.file.Type.EV3_BLOCKLY);
};


/**
 * Shows the robot overview for normal users.
 */
cwc.ui.SelectScreenNormal.prototype.showRobotSphero = function() {
  this.showTemplate_('spheroOverview');
  this.addMenuHandler_();
  this.addRobotMenuHandler_();
};


/**
 * Adding menu link handler.
 * @private
 */
cwc.ui.SelectScreenNormal.prototype.addMenuHandler_ = function() {
  this.setClickEvent_('menu-home', this.showOverview);
  this.setClickEvent_('menu-basic', this.showBasicOverview);
  this.setClickEvent_('menu-draw', this.showDrawOverview);
  this.setClickEvent_('menu-music', this.showMusicOverview);
  this.setClickEvent_('menu-robot', this.showRobotOverview);
};


/**
 * Adding menu link handler.
 * @private
 */
cwc.ui.SelectScreenNormal.prototype.addRobotMenuHandler_ = function() {
  this.setClickEvent_('menu-ev3', this.showRobotEV3);
  this.setClickEvent_('menu-sphero', this.showRobotSphero);
};


/**
 * @param {!string} template_name
 * @param {Object} opt_template
 * @private
 */
cwc.ui.SelectScreenNormal.prototype.showTemplate_ = function(template_name,
    opt_template) {
  if (this.nodeContent && template_name) {
    var templateConfig = {'prefix': this.prefix};
    var template = opt_template || cwc.soy.SelectScreenNormal;
    goog.soy.renderElement(this.nodeContent, template[template_name],
        templateConfig);
  } else {
    console.error('Unable to render template', template_name);
  }
};


/**
 * Adds the click event for the given name and the given function.
 * @param {!string} name
 * @param {!function()} func
 * @param {string=} opt_param
 * @return {function()}
 * @private
 */
cwc.ui.SelectScreenNormal.prototype.setClickEvent_ = function(name, func,
    opt_param) {
  var elementName = this.prefix + name;
  var element = goog.dom.getElement(elementName);
  if (!element) {
    console.error('Was not able to find element ' + elementName + '!');
    return;
  }

  var click_func = func;
  if (opt_param) {
    click_func = function() {
      func.call(this, opt_param);
    };
  }

  return goog.events.listen(element, goog.events.EventType.CLICK,
      click_func, false, this);
};


/**
 * Creates a new file of the given type.
 * @param {cwc.file.Type} type
 * @private
 */
cwc.ui.SelectScreenNormal.prototype.newFile_ = function(type) {
  var fileCreatorInstance = this.helper.getInstance('fileCreator');
  if (fileCreatorInstance) {
    fileCreatorInstance.create(type);
  }
  var editorWindow = chrome.app.window.get('editor');
  if (editorWindow) {
    editorWindow.clearAttention();
  }
};
