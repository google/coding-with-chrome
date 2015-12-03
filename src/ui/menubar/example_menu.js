/**
 * @fileoverview Example menu for the Coding with Chrome editor.
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
goog.provide('cwc.ui.ExampleMenu');

goog.require('cwc.ui.Helper');
goog.require('cwc.utils.Helper');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.ui.ExampleMenu = function(helper) {
  /** @type {cwc.utils.Helper} */
  this.helper = helper;
};


/**
 * Decorates the help menu.
 * @param {goog.ui.PopupMenu} menu
 * @export
 */
cwc.ui.ExampleMenu.prototype.decorate = function(menu) {
  if (!menu) {
    console.log('Was not able to decorate example menu!');
    return;
  }

  var mainMenu = new goog.ui.SubMenu('Examples');
  var mainMenuGeneral = new goog.ui.SubMenu('General');
  var mainMenuEV3 = new goog.ui.SubMenu('EV3');

  /** Coding with Chrome Examples */
  var submenuText = new goog.ui.SubMenu('Text');
  var menuTextBasic = cwc.ui.Helper.getMenuItem('Basic Text',
      this.loadExampleTextBasic, this);
  var menuTextCalculation = cwc.ui.Helper.getMenuItem('Calculation',
      this.loadExampleTextCalculation, this);
  submenuText.addItem(menuTextBasic);
  submenuText.addItem(menuTextCalculation);
  mainMenuGeneral.addItem(submenuText);

  var submenuDraw = new goog.ui.SubMenu('Drawing');
  var menuDrawLine = cwc.ui.Helper.getMenuItem('Basic Lines',
      this.loadExampleDrawLine, this);
  var menuDrawCircle = cwc.ui.Helper.getMenuItem('Basic Circle',
      this.loadExampleDrawCircle, this);
  var menuDrawPoints = cwc.ui.Helper.getMenuItem('Basic Points',
      this.loadExampleDrawPoints, this);
  var menuDrawRectangle = cwc.ui.Helper.getMenuItem('Basic Rectangle',
      this.loadExampleDrawRectangle, this);
  var menuDrawEllipse = cwc.ui.Helper.getMenuItem('Basic Ellipse',
      this.loadExampleDrawEllipse, this);
  var menuDrawTriangle = cwc.ui.Helper.getMenuItem('Basic Triangle',
      this.loadExampleDrawTriangle, this);
  var menuDrawPortalTurret = cwc.ui.Helper.getMenuItem('Portal Turret',
      this.loadExampleDrawPortalTurret, this);
  submenuDraw.addItem(menuDrawLine);
  submenuDraw.addItem(menuDrawCircle);
  submenuDraw.addItem(menuDrawPoints);
  submenuDraw.addItem(menuDrawRectangle);
  submenuDraw.addItem(menuDrawEllipse);
  submenuDraw.addItem(menuDrawTriangle);
  submenuDraw.addItem(menuDrawPortalTurret);
  mainMenuGeneral.addItem(submenuDraw);

  var submenuLoop = new goog.ui.SubMenu('Loops');
  var menuLoopBasic = cwc.ui.Helper.getMenuItem('Basic Loop',
      this.loadExampleLoopBasic, this);
  var menuLoopPoint = cwc.ui.Helper.getMenuItem('Loop with Point',
      this.loadExampleLoopPoint, this);
  var menuLoopLine = cwc.ui.Helper.getMenuItem('Loop with Line',
      this.loadExampleLoopLine, this);
  var menuLoopLibraryImage = cwc.ui.Helper.getMenuItem(
      'Loop with Library Images', this.loadExampleLoopLibraryImage, this);
  submenuLoop.addItem(menuLoopBasic);
  submenuLoop.addItem(menuLoopPoint);
  submenuLoop.addItem(menuLoopLine);
  submenuLoop.addItem(menuLoopLibraryImage);
  mainMenuGeneral.addItem(submenuLoop);

  var submenuForm = new goog.ui.SubMenu('Forms');
  var menuFormBasic = cwc.ui.Helper.getMenuItem('Basic Form',
      this.loadExampleFormBasic, this);
  submenuForm.addItem(menuFormBasic);
  mainMenuGeneral.addItem(submenuForm);

  var submenuMisc = new goog.ui.SubMenu('Misc');
  var menuMiscPlaceholder = cwc.ui.Helper.getMenuItem('...');
  submenuMisc.addItem(menuMiscPlaceholder);
  mainMenuGeneral.addItem(submenuMisc);

  /** EV3 Examples */
  var submenuEV3Move = new goog.ui.SubMenu('Movements');
  var menuEV3MoveBasic = cwc.ui.Helper.getMenuItem('Basic Movements');
  submenuEV3Move.addItem(menuEV3MoveBasic);
  mainMenuEV3.addItem(submenuEV3Move);

  mainMenu.addItem(mainMenuGeneral);
  mainMenu.addItem(mainMenuEV3);
  menu.addChild(new goog.ui.Separator, true);
  menu.addChild(mainMenu, true);
};


