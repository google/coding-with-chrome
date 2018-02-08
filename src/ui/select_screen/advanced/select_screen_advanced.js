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
goog.require('cwc.ui.SelectScreen.Events');
goog.require('cwc.utils.Helper');


/**
 * @enum {!string}
 */
cwc.ui.SelectScreenAdvancedView = {
  BASIC: 'AdvancedBasic',
  COFFEESCRIPT: 'AdvancedCoffeeScript',
  EV3: 'AdvancedEv3',
  GAMES: 'AdvancedGames',
  GRAPHIC_3D: 'AdvancedGraphic3D',
  HTML5: 'AdvancedHtml5',
  JAVASCRIPT: 'AdvancedJavaScript',
  JAVASCRIPT_FRAMEWORKS: 'AdvancedJavaScriptFrameworks',
  JAVASCRIPT_TUTORIAL: 'AdvancedJavaScriptVideoTutorial',
  MARKUP_LANGUAGE: 'AdvancedMarkupLanguage',
  OVERVIEW: 'AdvancedOverview',
  PENCIL_CODE: 'AdvancedPencilCode',
  PROGRAMMING_LANGUAGE: 'AdvancedProgrammingLanguage',
  PYTHON: 'AdvancedPython',
  PYTHON27: 'AdvancedPython27',
  ROBOT: 'AdvancedRobot',
  SPHERO: 'AdvancedSphero',
  NONE: '',
};


/**
 * @param {!cwc.utils.Helper} helper
 * @param {!goog.events.EventTarget} eventHandler
 * @constructor
 * @struct
 */
cwc.ui.SelectScreenAdvanced = function(helper, eventHandler) {
  /** @type {string} */
  this.name = 'SelectScreenAdvanced';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('select-screen-advanced');

  /** @type {Element} */
  this.node = null;

  /** @type {!cwc.ui.SelectScreenAdvancedView} */
  this.currentView = cwc.ui.SelectScreenAdvancedView.NONE;

  /** @private {!boolean} */
  this.isChromeApp_ = this.helper.checkChromeFeature('app');

  /** @private {!string} */
  this.resourcesPath_ = '../../resources/examples/';

  /** @private {!goog.events.EventTarget} */
  this.eventHandler_ = eventHandler;
};


/**
 * Decorates the given node and adds the start screen.
 * @param {!Element} node
 * @export
 */
cwc.ui.SelectScreenAdvanced.prototype.decorate = function(node) {
  this.node = node;
};


/**
 * Shows the default or the select view.
 * @param {cwc.ui.SelectScreenAdvancedView=} optName
 * @export
 */
