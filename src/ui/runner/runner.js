/**
 * @fileoverview Runner for the Coding with Chrome editor.
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
goog.provide('cwc.ui.Runner');

goog.require('cwc.runner.Connector');
goog.require('cwc.soy.ui.Runner');
goog.require('cwc.ui.RunnerInfobar');
goog.require('cwc.ui.RunnerMonitor');
goog.require('cwc.ui.RunnerTerminal');
goog.require('cwc.ui.StatusButton');
goog.require('cwc.ui.Statusbar');
goog.require('cwc.ui.StatusbarState');
goog.require('cwc.ui.Turtle');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.Logger');

goog.require('goog.dom');
goog.require('goog.events.EventType');
goog.require('goog.soy');
goog.require('goog.style');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.Runner = function(helper) {
  /** @type {string} */
  this.name = 'Runner';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('runner');

  /** @type {!cwc.runner.Connector} */
  this.connector = new cwc.runner.Connector(helper);

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeRuntime = null;

  /** @type {Element} */
  this.nodeTerminal = null;

  /** @type {Element} */
  this.nodeOverlay = null;

  /** @type {Element} */
  this.nodeTurtle = null;

  /** @type {Element} */
  this.nodeMonitor = null;

  /** @type {Webview} */
  this.content = null;

  /** @type {function(Object, null=, Object<string, *>=):*} */
  this.overlayTemplate = function() {};

  /** @type {!string} */
  this.overlayTemplatePrefix = '';

  /** @type {Object} */
  this.commands = {};

  /** @type {cwc.ui.StatusbarState} */
  this.status = cwc.ui.StatusbarState.UNKNOWN;

  /** @type {cwc.ui.StatusButton} */
  this.statusButton = new cwc.ui.StatusButton(this.helper);

  /** @type {cwc.ui.RunnerInfobar} */
  this.infobar = null;

  /** @type {cwc.ui.Statusbar} */
  this.statusbar = null;

  /** @type {cwc.ui.RunnerTerminal} */
  this.terminal = null;

  /** @type {cwc.ui.Turtle} */
  this.turtle = null;

  /** @type {cwc.ui.RunnerMonitor} */
  this.monitor = null;

  /** @type {!boolean} */
  this.monitorEnabled = false;

  /** @type {number} */
  this.startTime = 0;

  /** @type {number} */
  this.stopTime = 0;

  /** @type {?function()} */
  this.externalCleanUp = null;

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name);

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * Decorates the given node and adds the Runner window.
 * @param {Element=} node The target node to add the Runner window.
 */
cwc.ui.Runner.prototype.decorate = function(node) {
  this.node = node || goog.dom.getElement(this.prefix + 'chrome');
  if (!this.node) {
    this.log_.error('Invalid Runner node:', this.node);
    return;
  }

  goog.soy.renderElement(this.node, cwc.soy.ui.Runner.template, {
    prefix: this.prefix,
  });

  // Runtime
  this.nodeRuntime = goog.dom.getElement(this.prefix + 'runtime');

  // Turtle
  this.nodeTurtle = goog.dom.getElement(this.prefix + 'turtle');

  // Statusbar
  let nodeStatusbar = goog.dom.getElement(this.prefix + 'statusbar');
  if (nodeStatusbar) {
    this.statusbar = new cwc.ui.Statusbar(this.helper);
    this.statusbar.decorate(nodeStatusbar);
  }

  // Status Button and actions buttons
  let nodeStatusButton = goog.dom.getElement(this.prefix + 'statusbutton');
  if (nodeStatusButton) {
    this.statusButton.decorate(nodeStatusButton)
      .setFullscreenAction(() => {
        this.helper.getInstance('layout').setFullscreenPreview(true);
      })
      .setFullscreenExitAction(() => {
        this.helper.getInstance('layout').setFullscreenPreview(false);
      })
      .setReloadAction(() => {
        this.refresh();
      })
      .setTerminateAction(this.terminate.bind(this))
      .setRunAction(() => {
        this.run();
      })
      .setStopAction(this.stop.bind(this));
  }

  // Monitor
  this.nodeMonitor = goog.dom.getElement(this.prefix + 'monitor');
  if (this.nodeMonitor) {
    this.monitor = new cwc.ui.RunnerMonitor(this.helper);
    this.monitor.decorate(this.nodeMonitor);
    this.enableMonitor(false);
  }

  // Terminal
  this.nodeTerminal = goog.dom.getElement(this.prefix + 'terminal');
  if (this.nodeTerminal) {
    this.terminal = new cwc.ui.RunnerTerminal(this.helper);
    this.terminal.decorate(this.nodeTerminal);
    this.enableTerminal(false);
  }

  // Overlay
  this.nodeOverlay = goog.dom.getElement(this.prefix + 'overlay');
  this.showOverlay(this.overlayTemplate ? true : false);
  this.renderOverlayTemplate(this.overlayTemplate);

  // Runner
  this.connector.init(true);
  let layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    let eventHandler = layoutInstance.getEventHandler();
    this.events_.listen(eventHandler, goog.events.EventType.UNLOAD,
        this.cleanUp, false, this);
    layoutInstance.refresh();
  }
};


