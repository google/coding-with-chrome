/**
 * @fileoverview Advanced select screen for the different coding modes.
 *
 * @license Copyright 2015 The Coding with Chrome Authors.
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
  JAVASCRIPT_FRAMEWORKS: 'javaScriptFrameworks',
  JAVASCRIPT_TUTORIAL: 'javaScriptVideoTutorial',
  COFFEESCRIPT: 'coffeeScriptOverview',
  PENCIL_CODE: 'pencilCodeOverview',
  PYTHON: 'pythonOverview',
  MARKUP_LANGUAGE: 'markupLanguageOverview',
  HTML5: 'html5Overview',
  ROBOT: 'robotOverview',
  EV3: 'ev3Overview',
  SPHERO: 'spheroOverview',
  GRAPHIC_3D: 'graphic3DOverview'
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

  /** @private {!boolean} */
  this.isChromeApp_ = this.helper.checkChromeFeature('app.window');
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
  switch (name) {
    // General overview
    case cwc.ui.SelectScreenAdvancedView.OVERVIEW:
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.overview);
      this.setNavHeader_('Coding with Chrome');
      this.setClickEvent_('link-basic', this.showView,
          cwc.ui.SelectScreenAdvancedView.BASIC);
      this.setClickEvent_('link-programming-language', this.showView,
          cwc.ui.SelectScreenAdvancedView.PROGRAMMING_LANGUAGE);
      this.setClickEvent_('link-markup-language', this.showView,
          cwc.ui.SelectScreenAdvancedView.MARKUP_LANGUAGE);
      this.setClickEvent_('link-robot', this.showView,
          cwc.ui.SelectScreenAdvancedView.ROBOT);
      this.setClickEvent_('link-3d', this.showView,
          cwc.ui.SelectScreenAdvancedView.GRAPHIC_3D);
      break;

    // Basic screen
    case cwc.ui.SelectScreenAdvancedView.BASIC:
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.basicOverview);
      this.setNavHeader_('Simple', 'school');
      this.setClickEvent_('link-blank', this.newFile_, cwc.file.Type.BASIC);
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
      this.showTemplate_(
        cwc.soy.SelectScreenAdvanced.programmingLanguageOverview);
      this.setNavHeader_('Programming', 'view_stream');
      this.setClickEvent_('link-javascript', this.showView,
          cwc.ui.SelectScreenAdvancedView.JAVASCRIPT);
      this.setClickEvent_('link-coffeescript', this.showView,
          cwc.ui.SelectScreenAdvancedView.COFFEESCRIPT);
      this.setClickEvent_('link-python', this.showView,
          cwc.ui.SelectScreenAdvancedView.PYTHON);
      this.setClickEvent_('link-pencil-code', this.showView,
          cwc.ui.SelectScreenAdvancedView.PENCIL_CODE);
      break;

    // Programming Language Screens
    case cwc.ui.SelectScreenAdvancedView.JAVASCRIPT:
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.javaScriptOverview);
      this.setNavHeader_('JavaScript', 'beenhere');
      this.addProgrammingMenuHandler_();
      this.setClickEvent_('link-blank', this.newFile_, cwc.file.Type.BASIC);
      this.setClickEvent_('link-js-tutorials', this.showView,
          cwc.ui.SelectScreenAdvancedView.JAVASCRIPT_TUTORIAL);
      this.setClickEvent_('link-js-frameworks', this.showView,
          cwc.ui.SelectScreenAdvancedView.JAVASCRIPT_FRAMEWORKS);
      this.setClickEvent_('link-circle-animation', this.loadFile_,
          'resources/examples/javascript/script/CircleAnimation.cwc');
      this.setClickEvent_('link-triangle-animation', this.loadFile_,
          'resources/examples/javascript/script/TriangleAnimation.cwc');
      break;
    case cwc.ui.SelectScreenAdvancedView.JAVASCRIPT_TUTORIAL:
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.javaScriptVideoTutorial);
      this.addProgrammingMenuHandler_();
      break;
    case cwc.ui.SelectScreenAdvancedView.JAVASCRIPT_FRAMEWORKS:
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.javaScriptFrameworks);
      this.addProgrammingMenuHandler_();
      this.setClickEvent_('link-cube-animation', this.loadFile_,
          'resources/examples/javascript/frameworks/three.js/AnimatedCube.cwc');
      break;
    case cwc.ui.SelectScreenAdvancedView.COFFEESCRIPT:
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.coffeeScriptOverview);
      this.setNavHeader_('CoffeeScript', 'local_cafe');
      this.addProgrammingMenuHandler_();
      this.setClickEvent_('link-blank', this.newFile_,
          cwc.file.Type.COFFEESCRIPT);
      break;
    case cwc.ui.SelectScreenAdvancedView.PYTHON:
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.pythonOverview);
      this.setNavHeader_('Python', 'gesture');
      this.addProgrammingMenuHandler_();
      this.setClickEvent_('link-blank', this.newFile_, cwc.file.Type.PYTHON);
      this.setClickEvent_('link-guess-number', this.loadFile_,
          'resources/examples/python/guess-number.py');
      break;
    case cwc.ui.SelectScreenAdvancedView.PENCIL_CODE:
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.pencilCodeOverview);
      this.setNavHeader_('Pencil Code', 'mode_edit');
      this.addProgrammingMenuHandler_();
      this.setClickEvent_('link-blank', this.newFile_,
          cwc.file.Type.PENCIL_CODE);
      this.setClickEvent_('link-turtle-catch', this.loadFile_,
          'resources/examples/pencil_code/script/Turtle-catch.cwc');
      break;

    // Markup Language Overview
    case cwc.ui.SelectScreenAdvancedView.MARKUP_LANGUAGE:
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.markupLanguageOverview);
      this.setNavHeader_('Markup', 'public');
      this.setClickEvent_('link-html5', this.showView,
          cwc.ui.SelectScreenAdvancedView.HTML5);
      break;

    // HTML5 screen
    case cwc.ui.SelectScreenAdvancedView.HTML5:
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.html5Overview);
      this.setNavHeader_('HTML5', 'public');
      this.setClickEvent_('link-blank', this.newFile_, cwc.file.Type.HTML);
      this.setClickEvent_('link-form', this.loadFile_,
          'resources/examples/html5/form.html');
      break;

    // Robot overview
    case cwc.ui.SelectScreenAdvancedView.ROBOT:
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.robotOverview);
      this.setNavHeader_('Robots', 'memory');
      this.setClickEvent_('link-ev3', this.showView,
          cwc.ui.SelectScreenAdvancedView.EV3);
      this.setClickEvent_('link-sphero', this.showView,
          cwc.ui.SelectScreenAdvancedView.SPHERO);
      break;

    // EV3 screen
    case cwc.ui.SelectScreenAdvancedView.EV3:
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.ev3Overview);
      this.setNavHeader_('EV3', 'adb');
      this.addRobotMenuHandler_();
      this.setClickEvent_('link-blank', this.newFile_, cwc.file.Type.EV3);
      this.setClickEvent_('link-line-follower', this.loadFile_,
          'resources/examples/ev3/script/EV3-line-follower.cwc');
      break;
    // Sphero screen
    case cwc.ui.SelectScreenAdvancedView.SPHERO:
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.spheroOverview);
      this.setNavHeader_('Sphero', 'adjust');
      this.addRobotMenuHandler_();
      this.setClickEvent_('link-blank', this.newFile_, cwc.file.Type.SPHERO);
      this.setClickEvent_('link-rectangle', this.loadFile_,
          'resources/examples/sphero/script/Sphero-rectangle.cwc');
      break;

    // 3D overview
    case cwc.ui.SelectScreenAdvancedView.GRAPHIC_3D:
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.graphic3DOverview);
      this.setNavHeader_('3D', '3d_rotation');
      this.setClickEvent_('link-blank', this.newFile_, cwc.file.Type.BASIC);
      this.setClickEvent_('link-cube-animation', this.loadFile_,
          'resources/examples/javascript/frameworks/three.js/AnimatedCube.cwc');
      break;

    default:
      return;
  }
  this.addMenuHandler_();
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
 * @param {!string} title
 * @param {string=} opt_icon
 * @param {string=} opt_color_class
 * @private
 */
cwc.ui.SelectScreenAdvanced.prototype.setNavHeader_ = function(title,
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
  this.setClickEvent_('menu-3d', this.showView,
      cwc.ui.SelectScreenAdvancedView.GRAPHIC_3D);
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
  this.setClickEvent_('menu-python', this.showView,
      cwc.ui.SelectScreenAdvancedView.PYTHON);
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
 * @param {!cwc.soy.SelectScreenAdvanced} template
 * @private
 */
cwc.ui.SelectScreenAdvanced.prototype.showTemplate_ = function(template) {
  if (this.node && template) {
    goog.soy.renderElement(this.node, template, {
      prefix: this.prefix,
      online: this.helper.checkFeature('online')
    });
  } else {
    console.error('Unable to render template', template);
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
  var editorWindow = this.isChromeApp_ && chrome.app.window.get('editor');
  if (editorWindow) {
    editorWindow['clearAttention']();
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
  var editorWindow = this.isChromeApp_ && chrome.app.window.get('editor');
  if (editorWindow) {
    editorWindow['clearAttention']();
  }
};
