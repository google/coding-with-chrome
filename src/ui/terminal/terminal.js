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
goog.require('cwc.utils.Events');
goog.require('cwc.utils.Logger');

goog.require('goog.dom.classlist');
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
  this.nodeButton = null;

  /** @type {Element} */
  this.nodeContent = null;

  /** @type {Element} */
  this.nodeInput = null;

  /** @type {Element} */
  this.nodeUserInput = null;

  /** @private {boolean} */
  this.isVisible_ = null;

  /** @private {!Array} */
  this.history_ = [];

  /** @private {!number} */
  this.historyIndex_ = 0;

  /** @private {!number} */
  this.numErrors_ = 0;

  /** @private {!number} */
  this.numInfos_ = 0;

  /** @private {!number} */
  this.numWarnings_ = 0;

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, this.prefix, this);

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
  this.nodeUserInput = goog.dom.getElement(this.prefix + 'user-input');

  let keyHandler = new goog.ui.KeyboardShortcutHandler(this.nodeInput);
  keyHandler.setAlwaysPreventDefault(false);
  keyHandler.registerShortcut('enter', goog.events.KeyCodes.ENTER);
  keyHandler.registerShortcut('up', goog.events.KeyCodes.UP);
  keyHandler.registerShortcut('down', goog.events.KeyCodes.DOWN);
  keyHandler.registerShortcut('clear', goog.events.KeyCodes.L,
    goog.ui.KeyboardShortcutHandler.Modifiers.CTRL);
  goog.events.listen(
    keyHandler, goog.ui.KeyboardShortcutHandler.EventType.SHORTCUT_TRIGGERED,
    this.handleKey_, false, this);

  // Terminal Buttons
  this.events_.listen('close', goog.events.EventType.CLICK, function() {
    this.showTerminal(false);
  });
  this.events_.listen('clear', goog.events.EventType.CLICK, function() {
    this.clearConsole();
  });

  this.showTerminal(false);
};


/**
 * @param {Element} node
 */
cwc.ui.Terminal.prototype.decorateButton = function(node) {
  if (!node) {
    this.log_.error('Invalid Terminal Button node:', node);
    return;
  }

  goog.soy.renderElement(
    node,
    cwc.soy.ui.Terminal.templateButton, {
      'prefix': this.prefix,
    }
  );

  this.nodeButton = goog.dom.getElement(this.prefix + 'button');
  this.events_.listen(this.nodeButton, goog.events.EventType.CLICK,
    this.toggle);
};


/**
 * Clears console including the history.
 */
cwc.ui.Terminal.prototype.clear = function() {
  this.log_.info('Clear console');
  this.clearConsole();
  this.clearHistory();
};


/**
 * Clears console output only.
 */
cwc.ui.Terminal.prototype.clearConsole = function() {
  goog.dom.removeChildren(this.nodeContent);
  this.clearErrors();
};


cwc.ui.Terminal.prototype.clearErrors = function() {
  this.numErrors_ = 0;
  this.numInfos_ = 0;
  this.numWarnings_ = 0;
  this.updateButton_();
};


cwc.ui.Terminal.prototype.clearHistory = function() {
  this.history_ = [];
  this.historyIndex_ = 0;
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
 * Shows terminal window and refresh possible affected instances.
 * @param {boolean} visible
 */
cwc.ui.Terminal.prototype.showTerminal = function(visible) {
  goog.style.setElementShown(this.node, visible);
  goog.dom.classlist.enable(this.node, 'active', visible);
  this.isVisible_ = visible;

  let layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    layoutInstance.refreshLayout();
  }

  let blocklyInstance = this.helper.getInstance('blockly');
  if (blocklyInstance) {
    blocklyInstance.adjustSize();
  }

  let editorInstance = this.helper.getInstance('editor');
  if (editorInstance) {
    editorInstance.refreshEditor();
  }
};


/**
 * @param {!number} index
 */
cwc.ui.Terminal.prototype.selectHistoryEntry = function(index) {
  if (index > this.historyIndex_ || index < 0 || !this.nodeUserInput) {
    return;
  }
  if (this.history_[index]) {
    this.nodeUserInput.value = this.history_[index];
  }
};


/**
 * Write text content into terminal content.
 * @param {!string} content
 * @param {string=} type
 * @param {string=} icon
 */
cwc.ui.Terminal.prototype.write = function(content, type = '', icon = '') {
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
    this.nodeContent.scrollTo(0, this.nodeContent.scrollHeight);
  }
  this.updateButton_();
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
  this.numErrors_++;
  this.writeln(content, 'error', 'cancel');
};


/**
 * @param {!string} content
 */
cwc.ui.Terminal.prototype.writeWarn = function(content) {
  this.numWarnings_++;
  this.writeln(content, 'warn', 'warning');
};


/**
 * @param {!string} content
 */
cwc.ui.Terminal.prototype.writeInfo = function(content) {
  this.numInfos_++;
  this.writeln(content, 'info');
};


/**
 * @param {!string} content
 */
cwc.ui.Terminal.prototype.writeOutput = function(content) {
  this.writeln(content, 'output', 'keyboard_arrow_left');
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
      if (message.startsWith('>>')) {
        this.writeOutput(message.substr(2));
      } else {
        this.writeInfo(message);
      }
      break;
    default:
      this.writeln(message);
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
  this.history_.push(command);
  this.historyIndex_ = this.history_.length;
  this.writeln(command, 'input', 'keyboard_arrow_right');
  event.target.value = '';

  let previewInstance = this.helper.getInstance('preview');
  if (previewInstance) {
    previewInstance.executeScript(command);
  }
};


/**
 * @param {goog.events.EventLike} event
 * @private
 */
cwc.ui.Terminal.prototype.handleKey_ = function(event) {
  switch (event.identifier) {
    case 'enter':
      this.handleCommand_(event);
      break;
    case 'up':
      if (this.historyIndex_ > 0) {
        this.selectHistoryEntry(--this.historyIndex_);
      }
      event.preventDefault();
      break;
    case 'down':
      if (this.historyIndex_ < this.history_.length - 1) {
        this.selectHistoryEntry(++this.historyIndex_);
      }
      break;
    case 'clear':
      this.clearConsole();
      break;
    default:
      console.log(event);
  }
};


/**
 * @private
 */
cwc.ui.Terminal.prototype.updateButton_ = function() {
  if (!this.nodeButton) {
    return;
  }
  goog.dom.classlist.removeAll(this.nodeButton, ['error', 'warning', 'info']);
  if (this.numErrors_) {
    this.nodeButton.setAttribute('data-badge', this.numErrors_);
    goog.dom.classlist.add(this.nodeButton, 'error');
  } else if (this.numWarnings_) {
    this.nodeButton.setAttribute('data-badge', this.numWarnings_);
    goog.dom.classlist.add(this.nodeButton, 'warning');
  } else if (this.numInfos_) {
    this.nodeButton.setAttribute('data-badge', this.numInfos_);
    goog.dom.classlist.add(this.nodeButton, 'info');
  } else {
    this.nodeButton.removeAttribute('data-badge');
  }
};
