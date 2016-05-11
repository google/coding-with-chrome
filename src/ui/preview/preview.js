/**
 * @fileoverview Preview for the Coding with Chrome editor.
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
goog.provide('cwc.ui.Preview');
goog.provide('cwc.ui.PreviewStatus');

goog.require('cwc.soy.Preview');
goog.require('cwc.ui.PreviewInfobar');
goog.require('cwc.ui.PreviewToolbar');
goog.require('cwc.utils.Helper');

goog.require('goog.dom');
goog.require('goog.dom.ViewportSizeMonitor');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyCodes');
goog.require('goog.math.Size');
goog.require('goog.soy');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.KeyboardShortcutHandler');


/**
 * @enum {number}
 */
cwc.ui.PreviewStatus = {
  UNKNOWN: 0,
  LOADING: 1,
  STOPPED: 2,
  TERMINATED: 3,
  UNRESPONSIVE: 4,
  LOADED: 5
};



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.Preview = function(helper) {
  /** @type {string} */
  this.name = 'Preview';

  /** @type {string} */
  this.prefix = 'preview-';

  /** @type {string} */
  this.generalPrefix = '';

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeBody = null;

  /** @type {Element} */
  this.nodeContent = null;

  /** @type {Element} */
  this.nodeToolbar = null;

  /** @type {Element} */
  this.nodeInfobar = null;

  /** @type {boolean} */
  this.autoUpdate = false;

  /** @type {number} */
  this.autoUpdateDelay = 750;

  /** @type {Object} */
  this.autoUpdateDelayer = null;

  /** @type {Object} */
  this.autoUpdateEvent = null;

  /** @type {Object} */
  this.content = null;

  /** @type {number} */
  this.startTime = new Date().getTime();

  /** @type {string} */
  this.status = cwc.ui.PreviewStatus.UNKNOWN;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {cwc.ui.PreviewInfobar} */
  this.infobar = null;

  /** @type {cwc.ui.PreviewToolbar} */
  this.toolbar = null;

  /** @type {Element|StyleSheet} */
  this.styleSheet = null;

  /** @type {Array} */
  this.listener = [];
};


/**
 * Decorates the given node and adds the preview window.
 * @param {Element} node The target node to add the preview window.
 * @param {string=} opt_prefix Additional prefix for the ids of the
 *    inserted elements and style definitions.
 */
cwc.ui.Preview.prototype.decorate = function(node, opt_prefix) {
  this.node = node;
  this.generalPrefix = opt_prefix || '';
  this.prefix = opt_prefix + this.prefix;

  if (!this.styleSheet) {
    this.styleSheet = goog.style.installStyles(
        cwc.soy.Preview.previewStyle({ 'prefix': this.prefix }));
  }

  goog.soy.renderElement(
      this.node,
      cwc.soy.Preview.previewTemplate,
      { 'prefix': this.prefix }
  );

  this.nodeBody = goog.dom.getElement(this.prefix + 'body');
  this.nodeContent = goog.dom.getElement(this.prefix + 'content');

  // Toolbar
  this.nodeToolbar = goog.dom.getElement(this.prefix + 'toolbar');
  this.toolbar = new cwc.ui.PreviewToolbar(this.helper, this.prefix);
  this.toolbar.decorate(this.nodeToolbar);

  // Infobar
  this.nodeInfobar = goog.dom.getElement(this.prefix + 'infobar');
  this.infobar = new cwc.ui.PreviewInfobar(this.helper, this.prefix);
  this.infobar.decorate(this.nodeInfobar);

  // Monitor Changes
  var viewportMonitor = new goog.dom.ViewportSizeMonitor();
  this.addEventListener(viewportMonitor, goog.events.EventType.RESIZE,
      this.adjustSize, false, this);

  var layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    var eventHandler = layoutInstance.getEventHandler();
    this.addEventListener(eventHandler, goog.events.EventType.RESIZE,
        this.adjustSize, false, this);
    this.addEventListener(eventHandler, goog.events.EventType.UNLOAD,
        this.cleanUp, false, this);
  }

  // HotKeys
  var shortcutHandler = new goog.ui.KeyboardShortcutHandler(document);
  var CTRL = goog.ui.KeyboardShortcutHandler.Modifiers.CTRL;
  shortcutHandler.registerShortcut('CTRL_ENTER',
      goog.events.KeyCodes.ENTER, CTRL);

  this.addEventListener(
      shortcutHandler,
      goog.ui.KeyboardShortcutHandler.EventType.SHORTCUT_TRIGGERED,
      this.handleShortcut, false, this);

  this.adjustSize();
};


/**
 * Adjusts size after resize or on size change.
 */
