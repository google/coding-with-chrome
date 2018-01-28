/**
 * @fileoverview Layouts for the Coding with Chrome editor.
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
goog.provide('cwc.ui.Layout');
goog.provide('cwc.ui.LayoutType');

goog.require('cwc.soy.ui.Layout');
goog.require('cwc.soy.ui.Layout.simpleSingleColumn');
goog.require('cwc.soy.ui.Layout.simpleTwoColumn');
goog.require('cwc.utils.Helper');

goog.require('goog.dom');
goog.require('goog.dom.ViewportSizeMonitor');
goog.require('goog.dom.classlist');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('goog.math.Size');
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('goog.ui.SplitPane');
goog.require('goog.ui.SplitPane.Orientation');


/**
 * Supported layout types.
 * @enum {!string}
 */
cwc.ui.LayoutType = {
  DEFAULT: 'DEFAULT',
  SIMPLE_SINGLE_COLUMN: 'SIMPLE_SINGLE_COLUMN',
  SIMPLE_TWO_COLUMN: 'SIMPLE_TWO_COLUMN',
  NONE: 'NONE',
};


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.Layout = function(helper) {
  /** @type {string} */
  this.name = 'Layout';

  /** @type {goog.dom.ViewportSizeMonitor} */
  this.viewport_monitor = null;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('layout');

  /** @type {Element} */
  this.node = null;

  /** @type {!Object.<Element>} */
  this.nodes = {};

  /** @type {!number} */
  this.defaultHandleSize = 12;

  /** @type {!number} */
  this.handleSize = this.defaultHandleSize;

  /** @type {cwc.ui.LayoutType} */
  this.layout = cwc.ui.LayoutType.NONE;

  /** @type {Array} */
  this.listener_ = [];

  /** @type {Array} */
  this.customListener = [];

  /** @type {goog.events.EventTarget} */
  this.eventHandler = new goog.events.EventTarget();

  /** @type {goog.math.Size} */
  this.headerSize = new goog.math.Size(0, 0);

  /** @type {!goog.math.Size} */
  this.chromeSize = new goog.math.Size(400, 400);

  /** @type {goog.math.Size} */
  this.viewportSize = new goog.math.Size(0, 0);

  /** @type {?number} */
  this.fixLeftComponentSize = null;

  /** @type {?number} */
  this.fixRightComponentSize = null;

  /** @type {?number} */
  this.fixTopComponentSize = null;

  /** @type {?number} */
  this.fixBottomComponentSize = null;

  /** @type {goog.ui.SplitPane} */
  this.firstSplitpane = null;

  /** @type {goog.ui.SplitPane} */
  this.secondSplitpane = null;

  /** @type {?number} */
  this.firstSplitpaneCachedSize = null;

  /** @type {?number} */
  this.secondSplitpaneCachedSize = null;

  /** @type {boolean} */
  this.fullscreen = false;

  /** @type {boolean} */
  this.sidebarPanelFullscreen = false;

  /** @type {boolean} */
  this.leftPanelFullscreen = false;

  /** @type {boolean} */
  this.rightPanelFullscreen = false;
};


/**
 * @param {string} name
 * @return {Element}
 * @private
 */
cwc.ui.Layout.prototype.getNode_ = function(name) {
  return goog.dom.getElement(this.prefix + name);
};


/**
 * Prepares the layout.
 */
cwc.ui.Layout.prototype.prepare = function() {
  let guiInstance = this.helper.getInstance('gui', true);
  this.node = guiInstance.getLayoutNode();
  this.viewport_monitor = new goog.dom.ViewportSizeMonitor();
  goog.events.listen(this.viewport_monitor, goog.events.EventType.RESIZE,
                     this.adjustSize, false, this);
  this.renderTemplate_(cwc.soy.ui.Layout.template, cwc.ui.LayoutType.DEFAULT);
};


/**
 * Decorates the given node and adds the simple single column layout.
 */
