/**
 * @fileoverview Dialog for the Coding with Chrome editor.
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
goog.provide('cwc.ui.PreviewDialog');

goog.require('cwc.soy.ui.PreviewDialog');
goog.require('cwc.utils.Logger');
goog.require('goog.dom');
goog.require('goog.style');

/**
 * @param {!string} prefix
 * @param {!string} elementId
 * @constructor
 * @struct
 * @final
 */
cwc.ui.PreviewDialog = function(prefix, elementId) {
  /** {!string} */
  this.name = 'PreviewDialog';

  /** {!string} */
  this.elementId = elementId;

  /** {!string} */
  this.prefix = prefix;

  /** @private {!cwc.utils.Logger|null} */
  this.log_ = new cwc.utils.Logger(this.name);
};

/**
 * @param {!string} message
 * @param {!boolean} isPrompt
 * @return {!string}
 */
cwc.ui.PreviewDialog.prototype.show = function(message, isPrompt) {
  this.log_.info('showing dialog', message, isPrompt, this);
  this.hide();
  return new Promise((resolve, reject) => {
    let element = goog.dom.getElement(this.elementId);
    if (!element) {
      this.log_.error('no element', this.elementId, element);
     return;
    }
    goog.soy.renderElement(element, cwc.soy.ui.PreviewDialog.dialog, {
      prefix: this.prefix,
      message: message,
      isPrompt: isPrompt,
    });
    let okButton = goog.dom.getElement(`${this.prefix}-ok`);
    okButton.addEventListener('click', () => {
      this.log_.info('User clicked OK in dialog');
      if (!isPrompt) {
        resolve();
      } else {
        let input = goog.dom.getElement(`${this.prefix}-input`);
        if (!input) {
          reject('Failed to find input');
        } else {
          resolve(input.value);
        }
      }
      this.hide();
    });

    if (isPrompt) {
      goog.dom.getElement(`${this.prefix}-cancel`).addEventListener('click',
        () => {
          this.log_.info('User canceled dialog');
          reject('user clicked cancel');
          this.hide();
        });

      goog.dom.getElement(`${this.prefix}-input`).addEventListener('keyup',
        (event) => {
          if (event.keyCode == 13) {
            okButton.click();
          }
        });
    }
    goog.style.setElementShown(element, true);
  });
};

/**
 * Hide dialog
 */
cwc.ui.PreviewDialog.prototype.hide = function() {
  goog.style.setElementShown(goog.dom.getElement(this.elementId), false);
};
