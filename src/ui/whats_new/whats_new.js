/**
 * @fileoverview Select screen for the different coding modes and formats.
 *
 * @license Copyright 2019 The Coding with Chrome Authors.
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
 * @author carheden@google.com (Adam Carheden)
 */
goog.provide('cwc.ui.WhatsNew');

goog.require('cwc.soy.ui.WhatsNew');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.Helper');

goog.require('goog.dom');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 */
cwc.ui.WhatsNew = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('whats_new');

  /** @private {boolean} */
  this.chromeApp_ = this.helper.checkChromeFeature('app');

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, this.prefix, this);
};


/**
 * Conditionally shows the changelog if it hasn't been shown for this version
 * yet and if the user hasn't disabling showing it for new versions.
 */
cwc.ui.WhatsNew.prototype.showWhatsNewScreen = function() {
  let userConfigInstance = this.helper.getInstance('userConfig');
  if (!userConfigInstance) {
    console.error('Failed to get user config instance');
    return;
  }

  if (userConfigInstance.get(cwc.userConfigType.GENERAL,
        cwc.userConfigName.SKIP_WHATS_NEW)) {
    return;
  }

  let version = this.helper.getAppVersion();
  if (userConfigInstance.get(cwc.userConfigType.GENERAL,
    cwc.userConfigName.LAST_WHATS_NEW_VERSION) >= version) {
    return;
  }

  // Flag that we've show What's New for this version
  if (userConfigInstance) {
    userConfigInstance.set(cwc.userConfigType.GENERAL,
      cwc.userConfigName.LAST_WHATS_NEW_VERSION, version);
  }
  this.showChangeLog();
};


cwc.ui.WhatsNew.prototype.showChangeLog = function() {
  let dialogInstance = this.helper.getInstance('dialog');
  dialogInstance.showTemplate('Coding with Chrome Changelog',
    cwc.soy.ui.WhatsNew.template, {
      prefix: this.prefix,
      is_chrome_app: this.chromeApp_,
    });
  let changelogWebview = goog.dom.getElement(this.prefix + 'webview-changelog');
  changelogWebview.addEventListener('contentload', function() {
    changelogWebview['insertCSS']({'code': 'html {overflow-y: scroll;}'});
  });
  let checkbox = goog.dom.getElement(this.prefix + 'checkbox');
  if (!checkbox) {
    return;
  }

  this.events_.clear();

  let userConfigInstance = this.helper.getInstance('userConfig');
  if (userConfigInstance.get(cwc.userConfigType.GENERAL,
    cwc.userConfigName.SKIP_WHATS_NEW)) {
    checkbox.parentNode['MaterialCheckbox']['uncheck']();
  } else {
    checkbox.parentNode['MaterialCheckbox']['check']();
  }
  this.events_.listen(checkbox, goog.events.EventType.CHANGE, () => {
    userConfigInstance.set(cwc.userConfigType.GENERAL,
    cwc.userConfigName.SKIP_WHATS_NEW, !checkbox.checked);
  });
};
