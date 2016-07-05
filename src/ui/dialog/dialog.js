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
goog.provide('cwc.ui.Dialog');
goog.provide('cwc.ui.DialogType');

goog.require('cwc.soy.Dialog');
goog.require('cwc.ui.Helper');


/**
 * @enum {string}
 */
cwc.ui.DialogType = {
  CONFIRM: 'confirm',
  ERROR: 'error',
  PROMPT: 'info'
};



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 */
cwc.ui.Dialog = function(helper) {
  /** @type {string} */
  this.name = 'Dialog';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = 'dialog-';

  /** @type {string} */
  this.generalPrefix = this.helper.getPrefix();

  /** @type {Element} */
  this.dialog = null;

  /** @type {Element} */
  this.nodeContent = null;

  /** @type {Element|StyleSheet} */
  this.styleSheet = null;
};


/**
 * Decorates the given node and adds the start screen.
 * @param {Element} node
 * @param {string=} opt_prefix
 */
cwc.ui.Dialog.prototype.decorate = function(node, opt_prefix) {
  this.dialog = node;
  this.prefix = (opt_prefix || '') + this.prefix;

  if (!this.styleSheet) {
    this.styleSheet = goog.style.installStyles(cwc.soy.Dialog.style({
      'prefix': this.prefix }));
  }

  this.nodeContent = goog.dom.getElement(this.prefix + 'content');
};


/**
 * @export
 */
cwc.ui.Dialog.prototype.show = function() {
  if (this.dialog) {
    this.dialog.show();
  }
  cwc.ui.Helper.mdlRefresh();
};


/**
 * @export
 */
cwc.ui.Dialog.prototype.showModal = function() {
  if (this.dialog) {
    if (this.dialog.hasAttribute('open')) {
      this.dialog.show();
    } else {
      this.dialog.showModal();
    }
  }
  cwc.ui.Helper.mdlRefresh();
};


/**
 * @export
 */
cwc.ui.Dialog.prototype.close = function() {
  if (this.dialog && this.dialog.hasAttribute('open')) {
    this.dialog.close();
  }
};


/**
 * @param {!string} title
 * @param {!string} content
 * @param {Object=} opt_template
 * @param {string=} opt_values
 * @export
 */
cwc.ui.Dialog.prototype.render = function(title, content,
    opt_template, opt_values) {
  if (this.dialog) {
    goog.soy.renderElement(this.dialog,
        opt_template || cwc.soy.Dialog.contentTemplate, {
          'prefix': this.prefix,
          'title': title,
          'content': content,
          'values': opt_values });

    if (typeof window.componentHandler !== 'undefined') {
      window.componentHandler.upgradeDom();
    }
  }
};


/**
 * @param {!string} title
 * @param {!string} content
 * @export
 */
cwc.ui.Dialog.prototype.showContent = function(title, content) {
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
cwc.ui.Dialog.prototype.showTemplate = function(title, template, values) {
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
cwc.ui.Dialog.prototype.showYesNo = function(title, content, func) {
  if (this.dialog) {
    this.render(title, content, cwc.soy.Dialog.yesNoTemplate);
    var yesButton = goog.dom.getElement(this.prefix + 'yes');
    yesButton.addEventListener('click', func);
    yesButton.addEventListener('click', this.close.bind(this));
    yesButton.addEventListener('click', function() {
      this.helper.getInstance('navigation').hide();
    }.bind(this));
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
cwc.ui.Dialog.prototype.showPrompt = function(title, content, func, opt_value) {
  if (this.dialog) {
    this.render(title, content, cwc.soy.Dialog.promptTemplate, opt_value);
    var inputField = goog.dom.getElement(this.prefix + 'input');
    var okButton = goog.dom.getElement(this.prefix + 'ok');
    okButton.addEventListener('click', function() {
      func(inputField.value);
    });
    okButton.addEventListener('click', this.close.bind(this));
    okButton.addEventListener('click', function() {
      this.helper.getInstance('navigation').hide();
    }.bind(this));
    var cancleButton = goog.dom.getElement(this.prefix + 'cancel');
    cancleButton.addEventListener('click', this.close.bind(this));
    this.showModal();
  }
};