cwc.ui.SelectScreenAdvanced.prototype.showView = function(optName) {
  let name = optName || cwc.ui.SelectScreenAdvancedView.OVERVIEW;
  switch (name) {
    // General overview
    case cwc.ui.SelectScreenAdvancedView.OVERVIEW:
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.overview);
      this.setNavHeader_('Coding with Chrome');
      this.setClickEvent_('link-basic', this.showView,
          cwc.ui.SelectScreenAdvancedView.BASIC);
      this.setClickEvent_('link-games', this.showView,
          cwc.ui.SelectScreenAdvancedView.GAMES);
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
      this.setClickEvent_('link-blank', this.loadFile_,
          'simple/script/blank.cwc');
      this.setClickEvent_('link-hello-world', this.loadFile_,
          'simple/script/Hello-World.cwc');
      this.setClickEvent_('link-text-loop', this.loadFile_,
          'simple/script/Text-Loop.cwc');
      this.setClickEvent_('link-line-loop', this.loadFile_,
          'simple/script/Line-Loop.cwc');
      this.setClickEvent_('link-point-loop', this.loadFile_,
          'simple/script/Point-Loop.cwc');
      this.setClickEvent_('link-draw-portal-turret', this.loadFile_,
          'simple/script/Draw-Portal-Turret.cwc');
      break;

    // Programming language Overview
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
      this.setClickEvent_('link-python27', this.showView,
          cwc.ui.SelectScreenAdvancedView.PYTHON27);
      this.setClickEvent_('link-pencil-code', this.showView,
          cwc.ui.SelectScreenAdvancedView.PENCIL_CODE);
      break;

    // Programming language Screens
    case cwc.ui.SelectScreenAdvancedView.JAVASCRIPT:
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.javaScriptOverview);
      this.setNavHeader_('JavaScript', 'beenhere');
      this.addProgrammingMenuHandler_();
      this.setClickEvent_('link-js-tutorials', this.showView,
        cwc.ui.SelectScreenAdvancedView.JAVASCRIPT_TUTORIAL);
      this.setClickEvent_('link-js-frameworks', this.showView,
        cwc.ui.SelectScreenAdvancedView.JAVASCRIPT_FRAMEWORKS);
      this.setClickEvent_('link-blank', this.loadFile_,
        'javascript/script/blank.cwc');
      this.setClickEvent_('link-circle-animation', this.loadFile_,
        'javascript/script/CircleAnimation.cwc');
      this.setClickEvent_('link-triangle-animation', this.loadFile_,
        'javascript/script/TriangleAnimation.cwc');
      break;
    case cwc.ui.SelectScreenAdvancedView.JAVASCRIPT_TUTORIAL:
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.javaScriptVideoTutorial);
      this.addProgrammingMenuHandler_();
      break;
    case cwc.ui.SelectScreenAdvancedView.JAVASCRIPT_FRAMEWORKS:
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.javaScriptFrameworks);
      this.addProgrammingMenuHandler_();
      this.setClickEvent_('link-cube-animation', this.loadFile_,
        'javascript/frameworks/three.js/AnimatedCube.cwc');
      break;
    case cwc.ui.SelectScreenAdvancedView.COFFEESCRIPT:
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.coffeeScriptOverview);
      this.setNavHeader_('CoffeeScript', 'local_cafe');
      this.addProgrammingMenuHandler_();
      this.setClickEvent_('link-blank', this.loadFile_,
        'coffeescript/script/blank.coffee');
      break;
    case cwc.ui.SelectScreenAdvancedView.PYTHON:
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.pythonOverview);
      this.setNavHeader_('Python', 'gesture');
      this.addProgrammingMenuHandler_();
      this.setClickEvent_('link-blank', this.loadFile_,
        'python/blank.py');
      this.setClickEvent_('link-turtle-graphics', this.loadFile_,
        'python/turtle-graphics.py');
      break;
    case cwc.ui.SelectScreenAdvancedView.PYTHON27:
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.python27Overview);
      this.setNavHeader_('Python 2.7', 'gesture');
      this.addProgrammingMenuHandler_();
      this.setClickEvent_('link-blank', this.loadFile_,
        'python2.7/blank.py');
      this.setClickEvent_('link-guess-number', this.loadFile_,
        'python2.7/guess-number.py');
      this.setClickEvent_('link-turtle-graphics', this.loadFile_,
        'python2.7/turtle-graphics.py');
      break;
    case cwc.ui.SelectScreenAdvancedView.PENCIL_CODE:
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.pencilCodeOverview);
      this.setNavHeader_('Pencil Code', 'mode_edit');
      this.addProgrammingMenuHandler_();
      this.setClickEvent_('link-blank', this.loadFile_,
        'pencil_code/script/blank.cwc');
      this.setClickEvent_('link-turtle-catch', this.loadFile_,
        'pencil_code/script/Turtle-catch.cwc');
      break;

    // Markup language Overview
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
      this.setClickEvent_('link-blank', this.loadFile_,
        'html5/blank.html');
      this.setClickEvent_('link-form', this.loadFile_,
        'html5/form.html');
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
      this.setClickEvent_('link-blank', this.loadFile_,
        'ev3/script/blank.cwc');
      this.setClickEvent_('link-line-follower', this.loadFile_,
        'ev3/script/EV3-line-follower.cwc');
      break;

    // Sphero screen
    case cwc.ui.SelectScreenAdvancedView.SPHERO:
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.spheroOverview);
      this.setNavHeader_('Sphero', 'adjust');
      this.addRobotMenuHandler_();
      this.setClickEvent_('link-blank', this.loadFile_,
        'sphero/script/blank.cwc');
      this.setClickEvent_('link-rectangle', this.loadFile_,
        'sphero/script/Sphero-rectangle.cwc');
      break;

    // Games overview
    case cwc.ui.SelectScreenAdvancedView.GAMES:
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.gamesOverview);
      this.setNavHeader_('Games', 'videogame_asset');
      this.setClickEvent_('link-blank', this.loadFile_,
        'phaser/script/blank.cwc');
      break;

    // 3D overview
    case cwc.ui.SelectScreenAdvancedView.GRAPHIC_3D:
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.graphic3DOverview);
      this.setNavHeader_('3D', '3d_rotation');
      this.setClickEvent_('link-blank', this.loadFile_,
        'simple/script/blank.cwc');
      this.setClickEvent_('link-cube-animation', this.loadFile_,
        'javascript/frameworks/three.js/AnimatedCube.cwc');
      break;

    default:
      return;
  }
  this.addMenuHandler_();
  this.currentView = name;
  this.eventHandler_.dispatchEvent(
    cwc.ui.SelectScreen.Events.changeView(this.currentView));
};


