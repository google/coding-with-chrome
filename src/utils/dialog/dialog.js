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
  PROMPT: 'info',
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
  this.node = null;

  /** @type {Element} */
  this.nodeContent = null;

  /** @private {Function} */
  this.defaultCloseHandler_ = null;

  /** @private {!string} */
  this.prefixDialog_ = this.prefix + 'chrome';

  /** @private {!string} */
  this.title_ = '';
};


/**
 * @export
 */
cwc.utils.Dialog.prototype.prepare = function() {
  this.getDialog_();
  this.refresh_();
  this.close();
};


/**
 * @export
 */
cwc.utils.Dialog.prototype.show = function() {
  let dialog = this.getDialog_();
  if (dialog) {
    if (!this.isOpen(dialog)) {
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
  let dialog = this.getDialog_();
  if (dialog) {
    if (!this.isOpen(dialog)) {
      if (dialog.showModal) {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
      dialog.style.display = 'flex';
    }
  }
  this.refresh_();
};


/**
 * @param {string=} title
 * @export
 */
cwc.utils.Dialog.prototype.close = function(title) {
  // Close only specific dialogs with matching title.
  if (title && typeof title === 'string' && this.title_ !== title) {
    return;
  }

  let dialog = this.getDialog_();
  if (!dialog) {
    return;
  }
  if (this.isOpen(dialog)) {
    while (dialog.firstChild) {
      dialog.removeChild(this.dialog.firstChild);
    }
    if (dialog.close) {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
  }
  dialog.style.display = 'none';
};


/**
 * Render the dialog template with the passed options.
 * @param {!string|Object} title
 * @param {!string} content
 * @param {function ({
 *   content: string,
 *   prefix: string,
 *   title: string,
 *   opt_title_icon: (string|undefined),
 *   opt_title_untranslated: (string|undefined),
 *   opt_values: (string|undefined)
 * })=} template
 * @param {string=} values
 * @export
 */
cwc.utils.Dialog.prototype.render = function(title, content,
    template = cwc.soy.Dialog.contentTemplate, values) {
  let dialog = this.getDialog_();
  let dialogTitle = title;
  let dialogTitleIcon = '';
  let dialogTitleUntranslated = '';

  if (typeof title !== 'string') {
    dialogTitle = title.title;
    dialogTitleIcon = title.icon || '';
    dialogTitleUntranslated = title.untranslated || '';
  }

  if (dialog) {
    this.title_ = dialogTitle;
    goog.soy.renderElement(dialog, template, {
          content: content,
          prefix: this.prefix,
          title: dialogTitle,
          opt_title_icon: dialogTitleIcon,
          opt_title_untranslated: dialogTitleUntranslated,
          opt_values: values,
        });
    this.refresh_();
  }
};


/**
 * @param {!string|Object} title
 * @param {!string} content
 * @export
 */
cwc.utils.Dialog.prototype.showContent = function(title, content) {
  if (this.getDialog_()) {
    this.render(title, content, cwc.soy.Dialog.contentTemplate);
    let closeButton = goog.dom.getElement(this.prefix + 'close');
    closeButton.addEventListener('click', () => {
        this.close();
      });
    this.showModal();
  }
};


/**
 * @param {!string|Object} title
 * @param {!function (Object, null=, (Object<string,*>|null)=)} template
 * @param {!Object} values
 * @return {!cwc.utils.Dialog}
 * @export
 */
cwc.utils.Dialog.prototype.showTemplate = function(title, template, values) {
  if (!template) {
    console.error('Unable to render template!');
  }

  if (this.getDialog_()) {
    this.render(title, '', cwc.soy.Dialog.contentTemplate);
    let contentNode = goog.dom.getElement(this.prefix + 'content');
    goog.soy.renderElement(contentNode, template, values);
    let closeButton = goog.dom.getElement(this.prefix + 'close');
    closeButton.addEventListener('click', () => {
      this.close();
    });
    this.showModal();
  }
  return this;
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
    this.refresh_();
  }
};


/**
 * @param {!string} id
 * @param {!string} text
 * @param {Function} optCallback
 * @export
 */
cwc.utils.Dialog.prototype.addButton = function(id, text, optCallback) {
  let button = goog.dom.createDom(
    'button', {
      'id': this.prefix + id,
      'type': 'button',
      'class': '_button',
    }, text
  );
  if (optCallback) {
    button.addEventListener('click', optCallback);
  }
  let buttonsDiv = goog.dom.getElement(this.prefix + 'buttons');
  goog.dom.appendChild(buttonsDiv, button);
};


cwc.utils.Dialog.prototype.getButton = function(id) {
  return goog.dom.getElement(this.prefix + id);
};


cwc.utils.Dialog.prototype.setButtonText = function(id, text) {
  let button = goog.dom.getElement(this.prefix + id);
  goog.dom.setTextContent(button, text);
};


/**
 * @param {!string|Object} title
 * @param {!string} content
 * @return {!Promise}
 * @export
 */
cwc.utils.Dialog.prototype.showAlert = function(title, content) {
  return new Promise((resolve, reject) => {
    if (this.getDialog_()) {
      this.render(title, content, cwc.soy.Dialog.alertTemplate);
      let okButton = goog.dom.getElement(this.prefix + 'ok');
      okButton.addEventListener('click', () => {
        this.close();
      });
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
 * @param {!string|Object} title
 * @param {!string} content
 * @param {string=} optValue
 * @return {!Promise}
 * @export
 */
cwc.utils.Dialog.prototype.showPrompt = function(title, content, optValue) {
  return new Promise((resolve, reject) => {
    if (this.getDialog_()) {
      this.render(title, content, cwc.soy.Dialog.promptTemplate, optValue);
      let inputField = goog.dom.getElement(this.prefix + 'input');

      let okButton = goog.dom.getElement(this.prefix + 'ok');
      okButton.addEventListener('click', () => {
        this.close();
      });
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

      let cancelButton = goog.dom.getElement(this.prefix + 'cancel');
      cancelButton.addEventListener('click', () => {
        this.close();
      });
      cancelButton.addEventListener('click', reject);
      this.showModal();
    } else {
      reject();
    }
  });
};


/**
 * @param {!string|Object} title
 * @param {!string} content
 * @param {!string} action
 * @return {!Promise}
 * @export
 */
cwc.utils.Dialog.prototype.showActionCancel = function(title, content, action) {
  return new Promise((resolve, reject) => {
    if (this.getDialog_()) {
      this.render(title, content, cwc.soy.Dialog.actionCancelTemplate, action);
      let actionButton = goog.dom.getElement(this.prefix + 'action');
      actionButton.addEventListener('click', () => {
        this.close();
      });
      if (this.defaultCloseHandler_) {
        actionButton.addEventListener('click', this.defaultCloseHandler_);
      }
      actionButton.addEventListener('click', function() {
        resolve(true);
      });

      let cancelButton = goog.dom.getElement(this.prefix + 'cancel');
      cancelButton.addEventListener('click', () => {
        this.close();
      });
      cancelButton.addEventListener('click', function() {
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
 * @param {Element=} dialog
 * @return {boolean}
 */
cwc.utils.Dialog.prototype.isOpen = function(dialog) {
  let dialogElement = dialog || this.getDialog_();
  if (!dialogElement) {
    return false;
  }
  return dialogElement.hasAttribute('open');
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
 * @return {Element}
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
  if (!this.dialog) {
    console.error('Unable to get Dialog!');
  }
  return this.dialog;
};


/**
 * Decorates the given node and adds the dialog.
 * @private
 */
cwc.utils.Dialog.prototype.prepare_ = function() {
  if (!goog.dom.getElement(this.prefixDialog_)) {
    this.node = document.body || document.getElementsByTagName('body')[0];
    let dialog = goog.soy.renderAsFragment(cwc.soy.Dialog.template, {
      prefix: this.prefix});
    if (this.node && dialog) {
      this.node.appendChild(dialog);
    } else {
      console.error('Unable to add dialog', dialog, 'to node', this.node, '!');
    }
    this.dialog = goog.dom.getElement(this.prefixDialog_);
  }
};