cwc.ui.Layout.prototype.decorateSimpleSingleColumnLayout = function() {
  this.renderTemplate_(cwc.soy.ui.Layout.simpleSingleColumn.template,
    cwc.ui.LayoutType.SIMPLE_SINGLE_COLUMN);
  this.adjustSize();
};


/**
 * Decorates the given node and adds the simple two column layout.
 * In addition to the two main panels, there is a hidden sidebar
 * that can be shown by calling "showSidebar"
 * @param {number=} main_size
 */
cwc.ui.Layout.prototype.decorateSimpleTwoColumnLayout = function(
    main_size = 400) {
  this.renderTemplate_(cwc.soy.ui.Layout.simpleTwoColumn.template,
    cwc.ui.LayoutType.SIMPLE_TWO_COLUMN);


  let chromeMain = this.getNode_('chrome-main');
  let sidebarPane = new goog.ui.Component();
  // Sidebar hidden by default
  let sidebarPaneSize = 0;
  let mainContentPane = new goog.ui.Component();
  this.firstSplitpane = new goog.ui.SplitPane(sidebarPane, mainContentPane,
      goog.ui.SplitPane.Orientation.HORIZONTAL);
  this.firstSplitpane.setInitialSize(sidebarPaneSize);
  this.firstSplitpane.setHandleSize(0);
  this.firstSplitpane.decorate(chromeMain);
  this.monitorResize(this.firstSplitpane);
  this.adjustSizeOnChange(this.firstSplitpane);
  this.adjustSize();
  this.firstSplitpane.setFirstComponentSize(sidebarPaneSize);


  let chromeContent = this.getNode_('chrome-content');
  let chromeContentLeftComponent = new goog.ui.Component();
  let chromeContentRightComponent = new goog.ui.Component();
  this.secondSplitpane = new goog.ui.SplitPane(chromeContentLeftComponent,
      chromeContentRightComponent, goog.ui.SplitPane.Orientation.HORIZONTAL);
  this.secondSplitpane.setInitialSize(main_size);
  this.secondSplitpane.setHandleSize(this.handleSize);
  this.secondSplitpane.decorate(chromeContent);
  this.monitorResize(this.secondSplitpane);
  this.adjustSizeOnChange(this.secondSplitpane);
  this.adjustSize();
  this.secondSplitpane.setFirstComponentSize(main_size);
};


/**
 * Returns the available nodes of the current layout.
 * @return {Object}
 */
cwc.ui.Layout.prototype.getNodes = function() {
  return this.nodes;
};


/**
 * Returns the named node of the current layout.
 * @param {!string} name
 * @return {Object}
 */
cwc.ui.Layout.prototype.getNode = function(name) {
  if (name in this.nodes) {
    return this.nodes[name];
  }
  return null;
};


/**
 * @return {Element}
 */
cwc.ui.Layout.prototype.getOverlay = function() {
  return this.nodes['overlay'];
};


/**
 * @param {boolean} visible
 */
cwc.ui.Layout.prototype.showOverlay = function(visible) {
  let overlay = this.getOverlay();
  if (overlay) {
    goog.style.setElementShown(overlay, visible);
    if (visible) {
      this.refresh();
    }
  }
};


/**
 * Return the available splitpanes for the current layout.
 * @return {Object}
 */
cwc.ui.Layout.prototype.getSplitpane = function() {
  return {
    'first': this.firstSplitpane,
    'second': this.secondSplitpane,
  };
};


/**
 * Update sizes.
 */
cwc.ui.Layout.prototype.updateSizeInformation = function() {
  this.viewportSize = this.viewport_monitor.getSize();
  let guiInstance = this.helper.getInstance('gui');
  if (guiInstance) {
    this.headerSize = guiInstance.getHeaderSize();
    this.chromeSize = new goog.math.Size(this.viewportSize.width,
        this.viewportSize.height - this.headerSize.height);
  } else {
    this.headerSize = null;
    this.chromeSize = new goog.math.Size(this.viewportSize.width,
        this.viewportSize.height);
  }
};


/**
 * Refresh dom structure and trigger external frameworks.
 */
