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
goog.provide('cwc.ui.SelectScreen');

goog.require('cwc.file.Type');
goog.require('cwc.soy.SelectScreen');
goog.require('cwc.soy.SelectScreenStyle');
goog.require('cwc.utils.Helper');

goog.require('goog.dom');



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 */
cwc.ui.SelectScreen = function(helper) {
  /** @type {string} */
  this.name = 'SelectScreen';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = 'select-screen-';

  /** @type {string} */
  this.generalPrefix = this.helper.getPrefix();

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeContent = null;

  /** @type {Element|StyleSheet} */
  this.styleSheet = null;

  /** @type {boolean} */
  this.updateMode = false;
};


/**
 * Decorates the given node and adds the start screen.
 * @param {Element} node
 * @param {string=} opt_prefix
 */
cwc.ui.SelectScreen.prototype.decorate = function(node, opt_prefix) {
  this.node = node;
  this.prefix = (opt_prefix || '') + this.prefix;

  goog.soy.renderElement(this.node, cwc.soy.SelectScreen.template,
      {'prefix': this.prefix});

  if (!this.styleSheet) {
    this.styleSheet = goog.style.installStyles(
        cwc.soy.SelectScreenStyle.style({ 'prefix': this.prefix,
          'version': this.helper.getAppVersion() }));
  }

  this.nodeContent = goog.dom.getElement(this.prefix + 'content');
};


/**
 * Creates a request to show the select screen.
 * @param {Function=} opt_callback
 */
cwc.ui.SelectScreen.prototype.requestShowSelectScreen = function(opt_callback) {
  this.helper.handleUnsavedChanges(this.showSelectScreen.bind(this),
      opt_callback);
};


/**
 * Renders and shows the select screen.
 */
cwc.ui.SelectScreen.prototype.showSelectScreen = function() {
  var userConfigInstance = this.helper.getInstance('userConfig');
  var skipWelcomeScreen = false;
  var advancedMode = false;
  if (userConfigInstance) {
    skipWelcomeScreen = userConfigInstance.get(cwc.userConfigType.GENERAL,
            cwc.userConfigName.SKIP_WELCOME);
    advancedMode = userConfigInstance.get(cwc.userConfigType.GENERAL,
            cwc.userConfigName.ADVANCED_MODE);
  }
  var layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    layoutInstance.decorateSimpleSingleColumnLayout();
    var nodes = layoutInstance.getNodes();
    this.decorate(nodes['content']);
    if (!skipWelcomeScreen) {
      this.showWelcome();
    } else if (advancedMode) {
      this.showAdvancedOverview();
    } else {
      this.showNormalOverview();
    }
  }
  var guiInstance = this.helper.getInstance('gui');
  if (guiInstance) {
    guiInstance.setTitle('');
    guiInstance.setStatus('');
  }
};


/**
 * Shows general welcome screen.
 */
cwc.ui.SelectScreen.prototype.showWelcome = function() {
  this.showTemplate('welcome');

  var userConfigInstance = this.helper.getInstance('userConfig');
  if (userConfigInstance) {
    var showWelcome = goog.dom.getElement(this.prefix + 'show-welcome');
    showWelcome.checked = !userConfigInstance.get(cwc.userConfigType.GENERAL,
            cwc.userConfigName.SKIP_WELCOME);
    goog.events.listen(showWelcome, goog.events.EventType.CHANGE,
      function(opt_event) {
        this.updateMode = !showWelcome.checked;
        userConfigInstance.set(cwc.userConfigType.GENERAL,
          cwc.userConfigName.SKIP_WELCOME, !showWelcome.checked);
      }, false, this);
  }
  this.setClickEvent('link-normal-mode', this.showNormalOverview);
  this.setClickEvent('link-advanced-mode', this.showAdvancedOverview);
};


/**
 * Shows normal overview.
 */
cwc.ui.SelectScreen.prototype.showNormalOverview = function() {
  if (this.updateMode) {
    var userConfigInstance = this.helper.getInstance('userConfig');
    if (userConfigInstance) {
      userConfigInstance.set(cwc.userConfigType.GENERAL,
          cwc.userConfigName.ADVANCED_MODE, false);
    }
    this.updateMode = false;
  }
  this.showTemplate('normalOverview');
  this.setOverviewLinks();
};


/**
 * Shows advanced overview.
 */
