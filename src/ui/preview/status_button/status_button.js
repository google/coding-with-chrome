/**
 * @fileoverview Status button.
 *
 * @license Copyright 2018 The Coding with Chrome Authors.
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
goog.provide('cwc.ui.PreviewStatusButton');

goog.require('cwc.soy.ui.PreviewStatusButton');
goog.require('cwc.ui.PreviewState');
goog.require('cwc.utils.Logger');
goog.require('cwc.utils.Events');


/**
 * Class represents the statusbar inside the ui.
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.PreviewStatusButton = function(helper) {
  /** @type {string} */
  this.name = 'Preview Status Button';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('preview-status-button');

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeBrowser = null;

  /** @type {Element} */
  this.nodeStatus = null;

  /** @type {Element} */
  this.nodeRun = null;

  /** @type {Element} */
  this.nodeStop = null;

  /** @type {Element} */
  this.nodeReload = null;

    /** @type {Element} */
  this.nodeTerminate = null;

  /** @type {Element} */
  this.nodeFullscreen = null;

  /** @type {Element} */
  this.nodeFullscreenExit = null;

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, this.prefix);

  /** @private {!cwc.utils.Logger|null} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * Decorates the given node and adds the status button to the ui.
 * @param {Element} node The target node to add the status bar.
 * @return {THIS}
 * @template THIS
 */
cwc.ui.PreviewStatusButton.prototype.decorate = function(node) {
  this.node = node;
  if (!this.node) {
    this.log_.error('Invalid Status node:', this.node);
    return;
  }

  goog.soy.renderElement(
      this.node,
      cwc.soy.ui.PreviewStatusButton.template, {
        'prefix': this.prefix,
      }
  );

  // Default nodes
  this.nodeBrowser = goog.dom.getElement(this.prefix + 'browser');
  this.nodeFullscreen = goog.dom.getElement(this.prefix + 'fullscreen');
  this.nodeFullscreenExit =
    goog.dom.getElement(this.prefix + 'fullscreen_exit');
  this.nodeReload = goog.dom.getElement(this.prefix + 'reload');
  this.nodeTerminate = goog.dom.getElement(this.prefix + 'terminate');
  this.nodeRun = goog.dom.getElement(this.prefix + 'run');
  this.nodeStop = goog.dom.getElement(this.prefix + 'stop');

  goog.style.setElementShown(this.nodeBrowser, false);
  goog.style.setElementShown(this.nodeFullscreen, false);
  goog.style.setElementShown(this.nodeFullscreenExit, false);
  goog.style.setElementShown(this.nodeReload, false);
  goog.style.setElementShown(this.nodeTerminate, false);
  goog.style.setElementShown(this.nodeRun, true);
  goog.style.setElementShown(this.nodeStop, false);

  if (typeof window.componentHandler !== 'undefined') {
    window.componentHandler.upgradeDom();
  }

  return this;
};


/**
 * @param {function(?)} func
 * @return {THIS}
 * @template THIS
 */
cwc.ui.PreviewStatusButton.prototype.setBrowserAction = function(func) {
  goog.style.setElementShown(this.nodeBrowser, true);
  this.events_.listen('browser-action', goog.events.EventType.CLICK, func);
  return this;
};


/**
 * @param {function(?)} func
 * @return {THIS}
 * @template THIS
 */
cwc.ui.PreviewStatusButton.prototype.setFullscreenAction = function(func) {
  goog.style.setElementShown(this.nodeFullscreen, true);
  this.events_.listen('fullscreen-action', goog.events.EventType.CLICK, func);
  this.events_.listen('fullscreen-action', goog.events.EventType.CLICK, () => {
    goog.style.setElementShown(this.nodeFullscreenExit, true);
    goog.style.setElementShown(this.nodeFullscreen, false);
  });
  return this;
};


/**
 * @param {function(?)} func
 * @return {THIS}
 * @template THIS
 */
cwc.ui.PreviewStatusButton.prototype.setFullscreenExitAction = function(func) {
  this.events_.listen('fullscreen_exit-action', goog.events.EventType.CLICK,
    func);
  this.events_.listen('fullscreen_exit-action', goog.events.EventType.CLICK,
    () => {
      goog.style.setElementShown(this.nodeFullscreen, true);
      goog.style.setElementShown(this.nodeFullscreenExit, false);
  });
  return this;
};


/**
 * @param {function(?)} func
 * @return {THIS}
 * @template THIS
 */
cwc.ui.PreviewStatusButton.prototype.setReloadAction = function(func) {
  goog.style.setElementShown(this.nodeReload, true);
  this.events_.listen('reload-action', goog.events.EventType.CLICK, func);
  return this;
};


/**
 * @param {function(?)} func
 * @return {THIS}
 * @template THIS
 */
cwc.ui.PreviewStatusButton.prototype.setTerminateAction = function(func) {
  goog.style.setElementShown(this.nodeTerminate, true);
  this.events_.listen('terminate-action', goog.events.EventType.CLICK, func);
  return this;
};


/**
 * @param {function(?)} func
 * @return {THIS}
 * @template THIS
 */
cwc.ui.PreviewStatusButton.prototype.setRunAction = function(func) {
  this.events_.listen('run-button', goog.events.EventType.CLICK, func);
  return this;
};


/**
 * @param {function(?)} func
 * @return {THIS}
 * @template THIS
 */
cwc.ui.PreviewStatusButton.prototype.setStopAction = function(func) {
  this.events_.listen('stop-button', goog.events.EventType.CLICK, func);
  return this;
};


/**
 * Sets the status message.
 * @param {!cwc.ui.PreviewState} status
 */
cwc.ui.PreviewStatusButton.prototype.setStatus = function(status) {
  // Terminate button
  switch (status) {
    case cwc.ui.PreviewState.TERMINATED:
      this.enableButton('terminate-action', false);
      break;
    case cwc.ui.PreviewState.LOADED:
    case cwc.ui.PreviewState.LOADING:
    case cwc.ui.PreviewState.PREPARE:
    case cwc.ui.PreviewState.REFRESHING:
    case cwc.ui.PreviewState.STOPPED:
      this.enableButton('terminate-action', true);
      break;
  }

  // Reload button
  switch (status) {
    case cwc.ui.PreviewState.LOADED:
    case cwc.ui.PreviewState.STOPPED:
      this.enableButton('reload-action', true);
      break;
    case cwc.ui.PreviewState.LOADING:
    case cwc.ui.PreviewState.PREPARE:
    case cwc.ui.PreviewState.REFRESHING:
    case cwc.ui.PreviewState.TERMINATED:
      this.enableButton('reload-action', false);
      break;
  }

  // Run and Stop button
  switch (status) {
    case cwc.ui.PreviewState.STOPPED:
    case cwc.ui.PreviewState.TERMINATED:
      goog.style.setElementShown(this.nodeRun, true);
      goog.style.setElementShown(this.nodeStop, false);
      break;
    case cwc.ui.PreviewState.LOADING:
    case cwc.ui.PreviewState.PREPARE:
    case cwc.ui.PreviewState.REFRESHING:
      goog.style.setElementShown(this.nodeRun, false);
      goog.style.setElementShown(this.nodeStop, true);
      break;
  }
};


/**
 * @param {!string} id
 * @param {boolean} enabled
 */
cwc.ui.PreviewStatusButton.prototype.enableButton = function(id, enabled) {
  cwc.ui.Helper.enableElement(this.prefix + id, enabled);
};