cwc.ui.Layout.prototype.refresh = function() {
  if (typeof window.componentHandler !== 'undefined') {
    window.componentHandler.upgradeDom();
  }
};


/**
 * Adjusts size of the layout chrome.
 */
cwc.ui.Layout.prototype.adjustLayoutChrome = function() {
  if (this.node) {
    goog.style.setSize(this.node, this.chromeSize);
  }
  if (this.nodes['overlay']) {
    goog.style.setSize(this.nodes['overlay'], this.chromeSize);
  }
};


/**
 * Adds event listener to adjust size of the split plane on drag and snap.
 * @param {goog.ui.SplitPane} splitpane
 */
cwc.ui.Layout.prototype.adjustSizeOnChange = function(splitpane) {
  this.addEventListener_(splitpane, goog.ui.SplitPane.EventType.HANDLE_DRAG,
      this.adjustSize, false, this);

  this.addEventListener_(splitpane, goog.ui.SplitPane.EventType.HANDLE_SNAP,
      this.adjustSize, false, this);
};


/**
 * Adjusts the UI to the correct size after an resize.
 */
cwc.ui.Layout.prototype.adjustSize = function() {
  let firstSplitpaneComponentSize = null;
  let secondSplitpaneComponentSize = null;
  this.updateSizeInformation();
  this.adjustLayoutChrome();

  switch (this.layout) {
    case cwc.ui.LayoutType.SIMPLE_SINGLE_COLUMN:
      goog.style.setSize(this.nodes['content'], this.chromeSize);
      break;

    case cwc.ui.LayoutType.SIMPLE_TWO_COLUMN:
      if (this.sidebarPanelFullscreen) {
        firstSplitpaneComponentSize = this.chromeSize.width;
      } else if (this.leftPanelFullscreen) {
        firstSplitpaneComponentSize = 0;
        secondSplitpaneComponentSize = this.chromeSize.width;
      } else if (this.rightPanelFullscreen) {
        firstSplitpaneComponentSize = 0;
        secondSplitpaneComponentSize = 0;
      } else {
        if (this.fixLeftComponentSize) {
          secondSplitpaneComponentSize = this.fixLeftComponentSize;
        }
        if (this.fixRightComponentSize) {
          secondSplitpaneComponentSize = this.chromeSize.width -
            this.firstSplitpane.getFirstComponentSize() - this.handleSize -
            this.fixRightComponentSize;
        }
      }

      this.firstSplitpane.setSize(this.chromeSize, firstSplitpaneComponentSize);
      if (this.secondSplitpane) {
        this.secondSplitpane.setSize(
          new goog.math.Size(
            this.chromeSize.width - this.firstSplitpane.getFirstComponentSize(),
            this.chromeSize.height
          ),
          secondSplitpaneComponentSize);
      }
      break;

    case cwc.ui.LayoutType.DEFAULT:
    case cwc.ui.LayoutType.NONE:
      break;

    default:
      console.error('Unknown layout:', this.layout);
      break;
  }
  this.handleResizeEvent();
};


/**
 * @param {!number} size
 */
cwc.ui.Layout.prototype.setHandleSize = function(size) {
  this.handleSize = size;
  if (this.secondSplitpane) {
    this.secondSplitpane.setHandleSize(this.handleSize);
  }
  this.adjustSize();
};


/**
 * Clears the custom component sizes.
 */
cwc.ui.Layout.prototype.cleanFixComponentSizes = function() {
  this.fixLeftComponentSize = null;
  this.fixRightComponentSize = null;
  this.fixTopComponentSize = null;
  this.fixBottomComponentSize = null;
};


/**
 * Show the sidebar
 */
cwc.ui.Layout.prototype.showSidebar = function() {
  this.firstSplitpane.setSize(this.chromeSize, 400);
  this.firstSplitpane.setHandleSize(this.defaultHandleSize);
  this.adjustSize();
};


/**
 * Hide the sidebar
 */
cwc.ui.Layout.prototype.hideSidebar = function() {
  this.firstSplitpane.setSize(this.chromeSize, 0);
  this.firstSplitpane.setHandleSize(0);
  this.adjustSize();
};