/**
 * @export
 */
cwc.ui.SelectScreenAdvanced.prototype.showLastView = function() {
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
  let navigationInstance = this.helper.getInstance('navigation');
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
  this.setClickEvent_('menu-games', this.showView,
      cwc.ui.SelectScreenAdvancedView.GAMES);
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
  this.setClickEvent_('menu-python27', this.showView,
      cwc.ui.SelectScreenAdvancedView.PYTHON27);
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
 * @param {!Function} template
 * @private
 */
cwc.ui.SelectScreenAdvanced.prototype.showTemplate_ = function(template) {
  let modules = {};
  let userConfigInstance = this.helper.getInstance('userConfig');
  if (userConfigInstance) {
    modules = userConfigInstance.getAll(cwc.userConfigType.MODULE);
  }

  if (this.node && template) {
    goog.soy.renderElement(this.node, template, {
      debug: this.helper.debugEnabled(),
      experimental: this.helper.experimentalEnabled(),
      modules: modules,
      online: this.helper.checkFeature('online'),
      prefix: this.prefix,
    });
  } else {
    console.error('Unable to render template', template);
  }
};


/**
 * Adds the click event for the given name and the given function.
 * @param {!string} name
 * @param {!function(?)} func
 * @param {string=} opt_param
 * @return {goog.events.ListenableKey|null|number}
 * @private
 */
cwc.ui.SelectScreenAdvanced.prototype.setClickEvent_ = function(name, func,
    opt_param) {
  if (!func) {
    console.error('Missing function!');
    return null;
  }
  let elementName = this.prefix + name;
  let element = document.getElementById(elementName);
  if (!element) {
    console.error('Missing element ' + elementName + '!');
    return null;
  }

  let click_func = func;
  if (opt_param) {
    click_func = function() {
      func.call(this, opt_param);
    };
  }

  return goog.events.listen(element, goog.events.EventType.CLICK,
      click_func, false, this);
};


/**
 * Loads file into editor.
 * @param {string} file_name Example file name to load.
 * @private
 */
cwc.ui.SelectScreenAdvanced.prototype.loadFile_ = function(file_name) {
  let loaderInstance = this.helper.getInstance('fileLoader');
  if (loaderInstance) {
    loaderInstance.loadExampleFile(this.resourcesPath_ + file_name);
  }
  let editorWindow = this.isChromeApp_ && chrome.app.window.get('editor');
  if (editorWindow) {
    editorWindow['clearAttention']();
  }
};
