/**
 * @fileoverview Normal select screen for the different coding modes.
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
goog.provide('cwc.ui.SelectScreenNormal');
goog.provide('cwc.ui.SelectScreenNormalView');

goog.require('cwc.file.Type');
goog.require('cwc.mode.Type');
goog.require('cwc.soy.SelectScreenNormal');
goog.require('cwc.soy.SelectScreenNormal.basic');
goog.require('cwc.soy.SelectScreenNormal.games');
goog.require('cwc.soy.SelectScreenNormal.robot');
goog.require('cwc.soy.SelectScreenNormal.robot.lego');
goog.require('cwc.soy.SelectScreenNormal.robot.makeblock');
goog.require('cwc.soy.SelectScreenNormal.robot.sphero.bb8');
goog.require('cwc.soy.SelectScreenNormal.robot.sphero.classic');
goog.require('cwc.soy.SelectScreenNormal.robot.sphero.sprk_plus');
goog.require('cwc.ui.SelectScreen.Events');
goog.require('cwc.utils.Helper');


/**
 * @enum {!Object.<string>|string}
 */
cwc.ui.SelectScreenNormalView = {
  BASIC: 'basic',
  GAMES: 'games',
  EV3: 'ev3',
  MBOT: 'mbot',
  MBOT_RANGER: 'mbotRanger',
  OVERVIEW: 'overview',
  ROBOT: 'robot',
  SPHERO: {
    CLASSIC: 'sphero_classic',
    SPRK_PLUS: 'sphero_sprk_plus',
    BB8: 'sphero_bb8',
  },
  NONE: '',
};


/**
 * @param {!cwc.utils.Helper} helper
 * @param {!goog.events.EventTarget} eventHandler
 * @constructor
 * @struct
 */
cwc.ui.SelectScreenNormal = function(helper, eventHandler) {
  /** @type {string} */
  this.name = 'SelectScreenNormal';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('select-screen-normal');

  /** @type {Element} */
  this.node = null;

  /** @type {!cwc.ui.SelectScreenNormalView} */
  this.currentView = cwc.ui.SelectScreenNormalView.NONE;

  /** @private {!boolean} */
  this.isChromeApp_ = this.helper.checkChromeFeature('app');

  /** @private {!string} */
  this.resourcesPath_ = '../resources/examples/';

  /** @private {!goog.events.EventTarget} */
  this.eventHandler_ = eventHandler;
};


/**
 * Decorates the given node and adds the start screen.
 * @param {!Element} node
 * @export
 */
cwc.ui.SelectScreenNormal.prototype.decorate = function(node) {
  this.node = node;
};


/**
 * Shows the default or the select view.
 * @param {cwc.ui.SelectScreenNormalView=} optName
 * @export
 */
