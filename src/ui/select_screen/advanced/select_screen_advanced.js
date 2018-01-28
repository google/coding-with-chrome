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
  BASIC: 'basicOverview',
  COFFEESCRIPT: 'coffeeScriptOverview',
  EV3: 'ev3Overview',
  GAMES: 'gamesOverview',
  GRAPHIC_3D: 'graphic3DOverview',
  HTML5: 'html5Overview',
  JAVASCRIPT: 'javaScriptOverview',
  JAVASCRIPT_FRAMEWORKS: 'javaScriptFrameworks',
  JAVASCRIPT_TUTORIAL: 'javaScriptVideoTutorial',
  MARKUP_LANGUAGE: 'markupLanguageOverview',
  OVERVIEW: 'overview',
  PENCIL_CODE: 'pencilCodeOverview',
  PROGRAMMING_LANGUAGE: 'programmingLanguageOverview',
  PYTHON: 'pythonOverview',
  PYTHON27: 'python27Overview',
  ROBOT: 'robotOverview',
  SPHERO: 'spheroOverview',
  NONE: '',
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
  this.prefix = this.helper.getPrefix('select-screen-advanced');

  /** @type {Element} */
  this.node = null;

  /** @type {!cwc.ui.SelectScreenAdvancedView} */
  this.currentView = cwc.ui.SelectScreenAdvancedView.NONE;

  /** @type {Array<?>} */
  this.projects = null;

  /** @private {!boolean} */
  this.isChromeApp_ = this.helper.checkChromeFeature('app');
};


/**
 * Decorates the given node and adds the start screen.
 * @param {!Element} node
 * @export
 */
cwc.ui.SelectScreenAdvanced.prototype.decorate = function(node) {
  let projectHelper = this.helper.getInstance('project');
  this.node = node;
  projectHelper.deactivateProject();
};


/**
 * Shows the default or the select view.
 * @param {cwc.ui.SelectScreenAdvancedView=} optName
 * @export
 */