cwc.ui.Preview.prototype.adjustSize = function() {
  var parentElement = goog.dom.getParentElement(this.node);
  if (parentElement) {
    var parentSize = goog.style.getSize(parentElement);
    var newHeight = parentSize.height;

    if (this.nodeToolbar) {
      var toolbarSize = goog.style.getSize(this.nodeToolbar);
      newHeight = newHeight - toolbarSize.height;
    }

    if (this.nodeInfobar) {
      var infobarSize = goog.style.getSize(this.nodeInfobar);
      newHeight = newHeight - infobarSize.height;
    }

    var contentSize = new goog.math.Size(parentSize.width, newHeight);
    goog.style.setSize(this.nodeContent, contentSize);
  }
  this.delayAutoUpdate();
};


/**
 * Runs the preview.
 * @param {Event=} opt_event
 */
cwc.ui.Preview.prototype.run = function(opt_event) {
  if (this.status == cwc.ui.PreviewStatus.LOADING) {
    this.terminate();
  }
  if (this.toolbar) {
    this.toolbar.setRunStatus(true);
  }
  this.render();
};


/**
 * Stops the preview window.
 */
cwc.ui.Preview.prototype.stop = function() {
  if (this.content) {
    console.info('Stop Preview');
    this.content.stop();
    this.setContentUrl('about:blank');
    if (this.toolbar) {
      this.toolbar.setRunStatus(false);
    }
    this.setStatusText('Stopped');
    this.status = cwc.ui.PreviewStatus.STOPPED;
  }
};


/**
 * Reloads the preview.
 */
cwc.ui.Preview.prototype.reload = function() {
  if (this.content) {
    console.info('Reload Preview');
    if (this.toolbar) {
      this.toolbar.setRunStatus(true);
    }
    this.content.reload();
  }
};


/**
 * Terminates the preview window.
 */
cwc.ui.Preview.prototype.terminate = function() {
  if (this.content) {
    console.info('Terminate Preview');
    this.status = cwc.ui.PreviewStatus.TERMINATED;
    if (this.toolbar) {
      this.toolbar.setRunStatus(false);
    }
    this.content.terminate();
  }
};


/**
 * Renders content for preview window.
 */
cwc.ui.Preview.prototype.render = function() {
  if (this.infobar) {
    this.infobar.clear();
  }
  if (this.content) {
    if (this.status == cwc.ui.PreviewStatus.LOADING ||
        this.status == cwc.ui.PreviewStatus.UNRESPONSIVE) {
      this.terminate();
    }
    this.stop();
    goog.dom.removeChildren(this.nodeContent);
  }

  this.content = document.createElement('webview');
  this.content.setAttribute('partition', 'preview');
  this.content.addEventListener('consolemessage',
      this.handleConsoleMessage_.bind(this), false);
  this.content.addEventListener('dialog',
      this.handleDialog.bind(this), false);
  this.content.addEventListener('loadstart',
      this.handleLoadStart.bind(this), false);
  this.content.addEventListener('loadstop',
      this.handleLoadStop.bind(this), false);
  this.content.addEventListener(cwc.ui.PreviewStatus.UNRESPONSIVE,
      this.handleUnresponsive.bind(this), false);
  this.content.addEventListener('newwindow',
      this.handleNewWindow.bind(this), false);
  this.content.addEventListener('permissionrequest',
      this.handlePermissionRequest.bind(this), false);

  goog.dom.appendChild(this.nodeContent, this.content);
  if (this.toolbar) {
    this.toolbar.setRunStatus(true);
  }
  this.setContentUrl(this.getContentUrl());
};


/**
 * Shows or hides the built in console.
 * @param {boolean} visible
 */
cwc.ui.Preview.prototype.showConsole = function(visible) {
  if (this.infobar) {
    if (visible) {
      this.infobar.showConsole();
    } else {
      this.infobar.hideConsole();
    }
  }
};


/**
 * Gets the content url from the renderer.
 * @return {string}
 */
cwc.ui.Preview.prototype.getContentUrl = function() {
  var rendererInstance = this.helper.getInstance('renderer', true);
  var contentUrl = rendererInstance.getContentUrl();
  if (!contentUrl) {
    console.error('Was not able to get content url!');
    return;
  }

  return contentUrl;
};


/**
 * @param {!string} url
 */
cwc.ui.Preview.prototype.setContentUrl = function(url) {
  if (this.content) {
    this.content.src = url;
  }
};


/**
 * Handles preview specific keyboard short cuts.
 * @param {Event} event
 */
cwc.ui.Preview.prototype.handleShortcut = function(event) {
  var shortcut = event.identifier;
  console.log('Shortcut: ' + shortcut);

  if (shortcut == 'CTRL_ENTER') {
    this.run();
  }
};


/**
 * Collects all messages from the preview window for the console.
 * @param {Event} event
 * @private
 */