/**
 * @param {!number} size Fix left component size.
 */
cwc.ui.Layout.prototype.setFixLeftComponentSize = function(size) {
  this.fixLeftComponentSize = size;
  this.fixRightComponentSize = null;
  this.adjustSize();
};


/**
 * @param {!number} size Fix right component size.
 */
cwc.ui.Layout.prototype.setFixRightComponentSize = function(size) {
  this.fixLeftComponentSize = null;
  this.fixRightComponentSize = size;
  this.adjustSize();
};


/**
 * @param {!number} size Fix top component size.
 */
cwc.ui.Layout.prototype.setFixTopComponentSize = function(size) {
  this.fixTopComponentSize = size;
  this.fixBottomComponentSize = null;
  this.adjustSize();
};


/**
 * @param {!number} size Fix bottom component size.
 */
cwc.ui.Layout.prototype.setFixBottomComponentSize = function(size) {
  this.fixTopComponentSize = null;
  this.fixBottomComponentSize = size;
  this.adjustSize();
};


/**
 * @param {boolean} fullscreen Indicates if the panel should expand to fullscreen
 * @param {Element=} panelNode The panel to expand or collapse
 */
cwc.ui.Layout.prototype.setPanelFullscreen = function(fullscreen, panelNode) {
  if (!this.fullscreen) {
    this.firstSplitpaneCachedSize = (this.firstSplitpane) ?
        this.firstSplitpane.getFirstComponentSize() : 200;
    this.secondSplitpaneCachedSize = (this.secondSplitpane) ?
        this.secondSplitpane.getFirstComponentSize() : 200;
    this.sidebarPanelFullscreen = false;
    this.leftPanelFullscreen = false;
    this.rightPanelFullscreen = false;
  }

  if (goog.isDef(panelNode)) {
    if (panelNode === this.nodes['content-left']) {
      this.setLeftPanelFullscreen_(fullscreen);
    } else if (panelNode === this.nodes['content-sidebar']) {
      this.setSidebarPanelFullscreen_(fullscreen);
    } else if (panelNode === this.nodes['content-right']) {
      this.setRightPanelFullscreen_(fullscreen);
    }
  }

  if (this.firstSplitpane) {
    this.firstSplitpane.setHandleSize(fullscreen ? 0 : this.defaultHandleSize);
  }
  if (this.secondSplitpane) {
    this.secondSplitpane.setHandleSize(fullscreen ? 0 : this.handleSize);
  }

  this.fullscreen = fullscreen;
  this.handleResizeEvent();
  this.adjustSize();
};


/**
 * @param {boolean} fullscreen Indicates if the panel should expand to fullscreen
 */
cwc.ui.Layout.prototype.setSidebarPanelFullscreen_ = function(fullscreen) {
  this.firstSplitpane.setFirstComponentSize(fullscreen ?
    this.chromeSize.width : this.firstSplitpaneCachedSize);
  this.sidebarPanelFullscreen = fullscreen;
};


/**
 * @param {boolean} fullscreen Indicates if the panel should expand to fullscreen
 */
cwc.ui.Layout.prototype.setLeftPanelFullscreen_ = function(fullscreen) {
  this.firstSplitpane.setFirstComponentSize(fullscreen ?
      0 : this.firstSplitpaneCachedSize);
  if (this.secondSplitpane) {
    this.secondSplitpane.setFirstComponentSize(fullscreen ?
        this.chromeSize.width : this.secondSplitpaneCachedSize);
  }
  this.leftPanelFullscreen = fullscreen;
};


/**
 * @param {boolean} fullscreen Indicates if the panel should expand to fullscreen
 */
cwc.ui.Layout.prototype.setRightPanelFullscreen_ = function(fullscreen) {
  this.firstSplitpane.setFirstComponentSize(fullscreen ?
    0 : this.firstSplitpaneCachedSize);
  if (this.secondSplitpane) {
    this.secondSplitpane.setFirstComponentSize(fullscreen ?
      0 : this.secondSplitpaneCachedSize);
  }
  this.rightPanelFullscreen = fullscreen;
};


