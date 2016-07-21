/**
 * @fileoverview Dialog for the Coding with Chrome editor.
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
goog.provide('cwc.utils.Dialog');
goog.provide('cwc.utils.DialogType');

goog.require('cwc.soy.Dialog');

goog.require('goog.style');


/**
 * @enum {string}
 */
cwc.utils.DialogType = {
  CONFIRM: 'confirm',
  ERROR: 'error',
  PROMPT: 'info'
};



/**
 * @constructor
 * @struct
 * @final
 * @export
 */
cwc.utils.Dialog = function() {
  /** @type {!string} */
  this.name = 'Dialog';

  /** @type {!string} */
  this.prefix = 'cwc-dialog-';

  /** @type {Element} */
  this.dialog = null;

  /** @type {Element} */
  this.node = document.body || document.getElementsByTagName('body')[0];

  /** @type {Element} */
  this.nodeContent = null;

  /** @type {Element|StyleSheet} */
  this.styleSheet = null;

  /** @private {Function} */
  this.defaultCloseHandler_ = null;

  /** @private {!string} */
  this.prefixDialog_ = this.prefix + 'chrome';

  if (this.node) {
    this.prepare_();
  } else {
    document.addEventListener('DOMContentLoaded', this.prepare_.bind(this),
      false);
  }
};


/**
 * Decorates the given node and adds the dialog.
 * @private
 */
cwc.utils.Dialog.prototype.prepare_ = function() {
  this.node = document.body || document.getElementsByTagName('body')[0];

  if (!this.styleSheet) {
    this.styleSheet = goog.style.installStyles(cwc.soy.Dialog.style({
      prefix: this.prefix }));
  }

  if (!goog.dom.getElement(this.prefixDialog_)) {
    var dialog = goog.soy.renderAsFragment(cwc.soy.Dialog.template, {
      prefix: this.prefix });
    if (this.node && dialog) {
      this.node.appendChild(dialog);
    } else {
      console.error('Unable to add dialog', dialog, 'to node', this.node, '!');
    }
    this.dialog = goog.dom.getElement(this.prefixDialog_);
  }
};


/**
 * @export
 */
cwc.utils.Dialog.prototype.show = function() {
  if (this.dialog) {
    if (!this.dialog.hasAttribute('open')) {
      if (this.dialog.show) {
        this.dialog.show();
      } else {
        this.dialog.setAttribute('open', '');
      }
    }
  }
  this.refresh_();
};


/**
 * @export
 */
cwc.utils.Dialog.prototype.showModal = function() {
  if (this.dialog) {
    if (!this.dialog.hasAttribute('open')) {
      if (this.dialog.showModal) {
        this.dialog.showModal();
      } else {
        this.dialog.setAttribute('open', '');
      }
    }
  }
  this.refresh_();
};


/**
 * @export
 */
cwc.utils.Dialog.prototype.close = function() {
  if (!this.dialog) {
    return;
  }
  if (this.dialog.hasAttribute('open')) {
    while (this.dialog.firstChild) {
      this.dialog.removeChild(this.dialog.firstChild);
    }
    if (this.dialog.close) {
      this.dialog.close();
    } else {
      this.dialog.removeAttribute('open');
    }
  }
};


/**
 * @param {!string} title
 * @param {!string} content
 * @param {Object=} opt_template
 * @param {string=} opt_values
 * @export
 */
cwc.utils.Dialog.prototype.render = function(title, content,
    opt_template, opt_values) {
  if (this.dialog) {
    goog.soy.renderElement(this.dialog,
        opt_template || cwc.soy.Dialog.contentTemplate, {
          prefix: this.prefix,
          title: title,
          content: content,
          values: opt_values });
    this.refresh_();
  }
};


/**
 * @param {!string} title
 * @param {!string} content
 * @export
 */
cwc.utils.Dialog.prototype.showContent = function(title, content) {
  if (this.dialog) {
    this.render(title, content, cwc.soy.Dialog.contentTemplate);
    var closeButton = goog.dom.getElement(this.prefix + 'close');
    closeButton.addEventListener('click', this.close.bind(this));
    this.showModal();
  }
};


/**
 * @param {!string} title
 * @param {!Object} template
 * @param {!Object} values
 * @export
 */
cwc.utils.Dialog.prototype.showTemplate = function(title, template, values) {
  if (this.dialog) {
    this.render(title, '', cwc.soy.Dialog.contentTemplate);
    goog.soy.renderElement(goog.dom.getElement(this.prefix + 'content'),
        template, values);
    var closeButton = goog.dom.getElement(this.prefix + 'close');
    closeButton.addEventListener('click', this.close.bind(this));
    this.showModal();
  }
};


/**
 * @param {!string} title
 * @param {!string} content
 * @param {!Function} func
 * @export
 */
cwc.utils.Dialog.prototype.showYesNo = function(title, content, func) {
  if (this.dialog) {
    this.render(title, content, cwc.soy.Dialog.yesNoTemplate);
    var yesButton = goog.dom.getElement(this.prefix + 'yes');
    yesButton.addEventListener('click', func);
    yesButton.addEventListener('click', this.close.bind(this));
    if (this.defaultCloseHandler_) {
      yesButton.addEventListener('click', this.defaultCloseHandler_);
    }
    var noButton = goog.dom.getElement(this.prefix + 'no');
    noButton.addEventListener('click', this.close.bind(this));
    this.showModal();
  }
};


/**
 * @param {!string} title
 * @param {!string} content
 * @param {!Function} func
 * @param {string=} opt_value
 * @export
 */
cwc.utils.Dialog.prototype.showPrompt = function(title, content, func,
    opt_value) {
  if (this.dialog) {
    this.render(title, content, cwc.soy.Dialog.promptTemplate, opt_value);
    var inputField = goog.dom.getElement(this.prefix + 'input');
    var okButton = goog.dom.getElement(this.prefix + 'ok');
    okButton.addEventListener('click', function() {
      func(inputField.value);
    });
    okButton.addEventListener('click', this.close.bind(this));
    if (this.defaultCloseHandler_) {
      okButton.addEventListener('click', this.defaultCloseHandler_);
    }
    var cancleButton = goog.dom.getElement(this.prefix + 'cancel');
    cancleButton.addEventListener('click', this.close.bind(this));
    this.showModal();
  }
};


/**
 * @param {Function!} func
 * @export
 */
cwc.utils.Dialog.prototype.setDefaultCloseHandler = function(func) {
  this.defaultCloseHandler_ = func;
};


/**
 * @private
 */
cwc.utils.Dialog.prototype.refresh_ = function() {
  if (typeof window.componentHandler !== 'undefined') {
    window.componentHandler.upgradeDom();
  }
};