cwc.ui.Preview.prototype.handleConsoleMessage_ = function(event) {
  if (this.infobar) {
    this.infobar.addMessage(event);
  }
};


/**
 * Displays the start of load event.
 * @param {Event=} opt_event
 */
cwc.ui.Preview.prototype.handleLoadStart = function(opt_event) {
  this.startTime = new Date().getTime();
  this.status = cwc.ui.PreviewStatus.LOADING;
  if (this.toolbar) {
    this.toolbar.setLoadStatus(true);
  }
  this.setStatusText('Loading …');
};


/**
 * Displays the end of the load event.
 * @param {Event=} opt_event
 */
cwc.ui.Preview.prototype.handleLoadStop = function(opt_event) {
  var duration = (new Date().getTime() - this.startTime) / 1000;
  this.status = cwc.ui.PreviewStatus.LOADED;
  if (this.toolbar) {
    this.toolbar.setLoadStatus(false);
  }
  this.setStatusText('Finished after ' + duration + ' seconds.');
};


/**
 * Shows a unresponsive warning with the options to terminate the preview.
 * @param {Event=} opt_event
 */
cwc.ui.Preview.prototype.handleUnresponsive = function(opt_event) {
  this.setStatusText('Unresponsive …');
  this.status = cwc.ui.PreviewStatus.UNRESPONSIVE;

  var dialogInstance = this.helper.getInstance('dialog');
  dialogInstance.showYesNo('Unresponsive Warning',
    'The preview is unresponsive! Terminate?',
    this.terminate.bind(this));
};


/**
 * @param {Event} event
 */
cwc.ui.Preview.prototype.handleDialog = function(event) {
  console.log('handleDialog', event);
};


/**
 * @param {Event} event
 */
cwc.ui.Preview.prototype.handleNewWindow = function(event) {
  console.log('handleNewWindow', event);
};


/**
 * @param {Event} event
 */
cwc.ui.Preview.prototype.handlePermissionRequest = function(event) {
  console.log('handlePermissionRequest', event);
};


/**
 * @param {boolean} active
 */
cwc.ui.Preview.prototype.setAutoUpdate = function(active) {
  if (active && !this.autoUpdateEvent) {
    console.log('Activate AutoUpdate …');
    var editorInstance = this.helper.getInstance('editor');
    if (editorInstance) {
      var editorEventHandler = editorInstance.getEventHandler();
      this.autoUpdateEvent = goog.events.listen(editorEventHandler,
          goog.ui.Component.EventType.CHANGE, this.delayAutoUpdate, false,
          this);
      if (this.toolbar) {
        this.toolbar.setAutoUpdate(true);
      }
    }
  } else if (!active && this.autoUpdateEvent) {
    console.log('Deactivate AutoUpdate …');
    goog.events.unlistenByKey(this.autoUpdateEvent);
    this.autoUpdateEvent = null;
    if (this.toolbar) {
      this.toolbar.setAutoUpdate(false);
    }
  }
  this.autoUpdate = active;
};


/**
 * Delays the auto update by the defined time range.
 */
cwc.ui.Preview.prototype.delayAutoUpdate = function() {
  if (this.autoUpdateDelayer) {
    window.clearTimeout(this.autoUpdateDelayer);
  }
  var autoUpdater = this.doAutoUpdate.bind(this);
  this.autoUpdateDelayer = window.setTimeout(autoUpdater,
      this.autoUpdateDelay);
};


/**
 * Perform the auto uodate.
 */
cwc.ui.Preview.prototype.doAutoUpdate = function() {
  if (!this.autoUpdate) {
    return;
  }

  console.log('Auto Update');
  this.run();
};


/**
 * @param {string} status
 */
cwc.ui.Preview.prototype.setStatusText = function(status) {
  if (this.infobar) {
    this.infobar.setStatusText(status);
  }
};


/**
 * Adds an event listener for a specific event on a native event
 * target (such as a DOM element) or an object that has implemented
 * {@link goog.events.Listenable}.
 *
 * @param {EventTarget|goog.events.Listenable} src
 * @param {string} type
 * @param {function(?)} listener
 * @param {boolean=} opt_useCapture
 * @param {Object=} opt_listenerScope
 */
cwc.ui.Preview.prototype.addEventListener = function(src, type,
    listener, opt_useCapture, opt_listenerScope) {
  var eventListener = goog.events.listen(src, type, listener, opt_useCapture,
      opt_listenerScope);
  goog.array.insert(this.listener, eventListener);
};


/**
 * Clears all object based events.
 */
cwc.ui.Preview.prototype.cleanUp = function() {
  this.listener = this.helper.removeEventListeners(this.listener, this.name);
  this.styleSheet = this.helper.uninstallStyles(this.styleSheet);
};
