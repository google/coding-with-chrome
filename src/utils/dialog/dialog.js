/**
 * @fileoverview Dialog for the Coding with Chrome editor.
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
goog.provide('cwc.utils.Dialog');
goog.provide('cwc.utils.DialogType');

goog.require('cwc.soy.Dialog');

goog.require('goog.dom');


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
};


/**
 * @export
 */
cwc.utils.Dialog.prototype.show = function() {
  var dialog = this.getDialog_();
  if (dialog) {
    if (!dialog.hasAttribute('open')) {
      if (dialog.show) {
        dialog.show();
      } else {
        dialog.setAttribute('open', '');
      }
    }
  }
  this.refresh_();
};


/**
 * @export
 */
cwc.utils.Dialog.prototype.showModal = function() {
  var dialog = this.getDialog_();
  if (dialog) {
    if (!dialog.hasAttribute('open')) {
      if (dialog.showModal) {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
    }
  }
  this.refresh_();
};


/**
 * @export
 */
cwc.utils.Dialog.prototype.close = function() {
  var dialog = this.getDialog_();
  if (!dialog) {
    return;
  }
  if (dialog.hasAttribute('open')) {
    while (dialog.firstChild) {
      dialog.removeChild(this.dialog.firstChild);
    }
    if (dialog.close) {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
  }
};


/**
 * @param {!string} title
 * @param {!string} content
 * @param {function ({
 *   content: string,
 *   opt_values: (string|undefined),
 *   prefix: string,
 *   title: string
 * })=} opt_template
 * @param {string=} opt_values
 * @export
 */
cwc.utils.Dialog.prototype.render = function(title, content,
    opt_template, opt_values) {
  var dialog = this.getDialog_();
  if (dialog) {
    goog.soy.renderElement(dialog,
        opt_template || cwc.soy.Dialog.contentTemplate, {
          prefix: this.prefix,
          title: title,
          content: content,
          opt_values: opt_values
        });
    this.refresh_();
  }
};


/**
 * @param {!string} title
 * @param {!string} content
 * @export
 */
cwc.utils.Dialog.prototype.showContent = function(title, content) {
  if (this.getDialog_()) {
    this.render(title, content, cwc.soy.Dialog.contentTemplate);
    var closeButton = goog.dom.getElement(this.prefix + 'close');
    closeButton.addEventListener('click', this.close.bind(this));
    this.showModal();
  }
};


/**
 * @param {!string} title
 * @param {!function (Object, null=, (Object<string,*>|null)=)} template
 * @param {!Object} values
 * @export
 */
cwc.utils.Dialog.prototype.showTemplate = function(title, template, values) {
  if (this.getDialog_()) {
    this.render(title, '', cwc.soy.Dialog.contentTemplate);
    goog.soy.renderElement(goog.dom.getElement(this.prefix + 'content'),
        template, values);
    var closeButton = goog.dom.getElement(this.prefix + 'close');
    closeButton.addEventListener('click', this.close.bind(this));
    this.showModal();
  }
};


/**
 * @param {!function (Object, null=, (Object<string,*>|null)=)} template
 * @param {!Object} values
 * @export
 */
cwc.utils.Dialog.prototype.updateTemplate = function(template, values) {
  if (this.getDialog_()) {
    goog.soy.renderElement(goog.dom.getElement(this.prefix + 'content'),
        template, values);
  }
};


/**
 * @param {!string} id
 * @param {!string} text
 * @param {Function} opt_callback
 * @export
 */
cwc.utils.Dialog.prototype.addButton = function(id, text, opt_callback) {
  var button = goog.dom.createDom(
    'button', {
      'id': this.prefix + id,
      'type': 'button',
      'class': 'mdl-button'
    }, text
  );
  if (opt_callback) {
    button.addEventListener('click', opt_callback);
  }
  var buttonsDiv = goog.dom.getElement(this.prefix + 'buttons');
  goog.dom.appendChild(buttonsDiv, button);
};


cwc.utils.Dialog.prototype.getButton = function(id) {
  return goog.dom.getElement(this.prefix + id);
};


cwc.utils.Dialog.prototype.setButtonText = function(id, text) {
  var button = goog.dom.getElement(this.prefix + id);
  goog.dom.setTextContent(button, text);
};


/**
 * @param {!string} title
 * @param {!string} content
 * @export
 */
cwc.utils.Dialog.prototype.showAlert = function(title, content) {
  return new Promise((resolve, reject) => {
    if (this.getDialog_()) {
      this.render(title, content, cwc.soy.Dialog.alertTemplate);
      var okButton = goog.dom.getElement(this.prefix + 'ok');
      okButton.addEventListener('click', this.close.bind(this));
      if (this.defaultCloseHandler_) {
        okButton.addEventListener('click', this.defaultCloseHandler_);
      }
      okButton.addEventListener('click', function() {
        resolve(true);
      });
      this.showModal();
    } else {
      reject();
    }
  });
};


/**
 * @param {!string} title
 * @param {!string} content
 * @param {string=} opt_value
 * @export
 */
cwc.utils.Dialog.prototype.showPrompt = function(title, content, opt_value) {
  return new Promise((resolve, reject) => {
    if (this.getDialog_()) {
      this.render(title, content, cwc.soy.Dialog.promptTemplate, opt_value);
      var inputField = goog.dom.getElement(this.prefix + 'input');

      var okButton = goog.dom.getElement(this.prefix + 'ok');
      okButton.addEventListener('click', this.close.bind(this));
      if (this.defaultCloseHandler_) {
        okButton.addEventListener('click', this.defaultCloseHandler_);
      }
      okButton.addEventListener('click', function() {
        resolve(inputField.value);
      });
      inputField.addEventListener('keyup', function(event) {
        if (event.keyCode == 13) {
          okButton.click();
        }
      });

      var cancelButton = goog.dom.getElement(this.prefix + 'cancel');
      cancelButton.addEventListener('click', this.close.bind(this));
      cancelButton.addEventListener('click', reject);
      this.showModal();
    } else {
      reject();
    }
  });
};


/**
 * @param {!string} title
 * @param {!string} content
 * @export
 */
cwc.utils.Dialog.prototype.showYesNo = function(title, content) {
  return new Promise((resolve, reject) => {
    if (this.getDialog_()) {
      this.render(title, content, cwc.soy.Dialog.yesNoTemplate);

      var yesButton = goog.dom.getElement(this.prefix + 'yes');
      yesButton.addEventListener('click', this.close.bind(this));
      if (this.defaultCloseHandler_) {
        yesButton.addEventListener('click', this.defaultCloseHandler_);
      }
      yesButton.addEventListener('click', function() {
        resolve(true);
      });

      var noButton = goog.dom.getElement(this.prefix + 'no');
      noButton.addEventListener('click', this.close.bind(this));
      noButton.addEventListener('click', function() {
        resolve(false);
      });
      this.showModal();
    } else {
      reject();
    }
  });
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


/**
 * @private
 */
cwc.utils.Dialog.prototype.getDialog_ = function() {
  if (this.dialog) {
    return this.dialog;
  } else if (goog.dom.getElement(this.prefixDialog_)) {
    this.dialog = goog.dom.getElement(this.prefixDialog_);
  } else {
    this.prepare_();
  }
  return this.dialog;
};


/**
 * Decorates the given node and adds the dialog.
 * @private
 */
cwc.utils.Dialog.prototype.prepare_ = function() {

  if (!this.styleSheet) {
    var content = cwc.soy.Dialog.style({ prefix: this.prefix }).getContent();
    var head = document.head || document.getElementsByTagName('head')[0];
    this.styleSheet = document.createElement('style');
    if (this.styleSheet.styleSheet){
      this.styleSheet.styleSheet.cssText = content;
    } else {
      this.styleSheet.appendChild(document.createTextNode(content));
    }
    head.appendChild(this.styleSheet);
  }

  if (!goog.dom.getElement(this.prefixDialog_)) {
    this.node = document.body || document.getElementsByTagName('body')[0];
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