cwc.ui.SelectScreenAdvanced.prototype.showView = function(optName) {
  let name = optName || cwc.ui.SelectScreenAdvancedView.OVERVIEW;
  let projectHelper = this.helper.getInstance('project');
  this.projects = null;

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
      this.projects = projectHelper.getProjectList(
        ['CWC Advanced - Simple']);
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.basicOverview);
      this.setProjectClickEvents_(
        'resources/examples/simple/script/blank.cwc');
      this.setNavHeader_('Simple', 'school');
      this.setClickEvent_('link-blank', this.loadFile_,
          'resources/examples/simple/script/blank.cwc');
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
      this.projects = projectHelper.getProjectList(
        ['CWC Advanced - JavaScript']);
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.javaScriptOverview);
      this.setProjectClickEvents_(
        'resources/examples/javascript/script/blank.cwc');
      this.setNavHeader_('JavaScript', 'beenhere');
      this.addProgrammingMenuHandler_();
      this.setClickEvent_('link-js-tutorials', this.showView,
        cwc.ui.SelectScreenAdvancedView.JAVASCRIPT_TUTORIAL);
      this.setClickEvent_('link-js-frameworks', this.showView,
        cwc.ui.SelectScreenAdvancedView.JAVASCRIPT_FRAMEWORKS);
      this.setClickEvent_('link-blank', this.loadFile_,
        'resources/examples/javascript/script/blank.cwc');
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
      this.projects = projectHelper.getProjectList(
        ['CWC Advanced - CoffeeScript']);
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.coffeeScriptOverview);
      this.setProjectClickEvents_(
        'resources/examples/coffeescript/script/blank.coffee');
      this.setNavHeader_('CoffeeScript', 'local_cafe');
      this.addProgrammingMenuHandler_();
      this.setClickEvent_('link-blank', this.loadFile_,
        'resources/examples/coffeescript/script/blank.coffee');
      break;
    case cwc.ui.SelectScreenAdvancedView.PYTHON:
      this.projects = projectHelper.getProjectList(
        ['CWC Advanced - Python 3.x']);
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.pythonOverview);
      this.setProjectClickEvents_(
        'resources/examples/python/blank.py');
      this.setNavHeader_('Python', 'gesture');
      this.addProgrammingMenuHandler_();
      this.setClickEvent_('link-blank', this.loadFile_,
        'resources/examples/python/blank.py');
      this.setClickEvent_('link-turtle-graphics', this.loadFile_,
        'resources/examples/python/turtle-graphics.py');
      break;
    case cwc.ui.SelectScreenAdvancedView.PYTHON27:
      this.projects = projectHelper.getProjectList(
        ['CWC Advanced - Python 2.7']);
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.python27Overview);
      this.setProjectClickEvents_(
        'resources/examples/python2.7/blank.py');
      this.setNavHeader_('Python 2.7', 'gesture');
      this.addProgrammingMenuHandler_();
      this.setClickEvent_('link-blank', this.loadFile_,
        'resources/examples/python2.7/blank.py');
      this.setClickEvent_('link-guess-number', this.loadFile_,
        'resources/examples/python2.7/guess-number.py');
      this.setClickEvent_('link-turtle-graphics', this.loadFile_,
        'resources/examples/python2.7/turtle-graphics.py');
      break;
    case cwc.ui.SelectScreenAdvancedView.PENCIL_CODE:
      this.projects = projectHelper.getProjectList(
        ['CWC Advanced - Pencil Code']);
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.pencilCodeOverview);
      this.setProjectClickEvents_(
        'resources/examples/pencil_code/script/blank.cwc');
      this.setNavHeader_('Pencil Code', 'mode_edit');
      this.addProgrammingMenuHandler_();
      this.setClickEvent_('link-blank', this.loadFile_,
        'resources/examples/pencil_code/script/blank.cwc');
      this.setClickEvent_('link-turtle-catch', this.loadFile_,
        'resources/examples/pencil_code/script/Turtle-catch.cwc');
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
      this.projects = projectHelper.getProjectList(
        ['CWC Advanced - HTML5']);
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.html5Overview);
      this.setProjectClickEvents_(
        'resources/examples/html5/blank.html');
      this.setNavHeader_('HTML5', 'public');
      this.setClickEvent_('link-blank', this.loadFile_,
        'resources/examples/html5/blank.html');
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
      this.projects = projectHelper.getProjectList(
        ['CWC Advanced - EV3']);
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.ev3Overview);
      this.setProjectClickEvents_(
        'resources/examples/ev3/script/blank.cwc');
      this.setNavHeader_('EV3', 'adb');
      this.addRobotMenuHandler_();
      this.setClickEvent_('link-blank', this.loadFile_,
        'resources/examples/ev3/script/blank.cwc');
      this.setClickEvent_('link-line-follower', this.loadFile_,
        'resources/examples/ev3/script/EV3-line-follower.cwc');
      break;

    // Sphero screen
    case cwc.ui.SelectScreenAdvancedView.SPHERO:
      this.projects = projectHelper.getProjectList(
        ['CWC Advanced - Sphero']);
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.spheroOverview);
      this.setProjectClickEvents_(
        'resources/examples/sphero/script/blank.cwc');
      this.setNavHeader_('Sphero', 'adjust');
      this.addRobotMenuHandler_();
      this.setClickEvent_('link-blank', this.loadFile_,
        'resources/examples/sphero/script/blank.cwc');
      this.setClickEvent_('link-rectangle', this.loadFile_,
        'resources/examples/sphero/script/Sphero-rectangle.cwc');
      break;

    // Games overview
    case cwc.ui.SelectScreenAdvancedView.GAMES:
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.gamesOverview);
      this.setNavHeader_('Games', 'videogame_asset');
      this.setClickEvent_('link-blank', this.loadFile_,
        'resources/examples/phaser/script/blank.cwc');
      break;

    // 3D overview
    case cwc.ui.SelectScreenAdvancedView.GRAPHIC_3D:
      this.projects = projectHelper.getProjectList(
        ['CWC Advanced - 3D']);
      this.showTemplate_(cwc.soy.SelectScreenAdvanced.graphic3DOverview);
      this.setProjectClickEvents_(
        'resources/examples/simple/script/blank.cwc');
      this.setNavHeader_('3D', '3d_rotation');
      this.setClickEvent_('link-blank', this.loadFile_,
        'resources/examples/simple/script/blank.cwc');
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
      projects: this.projects,
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
  let element = goog.dom.getElement(elementName);
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
    loaderInstance.loadExampleFile('../../' + file_name);
  }
  let editorWindow = this.isChromeApp_ && chrome.app.window.get('editor');
  if (editorWindow) {
    editorWindow['clearAttention']();
  }
};


/**
 * Add click events to all visible projects
 * @param {string} file_name Example file name to load.
 * @private
 */
cwc.ui.SelectScreenAdvanced.prototype.setProjectClickEvents_ = function(
  file_name) {
  let visibleProjects = this.projects || [];
  let projectHelper = this.helper.getInstance('project');
  visibleProjects.forEach((project) => {
    this.setClickEvent_(`link-project-${project.id}`, () => {
      projectHelper.setActiveProject(project.id);
      this.loadFile_(file_name);
    });
  });

  if (visibleProjects.length) {
    this.setClickEvent_('link-projects-more', () => {
      window.open('https://edu.workbencheducation.com');
    });
  }
};