cwc.ui.SelectScreenNormal.prototype.showView = function(optName) {
  let name = optName || cwc.ui.SelectScreenNormalView.OVERVIEW;

  switch (name) {
    // General overview
    case cwc.ui.SelectScreenNormalView.OVERVIEW:
      this.showTemplate_(cwc.soy.SelectScreenNormal.overview);
      this.setNavHeader_('Coding with Chrome');
      break;

    // Basic examples
    case cwc.ui.SelectScreenNormalView.BASIC:
      this.showTemplate_(cwc.soy.SelectScreenNormal.basic.overview);
      this.setNavHeader_('Blocks', 'school');
      break;

    // Game examples
    case cwc.ui.SelectScreenNormalView.GAMES:
      this.showTemplate_(cwc.soy.SelectScreenNormal.games.overview);
      this.setNavHeader_('Games', 'videogame_asset');
      break;

    // Robot overview
    case cwc.ui.SelectScreenNormalView.ROBOT:
      this.showTemplate_(cwc.soy.SelectScreenNormal.robot.overview);
      this.setNavHeader_('Robots', 'memory');
      break;

    // EV3 examples
    case cwc.ui.SelectScreenNormalView.EV3:
      this.showTemplate_(cwc.soy.SelectScreenNormal.robot.lego.ev3);
      this.setNavHeader_('EV3', 'adb');
      this.addRobotMenuHandler_();
      break;

    // Sphero BB-8 examples
    case cwc.ui.SelectScreenNormalView.SPHERO.BB8:
      this.showTemplate_(
        cwc.soy.SelectScreenNormal.robot.sphero.bb8.overview);
      this.setNavHeader_('Sphero', 'adjust');
      this.addRobotMenuHandler_();
      break;

    // Sphero Classic examples
    case cwc.ui.SelectScreenNormalView.SPHERO.CLASSIC:
      this.showTemplate_(
        cwc.soy.SelectScreenNormal.robot.sphero.classic.overview);
      this.setNavHeader_('Sphero', 'adjust');
      this.addRobotMenuHandler_();
      break;

    // Sphero SPRK+ examples
    case cwc.ui.SelectScreenNormalView.SPHERO.SPRK_PLUS:
      this.showTemplate_(
        cwc.soy.SelectScreenNormal.robot.sphero.sprk_plus.overview);
      this.setNavHeader_('Sphero', 'adjust');
      this.addRobotMenuHandler_();
      break;

    // Makeblock mBot examples
    case cwc.ui.SelectScreenNormalView.MBOT:
      this.showTemplate_(cwc.soy.SelectScreenNormal.robot.makeblock.mbot);
      this.setNavHeader_('mBot', 'adjust');
      this.addRobotMenuHandler_();
      break;

    // Makeblock mBot Ranger examples
    case cwc.ui.SelectScreenNormalView.MBOT_RANGER:
      this.showTemplate_(cwc.soy.SelectScreenNormal.robot.makeblock.mbotRanger);
      this.setNavHeader_('mBot Ranger', 'adjust');
      this.addRobotMenuHandler_();
      break;

    default:
      return;
  }
  this.addFileHandler_();
  this.currentView = name;
  this.eventHandler_.dispatchEvent(
    cwc.ui.SelectScreen.Events.changeView(this.currentView));
};


/**
 * @export
 */
cwc.ui.SelectScreenNormal.prototype.showLastView = function() {
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
  let navigationInstance = this.helper.getInstance('navigation');
  if (navigationInstance) {
    navigationInstance.setHeader(title, opt_icon, opt_color_class);
  }
};


/**
 * Adding file link handler.
 * @private
 */
cwc.ui.SelectScreenNormal.prototype.addFileHandler_ = function() {
  let classnames = document.querySelectorAll(
    '.cwc-file-card, .cwc-select-card, .cwc-select-section-link, ' +
    '.cwc-select-header-link');
  Array.from(classnames).forEach((element) => {
    element.addEventListener('click', this.handleFileClick_.bind(this));
  });
};


/**
 * @param {!Function} template
 */
cwc.ui.SelectScreenNormal.prototype.showTemplate_ = function(template) {
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
 * @private
 * @param {Object} e
 */
cwc.ui.SelectScreenNormal.prototype.handleFileClick_ = function(e) {
  let filename = e.currentTarget.dataset['fileName'];
  let fileAction = e.currentTarget.dataset['fileAction'];
  console.log('Click action', fileAction, 'for file', filename);
  if (filename && fileAction) {
    switch (fileAction) {
      case 'loadFile': {
        let loaderInstance = this.helper.getInstance('fileLoader');
        if (loaderInstance) {
          loaderInstance.loadLocalFile(this.resourcesPath_ + filename);
        }
        break;
      }
      case 'loadMode': {
        let modeInstance = this.helper.getInstance('mode');
        if (modeInstance) {
          modeInstance.loadMode(filename);
        }
        break;
      }
      case 'loadView': {
        this.showView(filename);
        break;
      }
    }
    let editorWindow = this.isChromeApp_ && chrome.app.window.get('editor');
    if (editorWindow) {
      editorWindow['clearAttention']();
    }
  }
};
