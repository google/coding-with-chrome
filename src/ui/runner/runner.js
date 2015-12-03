/**
 * @fileoverview Runner for the Coding with Chrome editor.
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
goog.provide('cwc.ui.Runner');
goog.provide('cwc.ui.RunnerStatus');

goog.require('cwc.soy.Runner');
goog.require('cwc.ui.RunnerInfobar');
goog.require('cwc.ui.RunnerStatusbar');
goog.require('cwc.ui.RunnerTerminal');
goog.require('cwc.ui.RunnerToolbar');
goog.require('cwc.utils.Helper');
goog.require('goog.dom');
goog.require('goog.dom.ViewportSizeMonitor');
goog.require('goog.events');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyCodes');
goog.require('goog.math');
goog.require('goog.soy');
goog.require('goog.style');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Dialog');
goog.require('goog.ui.Dialog.EventType');


/**
 * @enum {number}
 */
cwc.ui.RunnerStatus = {
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
cwc.ui.Runner = function(helper) {
  /** @type {string} */
  this.name = 'Runner';

  /** @type {string} */
  this.prefix = 'runner-';

  /** @type {string} */
  this.generalPrefix = '';

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeBody = null;

  /** @type {Element} */
  this.nodeContent = null;

  /** @type {Element} */
  this.nodeRuntime = null;

  /** @type {Element} */
  this.nodeToolbar = null;

  /** @type {Element} */
  this.nodeInfo = null;

  /** @type {Element} */
  this.nodeStatus = null;

  /** @type {Element} */
  this.nodeStatusbar = null;

  /** @type {Element} */
  this.nodeOverlay = null;

  /** @type {Element} */
  this.nodeInfobar = null;

  /** @type {Object} */
  this.content = null;

  /** @type {Object} */
  this.infoTemplate = null;

  /** @type {Object} */
  this.overlayTemplate = null;

  /** @type {!string} */
  this.overlayTemplatePrefix = '';

  /** @type {!Object} */
  this.templateConnect = cwc.soy.Runner.connect;

  /** @type {!Object} */
  this.templateDisconnect = cwc.soy.Runner.disconnect;

  /** @type {!Object} */
  this.templatePrepare = cwc.soy.Runner.prepare;

  /** @type {!Object} */
  this.templateRun = cwc.soy.Runner.run;

  /** @type {!Object} */
  this.templateStop = cwc.soy.Runner.stop;

  /** @type {!Object} */
  this.templateTerminate = cwc.soy.Runner.terminate;

  /** @type {!Object} */
  this.templateReload = cwc.soy.Runner.reload;

  /** @type {Object} */
  this.commands = {};

  /** @type {cwc.ui.RunnerStatus} */
  this.status = cwc.ui.RunnerStatus.UNKNOWN;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {cwc.ui.RunnerInfobar} */
  this.infobar = null;

  /** @type {cwc.ui.RunnerStatusbar} */
  this.statusbar = null;

  /** @type {cwc.ui.RunnerTerminal} */
  this.termnial = null;

  /** @type {cwc.ui.RunnerToolbar} */
  this.toolbar = null;

  /** @type {number} */
  this.startTime = new Date().getTime();

  /** @type {string} */
  this.targetOrigin = '*';

  /** @type {?function()} */
  this.externalCleanUp = null;

  /** @type {Element|StyleSheet} */
  this.styleSheet = null;

  /** @type {Array} */
  this.listener = [];
};


/**
 * Decorates the given node and adds the Runner window.
 * @param {Element} node The target node to add the Runner window.
 * @param {string=} opt_prefix Additional prefix for the ids of the
 *    inserted elements and style definitions.
 */
cwc.ui.Runner.prototype.decorate = function(node, opt_prefix) {
  this.node = node;
  this.generalPrefix = opt_prefix || '';
  this.prefix = opt_prefix + this.prefix;

  if (!this.styleSheet) {
    this.styleSheet = goog.style.installStyles(
        cwc.soy.Runner.style({ 'prefix': this.prefix }));
  }

  goog.soy.renderElement(
      this.node,
      cwc.soy.Runner.template,
      { 'prefix': this.prefix }
  );

  this.nodeBody = goog.dom.getElement(this.prefix + 'body');
  this.nodeContent = goog.dom.getElement(this.prefix + 'content');
  this.nodeInfo = goog.dom.getElement(this.prefix + 'info');
  this.nodeStatus = goog.dom.getElement(this.prefix + 'status');
  this.nodeRuntime = goog.dom.getElement(this.prefix + 'runtime');

  // Infobar
  this.nodeInfobar = goog.dom.getElement(this.prefix + 'infobar');
  this.infobar = new cwc.ui.RunnerInfobar(this.helper, this.prefix);
  this.infobar.decorate(this.nodeInfobar);

  // Toolbar
  this.nodeToolbar = goog.dom.getElement(this.prefix + 'toolbar');
  this.toolbar = new cwc.ui.RunnerToolbar(this.helper, this.prefix);
  this.toolbar.decorate(this.nodeToolbar);

  // Statusbar
  this.nodeStatusbar = goog.dom.getElement(this.prefix + 'statusbar');
  this.statusbar = new cwc.ui.RunnerStatusbar(this.helper,
      this.prefix);
  this.statusbar.decorate(this.nodeStatusbar);

  // Terminal
  this.nodeTerminal = goog.dom.getElement(this.prefix + 'terminal');
  this.terminal = new cwc.ui.RunnerTerminal(this.helper, this.prefix);
  this.terminal.decorate(this.nodeTerminal);
  this.enableTerminal(false);

  // Overlay
  this.nodeOverlay = goog.dom.getElement(this.prefix + 'overlay');
  this.showOverlay(this.overlayTemplate);
  this.renderOverlayTemplate(this.overlayTemplate);

  // Info overlay
  var hasInfoTemplate = goog.isDefAndNotNull(this.infoTemplate);
  if (this.toolbar) {
    this.toolbar.enableInfoButton(hasInfoTemplate);
  }
  this.showInfo(hasInfoTemplate);
  this.renderInfoTemplate(this.infoTemplate);

  // Window Messages
  this.addEventListener(window, 'message', this.handleMessage, false, this);

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

  this.adjustSize();
};


/**
 * Adjusts size after resize or on size change.
 */
cwc.ui.Runner.prototype.adjustSize = function() {
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
};


/**
 * Sets the info template.
 * @param {!Object} template
 */
cwc.ui.Runner.prototype.setInfoTemplate = function(template) {
  this.infoTemplate = template;
};


/**
 * Sets the terminate template.
 * @param {!Object} template
 * @param {string=} opt_prefix
 */
cwc.ui.Runner.prototype.setOverlayTemplate = function(template,
    opt_prefix) {
  if (template) {
    this.overlayTemplate = template;
    this.overlayTemplatePrefix = opt_prefix || '';
  } else {
    console.error('None overlay template!');
  }
};


/**
 * Sets the connect template.
 * @param {!Object} template
 */
cwc.ui.Runner.prototype.setConnectTemplate = function(template) {
  this.templateConnect = template;
};


/**
 * Sets the disconnect template.
 * @param {!Object} template
 */
cwc.ui.Runner.prototype.setDisconnectTemplate = function(template) {
  this.templateDisconnect = template;
};


/**
 * Sets the prepare template.
 * @param {!Object} template
 */
cwc.ui.Runner.prototype.setPrepareTemplate = function(template) {
  this.templatePrepare = template;
};


/**
 * Sets the run template.
 * @param {!Object} template
 */
cwc.ui.Runner.prototype.setRunTemplate = function(template) {
  this.templateRun = template;
};


/**
 * Sets the reload template.
 * @param {!Object} template
 */
cwc.ui.Runner.prototype.setReloadTemplate = function(template) {
  this.templateReload = template;
};


/**
 * Sets the stop template.
 * @param {!Object} template
 */
cwc.ui.Runner.prototype.setStopTemplate = function(template) {
  this.templateStop = template;
};


/**
 * Sets the terminate template.
 * @param {!Object} template
 */
cwc.ui.Runner.prototype.setTerminateTemplate = function(template) {
  this.templateTerminate = template;
};


/**
 * Render the info template.
 * @param {Object} template
 */
cwc.ui.Runner.prototype.renderInfoTemplate = function(template) {
  if (this.nodeInfo && template) {
    goog.soy.renderElement(this.nodeInfo, template);
  }
};


/**
 * Render the status template, if no overlay is in place.
 * @param {Object} template
 */
cwc.ui.Runner.prototype.renderStatusTemplate = function(template) {
  if (this.nodeStatus && template && !this.overlayTemplate) {
    goog.soy.renderElement(this.nodeStatus, template);
  }
};


/**
 * Render the overlay template.
 * @param {Object} template
 */
cwc.ui.Runner.prototype.renderOverlayTemplate = function(template) {
  if (this.nodeOverlay && template) {
    goog.soy.renderElement(this.nodeOverlay, template,
        {'prefix' : this.overlayTemplatePrefix});
  }
};


/**
 * Will run on each .reload, .stop and .terminated().
 * @param {function()} func
 */
cwc.ui.Runner.prototype.setCleanUpFunction = function(func) {
  if (goog.isFunction(func)) {
    this.externalCleanUp = func;
  }
};


/**
 * Shows a connect message.
 */
cwc.ui.Runner.prototype.showConnect = function() {
  this.renderStatusTemplate(this.templateConnect);
};


/**
 * Shows a disconnect message.
 */
cwc.ui.Runner.prototype.showDisconnect = function() {
  this.renderStatusTemplate(this.templateDisconnect);
};


/**
 * Toggles the info window.
 */
cwc.ui.Runner.prototype.toggleInfo = function() {
  if (this.nodeInfo) {
    this.showInfo(!goog.style.isElementShown(this.nodeInfo));
  }
};


/**
 * Shows / hides info window.
 * @param {boolean} visible
 */
cwc.ui.Runner.prototype.showInfo = function(visible) {
  if (this.nodeInfo) {
    goog.style.setElementShown(this.nodeInfo, visible);
  }
};


/**
 * Shows / hides overlay window.
 * @param {boolean} visible
 */
cwc.ui.Runner.prototype.showOverlay = function(visible) {
  if (this.nodeOverlay) {
    goog.style.setElementShown(this.nodeOverlay, visible);
  }
};


/**
 * Shows / hides terminal window.
 * @param {boolean} visible
 */
cwc.ui.Runner.prototype.showTerminal = function(visible) {
  if (this.nodeTerminal) {
    goog.style.setElementShown(this.nodeTerminal, visible);
  }
};


/**
 * Enable / disable terminal.
 * @param {boolean} enable
 */
cwc.ui.Runner.prototype.enableTerminal = function(enable) {
  this.showTerminal(enable);
  if (this.infobar) {
    this.infobar.enableTerminal(enable);
  }
};


/**
 * @param {string} data
 */
cwc.ui.Runner.prototype.writeTerminal = function(data) {
  if (this.terminal) {
    this.terminal.write(data);
  }
};


/**
 * Constructs the runner and executes the content.
 * @param {Event=} opt_event
 * @export
 */
cwc.ui.Runner.prototype.run = function(opt_event) {
  var rendererInstance = this.helper.getInstance('renderer', true);
  var contentUrl = rendererInstance.getContentUrl();
  if (!contentUrl) {
    console.error('Was not able to get content url!');
    return;
  }

  if (this.infobar) {
    this.infobar.clear();
  }

  this.showInfo(false);
  this.prepare();
  if (this.toolbar) {
    this.toolbar.setRunStatus(true);
  }
  this.setContentUrl(contentUrl);
  console.log('Locally executing code: ', contentUrl);
};


/**
 * Prepares the webview element for the Runner content.
 */
cwc.ui.Runner.prototype.prepare = function() {
  if (this.content) {
    if (this.status == cwc.ui.RunnerStatus.LOADING ||
        this.status == cwc.ui.RunnerStatus.UNRESPONSIVE) {
      this.terminate();
    }
    this.stop();
    goog.dom.removeChildren(this.nodeRuntime);
  }
  this.renderStatusTemplate(this.templatePrepare);

  this.content = document.createElement('webview');
  this.content.addEventListener('consolemessage',
      this.handleConsoleMessage.bind(this), false);
  this.content.addEventListener('loadstart',
      this.handleLoadStart.bind(this), false);
  this.content.addEventListener('loadstop',
      this.handleLoadStop.bind(this), false);
  this.content.addEventListener('unresponsive',
      this.handleUnresponsive.bind(this), false);

  goog.dom.appendChild(this.nodeRuntime, this.content);
};


/**
 * Stops the runner window.
 * @export
 */
cwc.ui.Runner.prototype.stop = function() {
  if (this.content) {
    console.info('Stop Runner ...');
    this.status = cwc.ui.RunnerStatus.STOPPED;
    this.renderStatusTemplate(this.templateStop);
    if (this.externalCleanUp) {
      this.externalCleanUp();
    }
    this.content.stop();
    if (this.externalCleanUp) {
      this.externalCleanUp();
    }
    if (this.toolbar) {
      this.toolbar.setRunStatus(false);
    }
    this.setStatusText('Stopped');
  }
};


/**
 * Reloads the runner window.
 * @export
 */
cwc.ui.Runner.prototype.reload = function() {
  if (this.content) {
    console.info('Reload Runner ...');
    this.renderStatusTemplate(this.templateReload);
    if (this.externalCleanUp) {
      this.externalCleanUp();
    }
    if (this.toolbar) {
      this.toolbar.setRunStatus(true);
    }
    this.content.reload();
  }
};


/**
 * Terminates the runner window.
 * @export
 */
cwc.ui.Runner.prototype.terminate = function() {
  if (this.content) {
    console.info('Terminate Runner ...');
    this.status = cwc.ui.RunnerStatus.TERMINATED;
    this.renderStatusTemplate(this.templateTerminate);

    if (this.externalCleanUp) {
      this.externalCleanUp();
    }
    if (this.toolbar) {
      this.toolbar.setRunStatus(false);
    }
    this.content.terminate();
  }
};


/**
 * @param {!string} url
 */
cwc.ui.Runner.prototype.setContentUrl = function(url) {
  if (this.content) {
    this.content.src = url;
  }
};


/**
 * @param {string!} command
 * @param {object|number|string|array=} opt_value
 */
cwc.ui.Runner.prototype.send = function(command, opt_value) {
  if (!this.content) {
    console.error('Was not able to send command:', command);
    return;
  }

  if (this.status == cwc.ui.RunnerStatus.LOADED) {
    var commandBlock = {'command': command, 'value': opt_value};
    this.content.contentWindow.postMessage(commandBlock, this.targetOrigin);
  }
};


/**
 * Collects all messages from the preview window for the console.
 * @param {Event} event
 */
cwc.ui.Runner.prototype.handleConsoleMessage = function(event) {
  if (this.infobar) {
    this.infobar.addMessage(event);
  }
};


/**
 * Displays the start of load event.
 * @param {Event=} opt_event
 */
cwc.ui.Runner.prototype.handleLoadStart = function(opt_event) {
  this.status = cwc.ui.RunnerStatus.LOADING;
  this.startTime = new Date().getTime();
  if (this.toolbar) {
    this.toolbar.setLoadStatus(true);
  }
  this.setStatusText('Loading ...');
};


/**
 * Displays the end of the load event.
 * @param {Event=} opt_event
 */
cwc.ui.Runner.prototype.handleLoadStop = function(opt_event) {
  this.status = cwc.ui.RunnerStatus.LOADED;
  var duration = (new Date().getTime() - this.startTime) / 1000;
  if (this.toolbar) {
    this.toolbar.setLoadStatus(false);
  }
  this.setStatusText('Finished after ' + duration + ' seconds.');
  this.executeCommand('__init__', null, true);
  this.executeCommand('__reset__', null, true);
  this.send('__handshake__');
  this.renderStatusTemplate(this.templateRun);
};


/**
 * Shows an unresponsive warning with the option to terminate the preview.
 * @param {Event=} opt_event
 */
cwc.ui.Runner.prototype.handleUnresponsive = function(opt_event) {
  this.setStatusText('Unresponsive');
  this.status = cwc.ui.RunnerStatus.UNRESPONSIVE;

  var dialog = new goog.ui.Dialog();
  dialog.setTitle('Unresponsive Warning');
  dialog.setContent('The runner is unresponsive, terminate ?');
  dialog.setButtonSet(goog.ui.Dialog.ButtonSet.createYesNo());
  dialog.setDisposeOnHide(true);
  dialog.render();

  goog.events.listen(dialog, goog.ui.Dialog.EventType.SELECT, function(event) {
    if (event.key == 'yes') {
      this.terminate();
    }
  }, false, this);

  dialog.setVisible(true);
};


/**
 * @param {string} status
 */
cwc.ui.Runner.prototype.setStatusText = function(status) {
  if (this.statusbar) {
    this.statusbar.setStatus(status);
  }
};


/**
 * @param {goog.events.BrowserEvent} event
 */
cwc.ui.Runner.prototype.handleMessage = function(event) {
  var browserEvent = event.getBrowserEvent();
  if (!browserEvent) {
    console.error('Was not able to get browser event!');
    return;
  }

  this.executeCommand(browserEvent['data']['command'],
      browserEvent['data']['value']);
};


/**
 * @param {string} name
 * @param {function(?)} func
 */
cwc.ui.Runner.prototype.addCommand = function(name, func) {
  this.commands[name] = func;
};


/**
 * @param {!string} name
 * @param {?} value
 * @param {boolean=} opt_ignore_unknown
 */
cwc.ui.Runner.prototype.executeCommand = function(name, value,
    opt_ignore_unknown) {
  if (name in this.commands) {
    this.commands[name](value);
  } else if (!opt_ignore_unknown) {
    console.log('Received unknow command', name, 'with value', value);
  }
};


/**
 * @param {boolean} visible
 */
cwc.ui.Runner.prototype.showRunButton = function(visible) {
  if (this.toolbar) {
    this.toolbar.showRunButton(visible);
  }
};


/**
 * Adds an event listener for a specific event on a native event
 * target (such as a DOM element) or an object that has implemented
 * {@link goog.events.Listenable}.
 *
 * @param {EventTarget|goog.events.Listenable} src
 * @param {string} type
 * @param {function()} listener
 * @param {boolean=} opt_useCapture
 * @param {Object=} opt_listenerScope
 */
cwc.ui.Runner.prototype.addEventListener = function(src, type,
    listener, opt_useCapture, opt_listenerScope) {
  var eventListener = goog.events.listen(src, type, listener, opt_useCapture,
      opt_listenerScope);
  goog.array.insert(this.listener, eventListener);
};


/**
 * Clears all object based events.
 */
cwc.ui.Runner.prototype.cleanUp = function() {
  window.removeEventListener('message', this.handleMessage.bind(this));
  this.listener = this.helper.removeEventListeners(this.listener);
  this.styleSheet = this.helper.uninstallStyles(this.styleSheet);
  this.terminate();
};
