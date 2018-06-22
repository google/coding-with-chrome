/**
 * @fileoverview Help for the Coding with Chrome editor.
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
goog.provide('cwc.ui.Help');

goog.require('cwc.soy.Help');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 */
cwc.ui.Help = function(helper) {
  /** @type {string} */
  this.name = 'Help';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('help');

  /** @private {boolean} */
  this.chromeApp_ = this.helper.checkChromeFeature('app');
};


cwc.ui.Help.prototype.showAbout = function() {
  let dialogInstance = this.helper.getInstance('dialog');
  dialogInstance.showTemplate('About Coding with Chrome', cwc.soy.Help.about, {
    prefix: this.prefix,
    manifest: this.helper.getManifest(),
  });
  let noticeLink = goog.dom.getElement(this.prefix + 'notice-link');
  noticeLink.addEventListener('click', this.showOpenSource.bind(this));
};


cwc.ui.Help.prototype.showIntro = function() {
  let dialogInstance = this.helper.getInstance('dialog');
  dialogInstance.showTemplate('Intro', cwc.soy.Help.intro, {
    prefix: this.prefix});
};


cwc.ui.Help.prototype.showOpenSource = function() {
  let dialogInstance = this.helper.getInstance('dialog');
  dialogInstance.showTemplate('Coding with Chrome credits',
    cwc.soy.Help.notice, {
      prefix: this.prefix,
      is_chrome_app: this.chromeApp_,
    });
  let noticeWebview = goog.dom.getElement(this.prefix + 'webview-notice');
  noticeWebview.addEventListener('contentload', function() {
    noticeWebview['insertCSS']({'code': 'html {overflow-y: scroll;}'});
  });
};


cwc.ui.Help.prototype.showHelp = function() {
  let dialogInstance = this.helper.getInstance('dialog');
  dialogInstance.showTemplate('Help', cwc.soy.Help.help,
    {'prefix': this.prefix});
};


/**
 * Shows some debug information.
 * @param {Event=} opt_event
 */
cwc.ui.Help.prototype.showDebug = function(opt_event) {
  let layoutInstance = this.helper.getInstance('layout', true);
  let debugInstance = this.helper.getInstance('debug', true);
  let overlayNode = layoutInstance.getOverlay();
  debugInstance.decorate(overlayNode);
  layoutInstance.showOverlay(true);
};
