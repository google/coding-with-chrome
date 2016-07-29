/**
 * @fileoverview Normal select screen for the different coding modes.
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
goog.provide('cwc.ui.SelectScreenNormal');
goog.provide('cwc.ui.SelectScreenNormalView');

goog.require('cwc.file.Type');
goog.require('cwc.soy.SelectScreenNormal');
goog.require('cwc.utils.Helper');

goog.require('goog.dom');

/**
 * @enum {!string}
 */
cwc.ui.SelectScreenNormalView = {
  OVERVIEW: 'overview',
  BASIC: 'basicOverview',
  DRAW: 'drawOverview',
  MUSIC: 'musicOverview',
  ROBOT: 'robotOverview',
  EV3: 'ev3Overview',
  SPHERO: 'spheroOverview',
  MBOT: 'mbotOverview'
};



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 */
cwc.ui.SelectScreenNormal = function(helper) {
  /** @type {string} */
  this.name = 'SelectScreenNormal';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = 'select-screen-normal-';

  /** @type {string} */
  this.generalPrefix = this.helper.getPrefix();

  /** @type {Element} */
  this.node = null;

  /** @type {Element|StyleSheet} */
  this.styleSheet = null;

  /** @type {cwc.ui.SelectScreenNormalView} */
  this.currentView = null;
};


/**
 * Decorates the given node and adds the start screen.
 * @param {Element} node
 * @param {string=} opt_prefix
 * @export
 */
cwc.ui.SelectScreenNormal.prototype.decorate = function(node, opt_prefix) {
  this.node = node;
  this.prefix = (opt_prefix || '') + this.prefix;

  if (!this.styleSheet) {
    this.styleSheet = goog.style.installStyles(
        cwc.soy.SelectScreenNormal.style({ 'prefix': this.prefix }));
  }
};


/**
 * Shows the default or the select view.
 * @param {cwc.ui.SelectScreenNormalView=} opt_name
 * @export
 */
cwc.ui.SelectScreenNormal.prototype.showView = function(opt_name) {
  var name = opt_name || cwc.ui.SelectScreenNormalView.OVERVIEW;
  this.showTemplate_(name);
  this.addMenuHandler_();
  switch (name) {
    // General overview
    case cwc.ui.SelectScreenNormalView.OVERVIEW:
      this.setNavHeader_('Coding with Chrome');
      this.setClickEvent_('link-basic', this.showView,
          cwc.ui.SelectScreenNormalView.BASIC);
      this.setClickEvent_('link-draw', this.showView,
          cwc.ui.SelectScreenNormalView.DRAW);
      this.setClickEvent_('link-music', this.showView,
          cwc.ui.SelectScreenNormalView.MUSIC);
      this.setClickEvent_('link-robot', this.showView,
          cwc.ui.SelectScreenNormalView.ROBOT);
      break;

    // Main screens
    case cwc.ui.SelectScreenNormalView.BASIC:
      this.setNavHeader_('Blocks', 'school');
      this.setClickEvent_('link-blank', this.newFile_,
          cwc.file.Type.BASIC_BLOCKLY);
      this.setClickEvent_('link-hello-world', this.loadFile_,
          'resources/examples/simple/blocks/Hello-World.cwc');
      this.setClickEvent_('link-text-loop', this.loadFile_,
          'resources/examples/simple/blocks/Text-Loop.cwc');
      break;
    case cwc.ui.SelectScreenNormalView.DRAW:
      this.setClickEvent_('link-blank', this.newFile_,
          cwc.file.Type.BASIC_BLOCKLY);
      break;
    case cwc.ui.SelectScreenNormalView.MUSIC:
      break;

    // Robot overview
    case cwc.ui.SelectScreenNormalView.ROBOT:
      this.setNavHeader_('Robots', 'memory');
      this.setClickEvent_('link-ev3', this.showView,
          cwc.ui.SelectScreenNormalView.EV3);
      this.setClickEvent_('link-sphero', this.showView,
          cwc.ui.SelectScreenNormalView.SPHERO);
      this.setClickEvent_('link-mbot', this.showView,
          cwc.ui.SelectScreenNormalView.MBOT);
      break;

    // Robot screens
    case cwc.ui.SelectScreenNormalView.EV3:
      this.setNavHeader_('EV3', 'adb');
      this.addRobotMenuHandler_();
      this.setClickEvent_('link-blank', this.newFile_,
          cwc.file.Type.EV3_BLOCKLY);
      this.setClickEvent_('link-block-grabber', this.loadFile_,
          'resources/examples/ev3/blocks/EV3-Educator-BlockGrabber.cwc');
      break;
    case cwc.ui.SelectScreenNormalView.SPHERO:
      this.setNavHeader_('Sphero', 'adjust');
      this.addRobotMenuHandler_();
      this.setClickEvent_('link-blank', this.newFile_,
          cwc.file.Type.SPHERO_BLOCKLY);
      this.setClickEvent_('link-rectangle', this.loadFile_,
          'resources/examples/sphero/blocks/Sphero-rectangle.cwc');
      this.setClickEvent_('link-collision', this.loadFile_,
          'resources/examples/sphero/blocks/Sphero-collision.cwc');
      break;

    case cwc.ui.SelectScreenNormalView.MBOT:
      this.setNavHeader_('mBot', 'adjust');
      this.addRobotMenuHandler_();
      this.setClickEvent_('link-blank', this.newFile_,
          cwc.file.Type.MBOT_BLOCKLY);

    default:
      return;
  }
  this.currentView = name;
};


