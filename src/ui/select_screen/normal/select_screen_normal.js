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
goog.require('cwc.soy.SelectScreenNormal');
goog.require('cwc.utils.Helper');

goog.require('goog.dom');


/**
 * @enum {!string}
 */
cwc.ui.SelectScreenNormalView = {
  BASIC: 'basicOverview',
  DRAW: 'drawOverview',
  GAMES: 'gamesOverview',
  EV3: 'ev3Overview',
  MBOT: 'mbotOverview',
  MBOT_RANGER: 'mbotRangerOverview',
  MUSIC: 'musicOverview',
  OVERVIEW: 'overview',
  ROBOT: 'robotOverview',
  SPHERO: 'spheroOverview',
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
  this.prefix = this.helper.getPrefix('select-screen-normal');

  /** @type {Element} */
  this.node = null;

  /** @type {cwc.ui.SelectScreenNormalView} */
  this.currentView = null;

  /** @private {!boolean} */
  this.isChromeApp_ = this.helper.checkChromeFeature('app');

  /** @private {!string} */
  this.resourcesPath_ = 'resources/examples/';
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
      this.setClickEvent_('link-basic', this.showView,
          cwc.ui.SelectScreenNormalView.BASIC);
      this.setClickEvent_('link-draw', this.showView,
          cwc.ui.SelectScreenNormalView.DRAW);
      this.setClickEvent_('link-games', this.showView,
          cwc.ui.SelectScreenNormalView.GAMES);
      this.setClickEvent_('link-music', this.showView,
          cwc.ui.SelectScreenNormalView.MUSIC);
      this.setClickEvent_('link-robot', this.showView,
          cwc.ui.SelectScreenNormalView.ROBOT);
      break;

    // Currently not in use.
    case cwc.ui.SelectScreenNormalView.DRAW:
      this.showTemplate_(cwc.soy.SelectScreenNormal.drawOverview);
      this.setClickEvent_('link-blank', this.newFile_,
          cwc.file.Type.BASIC_BLOCKLY);
      break;
    case cwc.ui.SelectScreenNormalView.MUSIC:
      break;

    // Basic example screen
    case cwc.ui.SelectScreenNormalView.BASIC:
      this.showTemplate_(cwc.soy.SelectScreenNormal.basicOverview);
      this.setNavHeader_('Blocks', 'school');
      this.setClickEvent_('link-blank', this.newFile_,
          cwc.file.Type.BASIC_BLOCKLY);
      this.setClickEvent_('link-hello-world', this.loadFile_,
          'simple/blocks/Hello-World.cwc');
      this.setClickEvent_('link-text-loop', this.loadFile_,
          'simple/blocks/Text-Loop.cwc');
      this.setClickEvent_('link-sunlights', this.loadFile_,
          'simple/blocks/Sunlights.cwc');
      break;

    // Game example screen
    case cwc.ui.SelectScreenNormalView.GAMES:
      this.showTemplate_(cwc.soy.SelectScreenNormal.gamesOverview);
      this.setClickEvent_('link-blank', this.newFile_,
          cwc.file.Type.PHASER_BLOCKLY);
      this.setClickEvent_('link-switch-game-state', this.loadFile_,
          'phaser/blocks/switch-game-state.cwc');
      this.setClickEvent_('link-move-a-sprite', this.loadFile_,
          'phaser/blocks/move-a-sprite.cwc');
      this.setClickEvent_('link-bouncing-ball', this.loadFile_,
          'phaser/blocks/bouncing-ball.cwc');
      this.setClickEvent_('link-bouncing-cubes', this.loadFile_,
          'phaser/blocks/bouncing-cubes.cwc');
      break;

    // Robot overview
    case cwc.ui.SelectScreenNormalView.ROBOT:
      this.showTemplate_(cwc.soy.SelectScreenNormal.robotOverview);
      this.setNavHeader_('Robots', 'memory');
      this.setClickEvent_('link-ev3', this.showView,
          cwc.ui.SelectScreenNormalView.EV3);
      this.setClickEvent_('link-sphero', this.showView,
          cwc.ui.SelectScreenNormalView.SPHERO);
      this.setClickEvent_('link-mbot_blue', this.showView,
          cwc.ui.SelectScreenNormalView.MBOT);
      this.setClickEvent_('link-mbot_ranger', this.showView,
          cwc.ui.SelectScreenNormalView.MBOT_RANGER);
      break;

    // EV3 example screen
    case cwc.ui.SelectScreenNormalView.EV3:
      this.showTemplate_(cwc.soy.SelectScreenNormal.ev3Overview);
      this.setNavHeader_('EV3', 'adb');
      this.addRobotMenuHandler_();
      this.setClickEvent_('link-blank', this.newFile_,
          cwc.file.Type.EV3_BLOCKLY);
      this.setClickEvent_('link-block-grabber', this.loadFile_,
          'ev3/blocks/EV3-Educator-BlockGrabber.cwc');
      this.setClickEvent_('link-color-sensor', this.loadFile_,
          'ev3/blocks/EV3-Color-Sensor.cwc');
      this.setClickEvent_('link-ir-sensor', this.loadFile_,
          'ev3/blocks/EV3-IR-Sensor.cwc');
      break;

    // Sphero example screen
    case cwc.ui.SelectScreenNormalView.SPHERO:
      this.showTemplate_(cwc.soy.SelectScreenNormal.spheroOverview);
      this.setNavHeader_('Sphero', 'adjust');
      this.addRobotMenuHandler_();
      this.setClickEvent_('link-blank', this.newFile_,
          cwc.file.Type.SPHERO_BLOCKLY);
      this.setClickEvent_('link-rectangle', this.loadFile_,
          'sphero/blocks/Sphero-rectangle.cwc');
      this.setClickEvent_('link-collision', this.loadFile_,
          'sphero/blocks/Sphero-collision.cwc');
      break;

    // MBot example screen
    case cwc.ui.SelectScreenNormalView.MBOT:
      this.showTemplate_(cwc.soy.SelectScreenNormal.mbotOverview);
      this.setNavHeader_('mBot', 'adjust');
      this.addRobotMenuHandler_();
      this.setClickEvent_('link-blank', this.newFile_,
          cwc.file.Type.MBOT_BLOCKLY);
      this.setClickEvent_('link-button_light', this.loadFile_,
        'makeblock/mbot/blocks/mBot-button_light.cwc');
      this.setClickEvent_('link-collision_avoidance', this.loadFile_,
        'makeblock/mbot/blocks/mBot-collision_avoidance.cwc');
      this.setClickEvent_('link-lightness_sound', this.loadFile_,
        'makeblock/mbot/blocks/mBot-lightness_sound.cwc');
      this.setClickEvent_('link-line_follower', this.loadFile_,
        'makeblock/mbot/blocks/mBot-line_follower.cwc');
      break;

    // MBot ranger example screen
    case cwc.ui.SelectScreenNormalView.MBOT_RANGER:
      this.showTemplate_(cwc.soy.SelectScreenNormal.mbotRangerOverview);
      this.setNavHeader_('mBot Ranger', 'adjust');
      this.addRobotMenuHandler_();
      this.setClickEvent_('link-blank', this.newFile_,
          cwc.file.Type.MBOT_RANGER_BLOCKLY);
      this.setClickEvent_('link-ultrasonic_stop', this.loadFile_,
        'makeblock/mbot_ranger/blocks/Ultrasonic sensor - stop.cwc');
      this.setClickEvent_('link-sound_generator', this.loadFile_,
        'makeblock/mbot_ranger/blocks/Sound generator - Melodie.cwc');
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
 * Adding menu link handler.
 * @private
 */
cwc.ui.SelectScreenNormal.prototype.addMenuHandler_ = function() {
  this.setClickEvent_('menu-home', this.showView,
      cwc.ui.SelectScreenNormalView.OVERVIEW);
  this.setClickEvent_('menu-basic', this.showView,
      cwc.ui.SelectScreenNormalView.BASIC);
  this.setClickEvent_('menu-games', this.showView,
      cwc.ui.SelectScreenNormalView.GAMES);
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
  this.setClickEvent_('menu-mbot-ranger', this.showView,
      cwc.ui.SelectScreenNormalView.MBOT_RANGER);
};


/**
 * @param {!cwc.soy.SelectScreenNormal} template
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
 * Adds the click event for the given name and the given function.
 * @param {!string} name
 * @param {!function(?)} func
 * @param {string=} opt_param
 * @return {goog.events.ListenableKey|null|number}
 * @private
 */
cwc.ui.SelectScreenNormal.prototype.setClickEvent_ = function(name, func,
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

  return goog.events.listen(element, goog.events.EventType.CLICK, click_func,
    false, this);
};


/**
 * Creates a new file of the given type.
 * @param {cwc.file.Type} type
 * @private
 */
cwc.ui.SelectScreenNormal.prototype.newFile_ = function(type) {
  let fileCreatorInstance = this.helper.getInstance('fileCreator');
  if (fileCreatorInstance) {
    fileCreatorInstance.create(type);
  }
  let editorWindow = this.isChromeApp_ && chrome.app.window.get('editor');
  if (editorWindow) {
    editorWindow['clearAttention']();
  }
};


/**
 * Loads file into editor.
 * @param {string} file_name Example file name to load.
 * @private
 */
cwc.ui.SelectScreenNormal.prototype.loadFile_ = function(file_name) {
  let loaderInstance = this.helper.getInstance('fileLoader');
  if (loaderInstance) {
    loaderInstance.loadExampleFile('../../' + this.resourcesPath_ + file_name);
  }
  let editorWindow = this.isChromeApp_ && chrome.app.window.get('editor');
  if (editorWindow) {
    editorWindow['clearAttention']();
  }
};
