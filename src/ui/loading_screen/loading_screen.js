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
 * @param {Function=} scope
 * @constructor
 * @struct
 */
cwc.ui.LoadingScreen = function(helper, scope) {
  /** @type {string} */
  this.name = 'Loading Screen';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('loading-screen');

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeProgressError = null;

  /** @type {Element} */
  this.nodeProgressBar = null;

  /** @type {Element} */
  this.nodeProgressText = null;

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);

  /** @private {Function} */
  this.scope_ = scope;

  /** @private {number} */
  this.current_ = 0;
};


/**
 * Decorates the loading Screen
 */
cwc.ui.LoadingScreen.prototype.decorate = function() {
  let nodeProgress = goog.dom.getElement(this.prefix + 'progress');
  if (nodeProgress) {
    goog.soy.renderElement(nodeProgress, cwc.soy.ui.LoadingScreen.template, {
      'prefix': this.prefix,
    });
    this.nodeProgressError = goog.dom.getElement(
      this.prefix + 'progress-error');
    this.nodeProgressText = goog.dom.getElement(this.prefix + 'progress-text');
    if (typeof window.componentHandler !== 'undefined') {
      window.componentHandler.upgradeDom();
    }
  }

  let nodeClose = goog.dom.getElement(this.prefix + 'close');
  if (nodeClose) {
    nodeClose.addEventListener('click', function() {
      chrome.app.window.current()['close']();
    });
  }

  let nodeVersion = goog.dom.getElement(this.prefix + 'info-version');
  if (nodeVersion) {
    goog.dom.setTextContent(nodeVersion, this.helper.getAppVersion());
  }
};


/**
 * @param {boolean} visible
 */
cwc.ui.LoadingScreen.prototype.show = function(visible) {
  let nodeLoadingScreen = goog.dom.getElement('cwc-loading-screen');
  if (nodeLoadingScreen) {
    goog.style.showElement(nodeLoadingScreen, visible);
  }
};


/**
 * @param {!number} msec
 */
cwc.ui.LoadingScreen.prototype.hideSecondsAfterStart = function(msec) {
  let startTime = Math.floor(performance.now());
  let nodeTime = goog.dom.getElement(this.prefix + 'info-rendered');
  if (nodeTime) {
    goog.dom.setTextContent(nodeTime, startTime);
  }
  window.setTimeout(function() {
      this.show(false);
  }.bind(this), startTime <= msec ? msec - startTime : 500);
};


/**
 * @param {!string} text
 */
cwc.ui.LoadingScreen.prototype.setError = function(text) {
  if (this.nodeProgressError) {
    goog.dom.setTextContent(this.nodeProgressError, text);
  }
};


/**
 * @param {!string} text
 * @param {!number} current
 * @param {number?} total
 */
cwc.ui.LoadingScreen.prototype.setProgress = function(text, current,
    total = 100) {
  this.current_ = current;
  let percent = Math.round((100 / total) * current);
  this.log_.info('[', percent + '%', ']', text);
  if (this.nodeProgressText) {
    goog.dom.setTextContent(this.nodeProgressText, text);
    let className = '#' + this.prefix + 'progress-bar.mdl-js-progress';
    document.querySelector(className)['MaterialProgress']['setProgress'](
      percent);
  }
};


/**
 * @param {!string} text
 * @param {!Function} func
 * @param {number=} steps
 * @return {Function|Promise}
 */
cwc.ui.LoadingScreen.prototype.setProgressFunc = function(text, func,
    steps = 4) {
  this.current_ += steps;
  this.setProgress(text, this.current_);
  try {
    if (this.scope_) {
      return func.bind(this.scope_)();
    } else {
      return func();
    }
  } catch (error) {
    this.setError('ERROR: ' + error.message);
    throw error;
  }
};


/**
 * @param {!string} language
 */
cwc.ui.LoadingScreen.prototype.setUserLangauge = function(language) {
  let nodeLanguage = goog.dom.getElement(this.prefix + 'info-language');
  if (nodeLanguage) {
    goog.dom.setTextContent(nodeLanguage, language);
  }
};
