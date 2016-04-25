/**
 * @fileoverview Advanced select screen for the different coding modes.
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
goog.provide('cwc.ui.SelectScreenAdvanced');
goog.provide('cwc.ui.SelectScreenAdvancedView');

goog.require('cwc.file.Type');
goog.require('cwc.soy.SelectScreenAdvanced');
goog.require('cwc.utils.Helper');

goog.require('goog.dom');

/**
 * @enum {!string}
 */
cwc.ui.SelectScreenAdvancedView = {
  OVERVIEW: 'overview',
  BASIC: 'basicOverview',
  PROGRAMMING_LANGUAGE: 'programmingLanguageOverview',
  JAVASCRIPT: 'javaScriptOverview',
  COFFEESCRIPT: 'coffeeScriptOverview',
  PENCIL_CODE: 'pencilCodeOverview',
  MARKUP_LANGUAGE: 'markupLanguageOverview',
  HTML5: 'html5Overview',
  ROBOT: 'robotOverview',
  EV3: 'ev3Overview',
  SPHERO: 'spheroOverview'
};



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 */
cwc.ui.SelectScreenAdvanced = function(helper) {
  /** @type {string} */
  this.name = 'SelectScreenAdvanced';

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

  /** @type {cwc.ui.SelectScreenAdvancedView} */
  this.currentView = null;
};


/**
 * Decorates the given node and adds the start screen.
 * @param {Element} node
 * @param {string=} opt_prefix
 * @export
 */
cwc.ui.SelectScreenAdvanced.prototype.decorate = function(node, opt_prefix) {
  this.node = node;
  this.prefix = (opt_prefix || '') + this.prefix;

  if (!this.styleSheet) {
    this.styleSheet = goog.style.installStyles(
        cwc.soy.SelectScreenAdvanced.style({ 'prefix': this.prefix }));
  }
};


/**
 * Shows the default or the select view.
 * @param {cwc.ui.SelectScreenAdvancedView=} opt_name
 * @export
 */
cwc.ui.SelectScreenAdvanced.prototype.showView = function(opt_name) {
  var name = opt_name || cwc.ui.SelectScreenAdvancedView.OVERVIEW;
  this.showTemplate_(name);
  this.addMenuHandler_();
  switch (name) {
    // General overview
    case cwc.ui.SelectScreenAdvancedView.OVERVIEW:
      this.setClickEvent_('link-basic', this.showView,
          cwc.ui.SelectScreenAdvancedView.BASIC);
      this.setClickEvent_('link-programming-language', this.showView,
          cwc.ui.SelectScreenAdvancedView.PROGRAMMING_LANGUAGE);
      this.setClickEvent_('link-markup-language', this.showView,
          cwc.ui.SelectScreenAdvancedView.MARKUP_LANGUAGE);
      this.setClickEvent_('link-robot', this.showView,
          cwc.ui.SelectScreenAdvancedView.ROBOT);
      break;

    // Basic screen
    case cwc.ui.SelectScreenAdvancedView.BASIC:
      this.setClickEvent_('link-blank', this.newFile_,
          cwc.file.Type.BASIC);
      this.setClickEvent_('link-hello-world', this.loadFile_,
          'resources/examples/simple/script/Hello-World.cwc');
      this.setClickEvent_('link-text-loop', this.loadFile_,
          'resources/examples/simple/script/Text-Loop.cwc');
      this.setClickEvent_('link-line-loop', this.loadFile_,
          'resources/examples/simple/script/Line-Loop.cwc');
      this.setClickEvent_('link-point-loop', this.loadFile_,
          'resources/examples/simple/script/Point-Loop.cwc');
      this.setClickEvent_('link-draw-portal-turret', this.loadFile_,
          'resources/examples/simple/script/Draw-Portal-Turret.cwc');
      break;

    // Programming Language Overview
    case cwc.ui.SelectScreenAdvancedView.PROGRAMMING_LANGUAGE:
      this.setClickEvent_('link-javascript', this.showView,
          cwc.ui.SelectScreenAdvancedView.JAVASCRIPT);
      this.setClickEvent_('link-coffeescript', this.showView,
          cwc.ui.SelectScreenAdvancedView.COFFEESCRIPT);
      this.setClickEvent_('link-pencil-code', this.showView,
          cwc.ui.SelectScreenAdvancedView.PENCIL_CODE);
      break;

    // Programming Language Screens
    case cwc.ui.SelectScreenAdvancedView.JAVASCRIPT:
      this.addProgrammingMenuHandler_();
      this.setClickEvent_('link-blank', this.newFile_,
          cwc.file.Type.BASIC);
      break;
    case cwc.ui.SelectScreenAdvancedView.COFFEESCRIPT:
      this.addProgrammingMenuHandler_();
      this.setClickEvent_('link-blank', this.newFile_,
          cwc.file.Type.COFFEESCRIPT);
      break;
    case cwc.ui.SelectScreenAdvancedView.PENCIL_CODE:
      this.addProgrammingMenuHandler_();
      this.setClickEvent_('link-blank', this.newFile_,
          cwc.file.Type.PENCIL_CODE);
      this.setClickEvent_('link-turtle-catch', this.loadFile_,
          'resources/examples/pencil_code/script/Turtle-catch.cwc');
      break;

    // Markup Language Overview
    case cwc.ui.SelectScreenAdvancedView.MARKUP_LANGUAGE:
      this.setClickEvent_('link-html5', this.showView,
          cwc.ui.SelectScreenAdvancedView.HTML5);
      break;

    // Markup Language Screens
    case cwc.ui.SelectScreenAdvancedView.HTML5:
      this.setClickEvent_('link-blank', this.newFile_,
          cwc.file.Type.HTML);
      this.setClickEvent_('link-formular', this.loadFile_,
          'resources/examples/html5/formular.html');
      break;

    // Robot overview
    case cwc.ui.SelectScreenAdvancedView.ROBOT:
      this.setClickEvent_('link-ev3', this.showView,
          cwc.ui.SelectScreenAdvancedView.EV3);
      this.setClickEvent_('link-sphero', this.showView,
          cwc.ui.SelectScreenAdvancedView.SPHERO);
      break;

    // Robot screens
    case cwc.ui.SelectScreenAdvancedView.EV3:
      this.addRobotMenuHandler_();
      this.setClickEvent_('link-blank', this.newFile_,
          cwc.file.Type.EV3);
      this.setClickEvent_('link-line-follower', this.loadFile_,
          'resources/examples/ev3/script/EV3-line-follower.cwc');
      break;
    case cwc.ui.SelectScreenAdvancedView.SPHERO:
      this.addRobotMenuHandler_();
      this.setClickEvent_('link-blank', this.newFile_,
          cwc.file.Type.SPHERO);
      this.setClickEvent_('link-rectangle', this.loadFile_,
          'resources/examples/sphero/script/Sphero-rectangle.cwc');
      break;

    default:
      return;
  }
  this.currentView = name;
};


