/**
 * @fileoverview UI Infobar for the Coding with Chrome editor.
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
goog.provide('cwc.ui.Infobar');

goog.require('cwc.utils.Events');
goog.require('cwc.ui.Helper');


/**
 * @constructor
 * @struct
 * @final
 */
cwc.ui.Infobar = function() {
  /** @type {string} */
  this.name = 'Notification';

  /** @type {string} */
  this.prefix = 'cwc_infobar_close';

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, this.prefix, this);
};


/**
 * @export
 */
cwc.ui.Infobar.prototype.refresh = function() {
  let infobars = cwc.ui.Helper.getElements('cwc_infobar_close', 'span');
  infobars.forEach((infobar) => {
    this.events_.listen(infobar, goog.events.EventType.CLICK, this.hideInfobar);
  });
};


/**
 * @param {Event} e
 */
cwc.ui.Infobar.prototype.hideInfobar = function(e) {
  console.log('Infobar', e);
  let infobar = e.target.parentElement;
  infobar.style.opacity = 0;
  setTimeout(() => {
    infobar.parentNode.removeChild(infobar);
  }, 600);
};
