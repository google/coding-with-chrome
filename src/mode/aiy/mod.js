/**
 * @fileoverview AIY modifications.
 *
 * @license Copyright 2018 Google Inc. All Rights Reserved.
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
 * @author fstanis@google.com (Filip Stanis)
 */
goog.provide('cwc.mode.aiy.Mod');

goog.require('cwc.mode.aiy.Connection');
goog.require('cwc.mode.aiy.Toolbar');
goog.require('cwc.mode.aiy.Editor');
goog.require('cwc.mode.aiy.Layout');
goog.require('cwc.mode.default.Mod');
goog.require('cwc.mode.aiy.Runner');
goog.require('cwc.ui.Console');
goog.require('cwc.utils.Helper');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.aiy.Mod = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.mode.aiy.Layout} */
  this.layout = new cwc.mode.aiy.Layout(helper);

  /** @type {!cwc.mode.aiy.Editor} */
  this.editor = new cwc.mode.aiy.Editor(helper);

  /** @type {!cwc.ui.Console} */
  this.console = new cwc.ui.Console(helper);

  /** @type {!cwc.mode.aiy.Connection} */
  this.connection = new cwc.mode.aiy.Connection(helper);

  /** @type {!cwc.mode.aiy.Toolbar} */
  this.toolbar = new cwc.mode.aiy.Toolbar(helper);

  /** @type {!cwc.mode.aiy.Runner} */
  this.runner = new cwc.mode.aiy.Runner(helper, this.connection);
};


/**
 * Decorates the different parts of the modification.
 * @async
 */
cwc.mode.aiy.Mod.prototype.decorate = function() {
  this.layout.decorate();
  this.editor.decorate();
  this.decorateConsole();
  this.runner.init();

  this.toolbar.on('run', this.run.bind(this));
};


/**
 * Decorates console
 */
cwc.mode.aiy.Mod.prototype.decorateConsole = async function() {
  this.helper.setInstance('console', this.console, true);
  await this.console.decorate();
  this.console.showConsole(true);
};


/**
 * Run code
 */
cwc.mode.aiy.Mod.prototype.run = function() {
  this.runner.run();
};
