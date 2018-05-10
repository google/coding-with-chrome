/**
 * @fileoverview Terminal
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
goog.provide('cwc.ui.Terminal');

goog.require('cwc.soy.ui.Terminal');
goog.require('cwc.utils.Logger');

goog.require('goog.ui.KeyboardShortcutHandler');


/**
 * Class represents the terminal the UI.
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.Terminal = function(helper) {
  /** @type {string} */
  this.name = 'Terminal';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('terminal');

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeContent = null;

  /** @type {Element} */
  this.nodeInput = null;

  /** @private {boolean} */
  this.isVisible_ = null;

  /** @private {!cwc.utils.Logger|null} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * Decorates the given node and adds the terminal to the ui.
 * @param {Element} node The target node to add the status bar.
 */
cwc.ui.Terminal.prototype.decorate = function(node) {
  this.node = node || goog.dom.getElement(this.prefix + 'chrome');
  if (!this.node) {
    this.log_.error('Invalid Terminal node:', this.node);
    return;
  }

  goog.soy.renderElement(
      this.node,
      cwc.soy.ui.Terminal.template, {
        'prefix': this.prefix,
      }
  );

  this.nodeContent = goog.dom.getElement(this.prefix + 'content');
  this.nodeInput = goog.dom.getElement(this.prefix + 'input');

  let keyHandler = new goog.ui.KeyboardShortcutHandler(this.nodeInput);
  keyHandler.setAlwaysPreventDefault(false);
  keyHandler.registerShortcut('enter', 'enter');
  keyHandler.registerShortcut('return', 'return');
  goog.events.listen(
    keyHandler, goog.ui.KeyboardShortcutHandler.EventType.SHORTCUT_TRIGGERED,
    this.handleKey_, false, this);

  let editorInstance = this.helper.getInstance('editor');
  if (editorInstance) {
    editorInstance.refreshEditor();
  }

  this.writeln('Coding with Chrome - Terminal');
  this.showTerminal(false);
};


/**
 * @return {!boolean}
 */
cwc.ui.Terminal.prototype.isVisible = function() {
  return this.isVisible_;
};


cwc.ui.Terminal.prototype.toggle = function() {
  this.showTerminal(!this.isVisible_);
};


/**
 * @param {boolean} visible
 */
cwc.ui.Terminal.prototype.showTerminal = function(visible) {
  goog.style.setElementShown(this.node, visible);
  this.isVisible_ = visible;
};


/**
 * @param {!string} content
 * @param {string=} type
 * @param {string=} icon
 */
cwc.ui.Terminal.prototype.write = function(content, type, icon) {
  if (!content) {
    return;
  }
  if (this.nodeContent) {
    let nodeIcon = document.createElement('i');
    nodeIcon.className = 'material-icons';
    nodeIcon.appendChild(document.createTextNode(icon));
    let nodeEntry = document.createElement('div');
    nodeEntry.appendChild(nodeIcon);
    nodeEntry.appendChild(document.createTextNode(content));
    nodeEntry.className = this.prefix + 'content-entry' +
      (type ? ' ' + this.prefix + 'content-entry-' + type : '');
    this.nodeContent.appendChild(nodeEntry);
  }
};


/**
 * @param {!string} content
 * @param {string=} type
 * @param {string=} icon
 */
cwc.ui.Terminal.prototype.writeln = function(content, type, icon) {
  this.write(content + '\n', type, icon);
};


/**
 * @param {!string} content
 */
cwc.ui.Terminal.prototype.writeError = function(content) {
  this.writeln(content, 'error', 'cancel');
};


/**
 * @param {!string} content
 */
cwc.ui.Terminal.prototype.writeWarn = function(content) {
  this.writeln(content, 'warn', 'warning');
};


/**
 * @param {!string} content
 */
cwc.ui.Terminal.prototype.writeInfo = function(content) {
  this.writeln(content, 'info');
};


/**
 * @param {Object} event
 */
cwc.ui.Terminal.prototype.writeConsoleMessage = function(event) {
  let level = event['level'];
  let message = event['message'] || '';
  switch (level) {
    case 2:
      this.writeError(message);
    break;
    case 1:
      this.writeWarn(message);
    break;
    case 0:
      this.writeInfo(message);
    break;
    default:
      this.writeln(message);
  }
};


/**
 * @param {goog.events.EventLike} event
 * @private
 */
cwc.ui.Terminal.prototype.handleKey_ = function(event) {
  switch (event.identifier) {
    case 'enter':
    case 'return':
      this.handleCommand_(event);
      break;
    default:
      console.log(event);
  }
};


/**
 * @param {Object} event
 */
cwc.ui.Terminal.prototype.handleCommand_ = function(event) {
  let command = event.target.value;
  if (!command) {
    return;
  }
  event.target.value = '';
  this.writeln(command, 'input', 'keyboard_arrow_right');
  // TODO (mbordihn): Using Post messages instead
  let previewInstance = this.helper.getInstance('preview');
  if (previewInstance) {
    if (command.includes(';')) {
      previewInstance.executeScript('console.log(function() {' +
        command +
      '}());');
    } else {
      previewInstance.executeScript('console.log(' + command + ');');
    }
  }
};