cwc.ui.SelectScreen.prototype.showAdvancedOverview = function() {
  if (this.updateMode) {
    var userConfigInstance = this.helper.getInstance('userConfig');
    if (userConfigInstance) {
      userConfigInstance.set(cwc.userConfigType.GENERAL,
          cwc.userConfigName.ADVANCED_MODE, true);
    }
    this.updateMode = false;
  }
  this.showTemplate('advancedOverview');
  this.setOverviewLinks();
};


/**
 * Shows general overview.
 */
cwc.ui.SelectScreen.prototype.showOverview = function() {
  this.showTemplate('overview');
  this.setOverviewLinks();
};


/**
 * Shows blocks overview.
 */
cwc.ui.SelectScreen.prototype.showBlocks = function() {
  this.showTemplate('blocks');
  this.setOverviewLinks();
  this.setHomeLink();
  this.setClickEvent('link-ev3', this.newEV3Blockly);
  this.setClickEvent('link-sphero', this.newSpheroBlockly);
  this.setClickEvent('link-cwc-blockly', this.newCwcBlockly);
  this.setClickEvent('link-home', this.showOverview);
};


/**
 * Shows code overview.
 */
cwc.ui.SelectScreen.prototype.showCode = function() {
  this.showTemplate('code');
  this.setOverviewLinks();
  this.setHomeLink();
  this.setClickEvent('link-coffeescript', this.newCoffeescript);
  this.setClickEvent('link-cwc-basic', this.newCwcBasic);
  this.setClickEvent('link-cwc-advanced', this.newCwcAdvanced);
  this.setClickEvent('link-ev3', this.newEV3);
  this.setClickEvent('link-sphero', this.newSphero);
  this.setClickEvent('link-pencil-code', this.newPencilCode);
  this.setClickEvent('link-home', this.showOverview);
};


/**
 * Shows gallery overview.
 */
cwc.ui.SelectScreen.prototype.showGallery = function() {
  this.showTemplate('gallery');
  this.setOverviewLinks();
  this.setHomeLink();
  this.setClickEvent('link-sphero', this.showSpheroExample);
  this.setClickEvent('link-ev3', this.showEV3Example);
  this.setClickEvent('link-cwc-basic', this.showDrawExample);
  this.setClickEvent('link-cwc-html', this.showHTMLExample);
  this.setClickEvent('link-pencil-code', this.showPencilCodeExample);
  this.setClickEvent('link-home', this.showOverview);
};


/**
 * Shows resources overview.
 */
cwc.ui.SelectScreen.prototype.showResources = function() {
  this.showTemplate('resources');
  this.setOverviewLinks();
  this.setHomeLink();
  this.setClickEvent('link-cwc-video-1', this.showVideo1);
  this.setClickEvent('link-cwc-video-2', this.showVideo2);
  this.setClickEvent('link-cwc-video-3', this.showVideo3);
  this.setClickEvent('link-cwc-video-4', this.showVideo4);
  this.setClickEvent('link-home', this.showOverview);
};


/**
 * Set the link events for the overview links.
 */
cwc.ui.SelectScreen.prototype.setOverviewLinks = function() {
  this.setClickEvent('link-blocks', this.showBlocks);
  this.setClickEvent('link-code', this.showCode);
  this.setClickEvent('link-gallery', this.showGallery);
  this.setClickEvent('link-resources', this.showResources);
};


/**
 * Set the link events for the home links.
 */
cwc.ui.SelectScreen.prototype.setHomeLink = function() {
  this.setClickEvent('link-home', this.showOverview);
};


/** Loads a new Coding with Chrome Blockly file */
cwc.ui.SelectScreen.prototype.newCwcBlockly = function() {
  this.newFile(cwc.file.Type.BASIC_BLOCKLY);
};


/** Loads a new Coding with Chrome Basic files */
cwc.ui.SelectScreen.prototype.newCwcBasic = function() {
  this.newFile(cwc.file.Type.BASIC);
};


/** Loads a new Coding with Chrome Advanced file */
cwc.ui.SelectScreen.prototype.newCwcAdvanced = function() {
  this.newFile(cwc.file.Type.BASIC_ADVANCED);
};


/** Loads a new EV3 file */
cwc.ui.SelectScreen.prototype.newEV3 = function() {
  this.newFile(cwc.file.Type.EV3);
};


/** Loads a new EV3 Blockly file */
cwc.ui.SelectScreen.prototype.newEV3Blockly = function() {
  this.newFile(cwc.file.Type.EV3_BLOCKLY);
};


/** Loads a new Sphero file */
cwc.ui.SelectScreen.prototype.newSphero = function() {
  this.newFile(cwc.file.Type.SPHERO);
};