/**
 * @export
 */
cwc.ui.SelectScreenAdvanced.prototype.showLastView = function() {
  console.log('showLastView', this.currentView);
  this.showView(this.currentView);
};


/**
 * Adding menu link handler.
 * @private
 */
cwc.ui.SelectScreenAdvanced.prototype.addMenuHandler_ = function() {
  this.setClickEvent_('menu-home', this.showView,
      cwc.ui.SelectScreenAdvancedView.OVERVIEW);
  this.setClickEvent_('menu-basic', this.showView,
      cwc.ui.SelectScreenAdvancedView.BASIC);
  this.setClickEvent_('menu-programming-language', this.showView,
      cwc.ui.SelectScreenAdvancedView.PROGRAMMING_LANGUAGE);
  this.setClickEvent_('menu-markup-language', this.showView,
      cwc.ui.SelectScreenAdvancedView.MARKUP_LANGUAGE);
  this.setClickEvent_('menu-robot', this.showView,
      cwc.ui.SelectScreenAdvancedView.ROBOT);
};


/**
 * Adding programming language menu handler.
 * @private
 */
cwc.ui.SelectScreenAdvanced.prototype.addProgrammingMenuHandler_ = function() {
  this.setClickEvent_('menu-javascript', this.showView,
      cwc.ui.SelectScreenAdvancedView.JAVASCRIPT);
  this.setClickEvent_('menu-coffeescript', this.showView,
      cwc.ui.SelectScreenAdvancedView.COFFEESCRIPT);
  this.setClickEvent_('menu-pencil-code', this.showView,
      cwc.ui.SelectScreenAdvancedView.PENCIL_CODE);
};


/**
 * Adding robot menu handler.
 * @private
 */
cwc.ui.SelectScreenAdvanced.prototype.addRobotMenuHandler_ = function() {
  this.setClickEvent_('menu-ev3', this.showView,
      cwc.ui.SelectScreenAdvancedView.EV3);
  this.setClickEvent_('menu-sphero', this.showView,
      cwc.ui.SelectScreenAdvancedView.SPHERO);
};


/**
 * @param {!string} template_name
 * @param {Object} opt_template
 * @private
 */
cwc.ui.SelectScreenAdvanced.prototype.showTemplate_ = function(template_name,
    opt_template) {
  if (this.node && template_name) {
    var templateConfig = {'prefix': this.prefix};
    var template = opt_template || cwc.soy.SelectScreenAdvanced;
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
cwc.ui.SelectScreenAdvanced.prototype.setClickEvent_ = function(name, func,
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
cwc.ui.SelectScreenAdvanced.prototype.newFile_ = function(type) {
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
cwc.ui.SelectScreenAdvanced.prototype.loadFile_ = function(file_name) {
  var loaderInstance = this.helper.getInstance('fileLoader');
  if (loaderInstance) {
    loaderInstance.loadExampleFile('../../' + file_name);
  }
  var editorWindow = chrome.app.window.get('editor');
  if (editorWindow) {
    editorWindow.clearAttention();
  }
};
