/**
 * @fileoverview Preview for the Coding with Chrome editor.
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
  LOADED: 5,
  INIT: 6
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

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('preview');

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

  /** @type {number} */
  this.autoUpdateDelayer = null;

  /** @type {goog.events.ListenableKey|number} */
  this.autoUpdateEvent = null;

  /** @type {Object} */
  this.content = null;

  /** @type {number} */
  this.startTime = new Date().getTime();

  /** @type {cwc.ui.PreviewStatus<number>} */
  this.status = cwc.ui.PreviewStatus.INIT;

  /** @type {cwc.ui.PreviewInfobar} */
  this.infobar = null;

  /** @type {cwc.ui.PreviewToolbar} */
  this.toolbar = null;

  /** @type {Array} */
  this.listener = [];

  /** @private {!boolean} */
  this.ran_ = false;

  /** @private {!boolean} */
  this.skipAutoUpdate_ = true;

  /** @private {!boolean} */
  this.webviewSupport_ = this.helper.checkChromeFeature('webview');
};


/**
 * Decorates the given node and adds the preview window.
 * @param {Element} node The target node to add the preview window.
 */
cwc.ui.Preview.prototype.decorate = function(node) {
  this.node = node;

  goog.soy.renderElement(
    this.node,  cwc.soy.Preview.template, { prefix: this.prefix }
  );

  this.nodeBody = goog.dom.getElement(this.prefix + 'body');
  this.nodeContent = goog.dom.getElement(this.prefix + 'content');

  // Toolbar
  this.nodeToolbar = goog.dom.getElement(this.prefix + 'toolbar-chrome');
  if (this.nodeToolbar) {
    this.toolbar = new cwc.ui.PreviewToolbar(this.helper);
    this.toolbar.decorate(this.nodeToolbar);
  }

  // Infobar
  this.nodeInfobar = goog.dom.getElement(this.prefix + 'infobar');
  this.infobar = new cwc.ui.PreviewInfobar(this.helper);
  this.infobar.decorate(this.nodeInfobar);

  // Monitor Changes
  var viewportMonitor = new goog.dom.ViewportSizeMonitor();
  this.addEventListener_(viewportMonitor, goog.events.EventType.RESIZE,
      this.adjustSize, false, this);

  var layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    var eventHandler = layoutInstance.getEventHandler();
    this.addEventListener_(eventHandler, goog.events.EventType.RESIZE,
        this.adjustSize, false, this);
    this.addEventListener_(eventHandler, goog.events.EventType.UNLOAD,
        this.cleanUp, false, this);
  }

  // HotKeys
  var shortcutHandler = new goog.ui.KeyboardShortcutHandler(document);
  var CTRL = goog.ui.KeyboardShortcutHandler.Modifiers.CTRL;
  shortcutHandler.registerShortcut('CTRL_ENTER',
      goog.events.KeyCodes.ENTER, CTRL);

  this.addEventListener_(
      shortcutHandler,
      goog.ui.KeyboardShortcutHandler.EventType.SHORTCUT_TRIGGERED,
      this.handleShortcut_, false, this);

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
  this.ran_ = true;
  this.render();
};


/**
 * Runs the preview only one time.
 * @param {Event=} opt_event
 */
cwc.ui.Preview.prototype.runOnce = function(opt_event) {
  if (!this.ran_) {
    this.run();
  }
};


/**
 * Stops the preview window.
 */
cwc.ui.Preview.prototype.stop = function() {
  if (this.content) {
    console.info('Stop Preview');
    if (this.webviewSupport_) {
      this.content.stop();
    }
    this.setContentUrl('about:blank');
    if (this.toolbar) {
      this.toolbar.setRunStatus(false);
    }
    this.setStatusText('Stopped');
    this.status = cwc.ui.PreviewStatus.STOPPED;
  }
};


/**
 * Refreshes the preview.
 */
cwc.ui.Preview.prototype.refresh = function() {
  if (this.content) {
    console.info('Refresh Preview');
    if (this.toolbar) {
      this.toolbar.setRunStatus(true);
    }
    if (this.webviewSupport_) {
      this.content.stop();
      this.content.reload();
    } else {
      this.content.contentWindow.location.reload(true);
    }
  }
};


/**
 * Reloads the preview.
 */