/** Loads a new Sphero Blockly file */
cwc.ui.SelectScreen.prototype.newSpheroBlockly = function() {
  this.newFile(cwc.file.Type.SPHERO_BLOCKLY);
};


/** Loads a new coffeescript file */
cwc.ui.SelectScreen.prototype.newCoffeescript = function() {
  this.newFile(cwc.file.Type.COFFEESCRIPT);
};


/** Loads a new coffeescript file */
cwc.ui.SelectScreen.prototype.newPencilCode = function() {
  this.newFile(cwc.file.Type.PENCIL_CODE);
};


/** Loads a new Arduino file */
cwc.ui.SelectScreen.prototype.newArduino = function() {
  this.newFile(cwc.file.Type.ARDUINO);
};


/** Loads a EV3 example */
cwc.ui.SelectScreen.prototype.showEV3Example = function() {
  this.loadExample('../../resources/examples/ev3/Line-follow-EV3.cwc');
};


/** Loads a Sphero example */
cwc.ui.SelectScreen.prototype.showSpheroExample = function() {
  this.loadExample('../../resources/examples/sphero/Sphero-example.cwc');
};


/** Loads a Drawing example */
cwc.ui.SelectScreen.prototype.showDrawExample = function() {
  this.loadExample('../../resources/examples/simple/Basic-draw-example.cwc');
};


/** Loads a HTML example */
cwc.ui.SelectScreen.prototype.showHTMLExample = function() {
  this.loadExample('../../resources/examples/html5/Basic-formular.cwc');
};


/** Loads a Pencil Code example */
cwc.ui.SelectScreen.prototype.showPencilCodeExample = function() {
  this.loadExample('../../resources/examples/pencil_code/Turtle-catch.cwc');
};


/** Shows an example video */
cwc.ui.SelectScreen.prototype.showVideo1 = function() {
  window.open('https://www.youtube.com/watch?v=Cbpug5Atmmo');
};


/** Shows an example video */
cwc.ui.SelectScreen.prototype.showVideo2 = function() {
  window.open('https://www.youtube.com/watch?v=S3DhDiw0pXs');
};


/** Shows an example video */
cwc.ui.SelectScreen.prototype.showVideo3 = function() {
  window.open('https://www.youtube.com/watch?v=R4XE3GW1EUc');
};


/** Shows an example video */
cwc.ui.SelectScreen.prototype.showVideo4 = function() {
  window.open('https://www.youtube.com/watch?v=CkoJWKWIWFU');
};


/**
 * Creates a new file of the given type.
 * @param {cwc.file.Type} type
 */
cwc.ui.SelectScreen.prototype.newFile = function(type) {
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
 * Loads example file into editor.
 * @param {string} file_name Example file name to load.
 * @private
 */
cwc.ui.SelectScreen.prototype.loadExample = function(file_name) {
  var loaderInstance = this.helper.getInstance('fileLoader');
  if (loaderInstance) {
    loaderInstance.loadExampleFile(file_name);
  }
  var editorWindow = chrome.app.window.get('editor');
  if (editorWindow) {
    editorWindow.clearAttention();
  }
};


/**
 * Shows the tutorial screen.
 */
cwc.ui.SelectScreen.prototype.showTutorial = function() {
  var tutorialInstance = this.helper.getInstance('tutorial');
  if (tutorialInstance) {
    tutorialInstance.showTutorialScreen();
  }
};


/**
 * @param {!string} template_name
 */
cwc.ui.SelectScreen.prototype.showTemplate = function(template_name) {
  if (this.nodeContent && template_name) {
    var templateConfig = {'prefix': this.prefix};
    goog.soy.renderElement(this.nodeContent,
        cwc.soy.SelectScreen[template_name], templateConfig);
  } else {
    console.error('Unable to render template', template_name);
  }
};


/**
 * Adds the click event for the given name and the given function.
 * @param {!string} name
 * @param {!function()} event
 * @param {string=} opt_prefix
 * @return {function()}
 */
cwc.ui.SelectScreen.prototype.setClickEvent = function(name, event,
    opt_prefix) {
  var prefix = opt_prefix || this.prefix;
  var elementName = prefix + name;
  var element = goog.dom.getElement(elementName);
  if (!element) {
    console.error('Was not able to find element ' + elementName + '!');
    return;
  }

  return goog.events.listen(element, goog.events.EventType.CLICK,
      event, false, this);
};