/**
 * @export
 */
cwc.ui.SelectScreenNormal.prototype.showLastView = function() {
  console.log('showLastView', this.currentView);
  this.showView(this.currentView);
};


/**
 * @param {!string} title
 * @param {string=} opt_icon
 * @param {string=} opt_color_class
 * @private
 */
cwc.ui.SelectScreenNormal.prototype.setNavHeader_ = function(title,
    opt_icon, opt_color_class) {
  var navigationInstance = this.helper.getInstance('navigation');
  if (navigationInstance) {
    navigationInstance.setHeader(title, opt_icon, opt_color_class);
  }
};


/**
 * Adding menu link handler.
 * @private
 */
cwc.ui.SelectScreenNormal.prototype.addMenuHandler_ = function() {
  this.setClickEvent_('menu-home', this.showView,
      cwc.ui.SelectScreenNormalView.OVERVIEW);
  this.setClickEvent_('menu-basic', this.showView,
      cwc.ui.SelectScreenNormalView.BASIC);
  this.setClickEvent_('menu-draw', this.showView,
      cwc.ui.SelectScreenNormalView.DRAW);
  this.setClickEvent_('menu-music', this.showView,
      cwc.ui.SelectScreenNormalView.MUSIC);
  this.setClickEvent_('menu-robot', this.showView,
      cwc.ui.SelectScreenNormalView.ROBOT);
};


/**
 * Adding menu link handler.
 * @private
 */
cwc.ui.SelectScreenNormal.prototype.addRobotMenuHandler_ = function() {
  this.setClickEvent_('menu-ev3', this.showView,
      cwc.ui.SelectScreenNormalView.EV3);
  this.setClickEvent_('menu-sphero', this.showView,
      cwc.ui.SelectScreenNormalView.SPHERO);
  this.setClickEvent_('menu-mbot', this.showView,
      cwc.ui.SelectScreenNormalView.MBOT);
};


/**
 * @param {!string} template_name
 * @param {Object} opt_template
 * @private
 */
cwc.ui.SelectScreenNormal.prototype.showTemplate_ = function(template_name,
    opt_template) {
  if (this.node && template_name) {
    var templateConfig = {'prefix': this.prefix};
    var template = opt_template || cwc.soy.SelectScreenNormal;
    goog.soy.renderElement(this.node, template[template_name],
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
  if (!func) {
    console.error('Missing function!');
    return;
  }
  var elementName = this.prefix + name;
  var element = goog.dom.getElement(elementName);
  if (!element) {
    console.error('Missing element ' + elementName + '!');
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


/**
 * Loads file into editor.
 * @param {string} file_name Example file name to load.
 * @private
 */
cwc.ui.SelectScreenNormal.prototype.loadFile_ = function(file_name) {
  var loaderInstance = this.helper.getInstance('fileLoader');
  if (loaderInstance) {
    loaderInstance.loadExampleFile('../../' + file_name);
  }
  var editorWindow = chrome.app.window.get('editor');
  if (editorWindow) {
    editorWindow.clearAttention();
  }
};