cwc.ui.Preview.prototype.reload = function() {
  if (this.content) {
    console.info('Reload Preview');
    this.stop();
    this.run();
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
    if (this.webviewSupport_) {
      if (this.status == cwc.ui.PreviewStatus.LOADING ||
          this.status == cwc.ui.PreviewStatus.UNRESPONSIVE) {
        this.terminate();
      }
      this.stop();
    }
    goog.dom.removeChildren(this.nodeContent);
  }

  if (this.webviewSupport_) {
    this.content = document.createElement('webview');
    this.content.setAttribute('partition', 'preview');
    this.content.addEventListener('consolemessage',
        this.handleConsoleMessage_.bind(this), false);
    this.content.addEventListener('dialog',
        this.handleDialog_.bind(this), false);
    this.content.addEventListener('loadstart',
        this.handleLoadStart_.bind(this), false);
    this.content.addEventListener('loadstop',
        this.handleLoadStop_.bind(this), false);
    this.content.addEventListener('unresponsive',
        this.handleUnresponsive_.bind(this), false);
    this.content.addEventListener('newwindow',
        this.handleNewWindow_.bind(this), false);
    this.content.addEventListener('permissionrequest',
        this.handlePermissionRequest_.bind(this), false);
  } else {
    this.content = document.createElement('iframe');
  }

  goog.dom.appendChild(this.nodeContent, this.content);
  if (this.toolbar) {
    this.toolbar.setRunStatus(true);
  }
  this.setContentUrl(this.getContentUrl());
};


/**
 * Switch between refresh and reload for the loaded content.
 * @param {boolean} enable
 */
cwc.ui.Preview.prototype.enableSoftRefresh = function(enable) {
  if (this.toolbar) {
    this.toolbar.enableSoftRefresh(enable);
  }
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
 * @return {!string}
 */
cwc.ui.Preview.prototype.getContentUrl = function() {
  var rendererInstance = this.helper.getInstance('renderer', true);
  var contentUrl = rendererInstance.getContentUrl();
  if (!contentUrl) {
    console.error('Was not able to get content url!');
  }
  return contentUrl || '';
};


/**
 * @param {!string} url
 */
cwc.ui.Preview.prototype.setContentUrl = function(url) {
  if (url && this.content) {
    this.content.src = url;
  } else {
    console.error('Was unable to set content url!');
  }
};


/**
 * Opens preview in new browser window.
 */
cwc.ui.Preview.prototype.openInBrowser = function() {
  var contentUrl = this.getContentUrl();
  if (this.helper.checkChromeFeature('browser')) {
    chrome.browser.openTab({
      url: contentUrl
    });
  } else {
    window.open(contentUrl);
  }
};


/**
 * Enables or disables the automatic update of the preview.
 * @param {boolean} active
 * @param {boolean=} opt_no_skip
 */
cwc.ui.Preview.prototype.setAutoUpdate = function(active, opt_no_skip) {
  if (active && !this.autoUpdateEvent) {
    if (opt_no_skip) {
      this.skipAutoUpdate_ = false;
    }
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
 * Perform the auto update.
 */
cwc.ui.Preview.prototype.doAutoUpdate = function() {
  if (!this.autoUpdate) {
    return;
  }

  if (this.skipAutoUpdate_ && this.ran_) {
    console.log('Skipping auto update ...');
    this.skipAutoUpdate_ = false;
    return;
  }

  console.log('Perform auto update ...');
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
 * Handles preview specific keyboard short cuts.
 * @param {Event} event
 * @private
 */
cwc.ui.Preview.prototype.handleShortcut_ = function(event) {
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
 * @private
 */
cwc.ui.Preview.prototype.handleLoadStart_ = function(opt_event) {
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
 * @private
 */
cwc.ui.Preview.prototype.handleLoadStop_ = function(opt_event) {
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
 * @private
 */
cwc.ui.Preview.prototype.handleUnresponsive_ = function(opt_event) {
  this.setStatusText('Unresponsive …');
  this.status = cwc.ui.PreviewStatus.UNRESPONSIVE;

  var dialogInstance = this.helper.getInstance('dialog');
  dialogInstance.showYesNo('Unresponsive Warning',
    'The preview is unresponsive! Terminate?').then((answer) => {
      if (answer) {
        this.terminate();
      }
    });
};


/**
 * @param {Event} event
 * @private
 */
cwc.ui.Preview.prototype.handleDialog_ = function(event) {
  console.log('handleDialog', event);
};


/**
 * @param {Event} event
 * @private
 */
cwc.ui.Preview.prototype.handleNewWindow_ = function(event) {
  console.log('handleNewWindow', event);
};


/**
 * @param {Event} event
 * @private
 */
cwc.ui.Preview.prototype.handlePermissionRequest_ = function(event) {
  console.log('handlePermissionRequest', event);
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
 * @private
 */
cwc.ui.Preview.prototype.addEventListener_ = function(src, type,
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
};