/**
 * Sets the terminate template.
 * @param {!function(Object, null=, Object<string, *>=):*} template
 * @param {string=} prefix
 */
cwc.ui.Runner.prototype.setOverlayTemplate = function(template, prefix = '') {
  if (template) {
    this.overlayTemplate = template;
    this.overlayTemplatePrefix = prefix;
  } else {
    this.log_.error('None overlay template!');
  }
};


/**
 * Render the overlay template.
 * @param {!function(Object, null=, Object<string, *>=):*} template
 */
cwc.ui.Runner.prototype.renderOverlayTemplate = function(template) {
  if (this.nodeOverlay && template) {
    goog.soy.renderElement(this.nodeOverlay, template, {
      'prefix': this.overlayTemplatePrefix});
  }
};


/**
 * Will run on each .reload(), .stop() and .terminated().
 * @param {function()} func
 * @param {Object=} scope
 */
cwc.ui.Runner.prototype.setCleanUpFunction = function(func, scope) {
  if (goog.isFunction(func)) {
    if (scope) {
      this.externalCleanUp = func.bind(scope);
    } else {
      this.externalCleanUp = func;
    }
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
 * Shows / hides turtle window.
 * @param {boolean} visible
 */
cwc.ui.Runner.prototype.showTurtle = function(visible) {
  if (this.nodeTurtle) {
    goog.style.setElementShown(this.nodeTurtle, visible);
  }
};


/**
 * @return {Element}
 */
cwc.ui.Runner.prototype.getTurtleNode = function() {
  return this.nodeTurtle;
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
 * Enable / disable monitor.
 * @param {boolean} enable
 * @param {number=} height
 */
cwc.ui.Runner.prototype.enableMonitor = function(enable, height = 250) {
  this.monitorEnabled = enable;
  this.showMonitor(enable);
  if (enable) {
    goog.style.setHeight(this.nodeMonitor, height);
  }
};


/**
 * Shows / hides terminal window.
 * @param {boolean} visible
 */
cwc.ui.Runner.prototype.showMonitor = function(visible) {
  if (this.nodeMonitor) {
    goog.style.setElementShown(this.nodeMonitor, visible);
  }
};


/**
 * @return {cwc.ui.RunnerMonitor}
 */
cwc.ui.Runner.prototype.getMonitor = function() {
  return this.monitor;
};


/**
 * Constructs the runner and executes the content.
 */
cwc.ui.Runner.prototype.run = function() {
  let rendererInstance = this.helper.getInstance('renderer', true);
  let contentUrl = rendererInstance.getContentUrl();
  if (!contentUrl) {
    this.log_.error('Was not able to get content url!');
    return;
  }

  if (this.infobar) {
    this.infobar.clear();
  }

  if (this.content) {
    if (this.status == cwc.ui.StatusbarState.LOADING ||
        this.status == cwc.ui.StatusbarState.UNRESPONSIVE) {
      this.terminate();
    } else {
      this.stop();
    }
    goog.dom.removeChildren(this.nodeRuntime);
  }
  this.setStatus_(cwc.ui.StatusbarState.PREPARE);

  this.content = /** @type {Webview} */ (document.createElement('webview'));
  this.content.setAttribute('partition', 'runner');
  this.content.addEventListener('consolemessage',
      this.handleConsoleMessage_.bind(this), false);
  this.content.addEventListener('loadstart',
      this.handleLoadStart.bind(this), false);
  this.content.addEventListener('loadstop',
      this.handleLoadStop.bind(this), false);
  this.content.addEventListener('unresponsive',
      this.handleUnresponsive.bind(this), false);
  this.connector.setTarget(this.content);
  goog.dom.appendChild(this.nodeRuntime, this.content);
  this.setContentUrl(contentUrl);
};


/**
 * Stops the runner window.
 */
cwc.ui.Runner.prototype.stop = function() {
  if (this.content) {
    this.setStatus_(cwc.ui.StatusbarState.STOPPED);
    this.content.stop();
    this.setContentUrl('about:blank');
    if (this.externalCleanUp) {
      this.externalCleanUp();
    }
  }
};


/**
 * Refreshes the runner window.
 */
cwc.ui.Runner.prototype.refresh = function() {
  if (this.content) {
    this.setStatus_(cwc.ui.StatusbarState.REFRESHING);
    if (this.externalCleanUp) {
      this.externalCleanUp();
    }
    this.content.stop();
    this.content.reload();
  }
};


/**
 * Reloads the runner window.
 */
cwc.ui.Runner.prototype.reload = function() {
  if (this.content) {
    this.setStatus_(cwc.ui.StatusbarState.RELOADING);
    this.stop();
    this.run();
  }
};


/**
 * Terminates the runner content.
 */
cwc.ui.Runner.prototype.terminate = function() {
  if (this.content) {
    this.setStatus_(cwc.ui.StatusbarState.TERMINATED);
    if (this.externalCleanUp) {
      this.externalCleanUp();
    }
    this.content.terminate();
  }
};


/**
 * Removes the runner content.
 */
cwc.ui.Runner.prototype.remove = function() {
  if (this.content) {
    this.log_.info('Remove Runner...');
    this.terminate();
    this.nodeRuntime.removeChild(this.content);
    this.content = null;
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
 * Collects all messages from the preview window for the console.
 * @param {Event} e
 * @private
 */
cwc.ui.Runner.prototype.handleConsoleMessage_ = function(e) {
  if (this.infobar) {
    this.infobar.addMessage(e);
  }
};


/**
 * Displays the start of load event.
 * @param {Event} e
 */
cwc.ui.Runner.prototype.handleLoadStart = function(e) {
  if (e && e['url'] === 'about:blank') {
    return;
  }
  this.startTime = new Date().getTime();
  this.setStatus_(cwc.ui.StatusbarState.LOADING);
};


/**
 * Displays the end of the load event.
 */
cwc.ui.Runner.prototype.handleLoadStop = function() {
  this.stopTime = new Date().getTime();
  this.setStatus_(cwc.ui.StatusbarState.LOADED);
  this.connector.start();
};


/**
 * Shows an unresponsive warning with the option to terminate the preview.
 */
cwc.ui.Runner.prototype.handleUnresponsive = function() {
  this.setStatus_(cwc.ui.StatusbarState.UNRESPONSIVE);
  let dialogInstance = this.helper.getInstance('dialog');
  dialogInstance.showActionCancel('Unresponsive Warning',
    'The preview is unresponsive! Terminate?', 'Terminate').then((answer) => {
      if (answer) {
        this.terminate();
      }
    });
};


/**
 * @param {!cwc.protocol.sphero.classic.Api} api
 */
cwc.ui.Runner.prototype.addApiProfile = function(api) {
  this.connector.addApiProfile(api);
};


/**
 * @param {string} name
 * @param {function(?)} func
 * @param {?=} scope
 */
cwc.ui.Runner.prototype.addCommand = function(name, func, scope = undefined) {
  this.connector.addCommand(name, func, scope);
};


/**
 * @param {!cwc.runner.profile.ev3.Command|
 *         cwc.runner.profile.makeblock.mbot.Command|
 *         cwc.runner.profile.makeblock.mbotRanger.Command|
 *         cwc.runner.profile.raspberryPi.Command} profile
 * @param {?=} scope
 */
cwc.ui.Runner.prototype.addCommandProfile = function(profile,
    scope = undefined) {
  this.connector.addCommandProfile(profile, scope);
};


/**
 * @param {function(?)} func
 * @param {?=} scope
 */
cwc.ui.Runner.prototype.setStartEvent = function(func, scope = undefined) {
  this.connector.setStartEvent(func, scope);
};


/**
 * @param {string} name
 * @param {function(?)} func
 * @param {?=} scope
 */
cwc.ui.Runner.prototype.addMonitor = function(name, func, scope = undefined) {
  this.connector.addMonitor(name, func, scope);
};


/**
 * @param {!cwc.runner.profile.ev3.Monitor|
 *         cwc.runner.profile.makeblock.mbot.Monitor|
 *         cwc.runner.profile.makeblock.mbotRanger.Monitor|
 *         cwc.runner.profile.sphero.Monitor} profile
 * @param {?=} scope
 */
cwc.ui.Runner.prototype.addMonitorProfile = function(profile,
    scope = undefined) {
  this.connector.addMonitorProfile(profile, scope);
};


/**
 * @param {EventTarget|goog.events.Listenable} event_handler
 * @param {!string} event
 * @param {!string} command
 */
cwc.ui.Runner.prototype.addEvent = function(event_handler, event, command) {
  this.connector.addEvent(event_handler, event, command);
};


/**
 * @param {string!} command
 * @param {Object|number|string|Array=} optValue
 */
cwc.ui.Runner.prototype.send = function(command, optValue) {
  this.connector.send(command, optValue);
};


/**
 * @param {!cwc.ui.StatusbarState} status
 * @private
 */
cwc.ui.Runner.prototype.setStatus_ = function(status) {
  if (this.status === status) {
    return;
  }
  if (this.statusbar) {
    this.statusbar.setStatus(status, this.startTime, this.stopTime);
  }
  if (this.statusButton) {
    this.statusButton.setStatus(status);
  }
  if (this.monitor) {
    this.monitor.setStatus(status);
  }
  this.status = status;
};

/**
 * Clears all object based events.
 */
cwc.ui.Runner.prototype.cleanUp = function() {
  this.events_.clear();
  this.connector.cleanUp();
  this.remove();
};
