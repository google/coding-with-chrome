/**
 * @fileoverview Loading screen for the different coding modes and formats.
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
goog.provide('cwc.ui.LoadingScreen');

goog.require('cwc.soy.ui.LoadingScreen');
goog.require('cwc.utils.Logger');

goog.require('goog.soy');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 */
cwc.ui.LoadingScreen = function(helper) {
  /** @type {string} */
  this.name = 'Loading Screen';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('loading-screen');

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeProgressBar = null;

  /** @type {Element} */
  this.nodeProgressText = null;

  /** @type {Element} */
  this.nodeVersion = null;

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * Decorates the loading Screen
 */
cwc.ui.LoadingScreen.prototype.decorate = function() {
  let node = goog.dom.getElement('cwc-loading-screen-progress');
  goog.soy.renderElement(node, cwc.soy.ui.LoadingScreen.template, {
    'prefix': this.prefix,
  });
  this.nodeProgressText = goog.dom.getElement(this.prefix + 'progress-text');
  this.nodeVersion = goog.dom.getElement(this.prefix + 'version');
  if (typeof window.componentHandler !== 'undefined') {
    window.componentHandler.upgradeDom();
  }
};


/**
 * @param {boolean} show
 */
cwc.ui.LoadingScreen.prototype.show = function(show) {
  goog.style.showElement(goog.dom.getElement('cwc-loading-screen'), show);
};


/**
 * @param {!string} text
 * @param {!number} current
 * @param {number?} total
 */
cwc.ui.LoadingScreen.prototype.setProgress = function(text, current,
    total = 100) {
  let percent = Math.round((100 / total) * current);
  this.log_.info('[', percent + '%', ']', text);
  goog.dom.setTextContent(this.nodeProgressText, text);
  let className = '#' + this.prefix + 'progress-bar.mdl-js-progress';
  document.querySelector(className)['MaterialProgress']['setProgress'](percent);
};
