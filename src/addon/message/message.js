/**
 * @fileoverview Message addon
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
 * @author carheden@google.com (Adam Carheden)
 */
goog.provide('cwc.addon.Message');

goog.require('cwc.mode.Modder.Events');
goog.require('cwc.mode.Type');
goog.require('cwc.soy.addon.Message');
goog.require('cwc.ui.SelectScreen.Events');
goog.require('cwc.utils.Logger');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.addon.Message = function(helper) {
  /** @type {string} */
  this.name = 'Message';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('addon-message');

  /** @private {boolean} */
  this.chromeApp_ = this.helper.checkChromeFeature('app');

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


cwc.addon.Message.prototype.prepare = function() {
  if (!this.helper.experimentalEnabled()) {
    return;
  }

  this.log_.info('Preparing message addon ...');

  let modeInstance = this.helper.getInstance('mode');
  if (modeInstance) {
    goog.events.listen(modeInstance.getEventTarget(),
      cwc.mode.Modder.Events.Type.MODE_CHANGE,
      this.eventsModder, false, this);
  }
};


/**
 * @param {Event} e
 */
cwc.addon.Message.prototype.eventsModder = function(e) {
  let mode = e.data.mode;
  let filename = e.data.file;
  this.log_.info('Change Mode', mode, 'for file', filename);
  let file = this.helper.getInstance('file').getFile();
  if (!file) return;
  let content = file.getMetadata('content', 'message');
  let help = file.getMetadata('help', 'message');
  if (content || help) {
    this.log_.info('Adding message pane ...');
    let messageInstance = this.helper.getInstance('message');
    if (!messageInstance) return;
    messageInstance.show(true);
    if (content) {
      messageInstance.renderContent(cwc.soy.addon.Message.message, {
        prefix: this.prefix,
        content: content,
      });
    }
    if (help) {
      messageInstance.renderHelp(cwc.soy.addon.Message.help, {
        prefix: this.prefix,
        help: help,
      });
    }
  }
};