/**
 * Adds an event listener to monitor the size of the splitpane.
 * @param {!goog.ui.SplitPane} splitpane
 * @private
 */
cwc.ui.Layout.prototype.monitorResize = function(splitpane) {
  this.addCustomEventListener_(splitpane,
      goog.ui.SplitPane.EventType.HANDLE_DRAG,
      this.handleResizeEvent, false, this);

  this.addCustomEventListener_(splitpane,
      goog.ui.SplitPane.EventType.HANDLE_SNAP,
      this.handleResizeEvent, false, this);
};


/**
 * Dispatches a resize event for any layout change to the event handler.
 */
cwc.ui.Layout.prototype.handleResizeEvent = function() {
  this.eventHandler.dispatchEvent(goog.events.EventType.RESIZE);
};


/**
 * @param {!function ({prefix: string}, null=): soydata.SanitizedHtml} template
 * @param {cwc.ui.LayoutType=} type
 * @private
 */
cwc.ui.Layout.prototype.renderTemplate_ = function(template, type) {
  this.resetLayout_();
  goog.soy.renderElement(this.node, template, {'prefix': this.prefix});
  this.nodes = {
    'content': this.getNode_('content-chrome'),
    'content-sidebar': this.getNode_('content-sidebar'),
    'content-left': this.getNode_('content-left-chrome'),
    'content-right': this.getNode_('content-right-chrome'),
    'content-top': this.getNode_('content-top-chrome'),
    'content-bottom': this.getNode_('content-bottom-chrome'),
    'overlay': this.getNode_('content-overlay'),
  };
  if (type) {
    this.layout = type;
  }
};


/**
 * Resets event handler and cached values.
 * @private
 */
cwc.ui.Layout.prototype.resetLayout_ = function() {
  this.eventHandler.dispatchEvent(goog.events.EventType.UNLOAD);
  this.setPanelFullscreen(false);
  this.setHandleSize(this.defaultHandleSize);
  this.customListener = this.helper.removeEventListeners(this.customListener,
      this.name);
  this.cleanFixComponentSizes();
  this.cleanSplitpaneCachedSize();
  this.firstSplitpane = null;
  this.secondSplitpane = null;
};


/**
 * Adds an event listener for a specific event on a native event
 * target (such as a DOM element) or an object that has implemented
 * {@link goog.events.Listenable}.
 *
 * @param {EventTarget|goog.events.Listenable} src
 * @param {string} type
 * @param {function()} listener
 * @param {boolean=} capture
 * @param {Object=} scope
 * @private
 */
cwc.ui.Layout.prototype.addEventListener_ = function(src, type, listener,
    capture = false, scope = undefined) {
  let eventListener = goog.events.listen(src, type, listener, capture, scope);
  goog.array.insert(this.listener_, eventListener);
};


/**
 * Adds an event listener for a specific event on a native event
 * target (such as a DOM element) or an object that has implemented
 * {@link goog.events.Listenable}.
 *
 * @param {EventTarget|goog.events.Listenable} src
 * @param {string} type
 * @param {function()} listener
 * @param {boolean=} capture
 * @param {Object=} scope
 */
cwc.ui.Layout.prototype.addCustomEventListener_ = function(src, type, listener,
    capture = false, scope = undefined) {
  let eventListener = goog.events.listen(src, type, listener, capture, scope);
  goog.array.insert(this.customListener, eventListener);
};


/**
 * Clears all object based events.
 */
cwc.ui.Layout.prototype.cleanUp = function() {
  this.listener_ = this.helper.removeEventListeners(this.listener_, this.name);
  this.resetLayout_();
};


/**
 * Clears the cached splitpane sizes.
 */
cwc.ui.Layout.prototype.cleanSplitpaneCachedSize = function() {
  this.firstSplitpaneCachedSize = null;
  this.secondSplitpaneCachedSize = null;
};


/**
 * @return {goog.events.EventTarget}
 */
cwc.ui.Layout.prototype.getEventHandler = function() {
  return this.eventHandler;
};