/**
 * Loads example file into editor.
 * @param {string} file_name Example file name to load.
 * @private
 */
cwc.ui.ExampleMenu.prototype.loadExampleFile_ = function(file_name) {
  var loaderInstance = this.helper.getInstance('fileLoader');
  if (loaderInstance) {
    loaderInstance.loadExampleFile(file_name);
    //this.menuSave.setEnabled(false);
  }
};


/**
 * Loads the example text basic file.
 */
cwc.ui.ExampleMenu.prototype.loadExampleTextBasic = function() {
  this.loadExampleFile_('../../examples/cwc/TextBasic.cwc');
};


/**
 * Loads the example text calculation file.
 */
cwc.ui.ExampleMenu.prototype.loadExampleTextCalculation = function() {
  this.loadExampleFile_('../../examples/cwc/TextCalculation.cwc');
};


/**
 * Loads the example draw line file.
 */
cwc.ui.ExampleMenu.prototype.loadExampleDrawLine = function() {
  this.loadExampleFile_('../../examples/cwc/DrawLine.cwc');
};


/**
 * Loads the example draw circle file.
 */
cwc.ui.ExampleMenu.prototype.loadExampleDrawCircle = function() {
  this.loadExampleFile_('../../examples/cwc/DrawCircle.cwc');
};


/**
 * Loads the example draw points file.
 */
cwc.ui.ExampleMenu.prototype.loadExampleDrawPoints = function() {
  this.loadExampleFile_('../../examples/cwc/DrawPoint.cwc');
};


/**
 * Loads the example draw rectangle file.
 */
cwc.ui.ExampleMenu.prototype.loadExampleDrawRectangle = function() {
  this.loadExampleFile_('../../examples/cwc/DrawRectangle.cwc');
};


/**
 * Loads the example text draw ellipse file.
 */
cwc.ui.ExampleMenu.prototype.loadExampleDrawEllipse = function() {
  this.loadExampleFile_('../../examples/cwc/DrawEllipse.cwc');
};


/**
 * Loads the example draw triangle file.
 */
cwc.ui.ExampleMenu.prototype.loadExampleDrawTriangle = function() {
  this.loadExampleFile_('../../examples/cwc/DrawTriangle.cwc');
};


/**
 * Loads the example draw portal turret file.
 */
cwc.ui.ExampleMenu.prototype.loadExampleDrawPortalTurret = function() {
  this.loadExampleFile_('../../examples/cwc/DrawPortalTurret.cwc');
};


/**
 * Loads the example loop basic file.
 */
cwc.ui.ExampleMenu.prototype.loadExampleLoopBasic = function() {
  this.loadExampleFile_('../../examples/cwc/LoopBasic.cwc');
};


/**
 * Loads the example loop point file.
 */
cwc.ui.ExampleMenu.prototype.loadExampleLoopPoint = function() {
  this.loadExampleFile_('../../examples/cwc/LoopPoint.cwc');
};


/**
 * Loads the example loop line file.
 */
cwc.ui.ExampleMenu.prototype.loadExampleLoopLine = function() {
  this.loadExampleFile_('../../examples/cwc/LoopLine.cwc');
};


/**
 * Loads the example loop library file.
 */
cwc.ui.ExampleMenu.prototype.loadExampleLoopLibraryImage = function() {
  this.loadExampleFile_('../../examples/cwc/LoopLibraryImage.cwc');
};


/**
 * Loads the example form basic file.
 */
cwc.ui.ExampleMenu.prototype.loadExampleFormBasic = function() {
  this.loadExampleFile_('../../examples/cwc/FormBasic.cwc');
};
