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

goog.require('cwc.soy.ui.Layout.blank');
goog.require('cwc.soy.ui.Layout.default');
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
  DEFAULT: 'default',
  BLANK: 'blank',
  NONE: 'none',
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
  this.decorateBlank();
};


/**
 * Decorates blank layout.
 */
cwc.ui.Layout.prototype.decorateBlank = function() {
  this.renderTemplate_(cwc.soy.ui.Layout.blank.template,
    cwc.ui.LayoutType.BLANK);
  this.adjustSize();
};


/**
 * Decorates the given node and adds the simple two column layout.
 * @param {number=} first_splitpane_size
 */
cwc.ui.Layout.prototype.decorateDefault = function(
    first_splitpane_size = 400) {
  this.renderTemplate_(cwc.soy.ui.Layout.default.template,
    cwc.ui.LayoutType.DEFAULT);
  let chromeMain = this.getNode_('chrome-main');
  let leftComponent = new goog.ui.Component();
  let rightComponent = new goog.ui.Component();
  this.firstSplitpane = new goog.ui.SplitPane(leftComponent, rightComponent,
      goog.ui.SplitPane.Orientation.HORIZONTAL);
  this.firstSplitpane.setInitialSize(first_splitpane_size);
  this.firstSplitpane.setHandleSize(this.handleSize);
  this.firstSplitpane.decorate(chromeMain);
  this.monitorResize(this.firstSplitpane);
  this.adjustSizeOnChange(this.firstSplitpane);
  this.adjustSize();
  this.firstSplitpane.setFirstComponentSize(first_splitpane_size);
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
  this.updateSizeInformation();
  this.adjustLayoutChrome();

  switch (this.layout) {
    case cwc.ui.LayoutType.BLANK:
      goog.style.setSize(this.nodes['content'], this.chromeSize);
      break;

    case cwc.ui.LayoutType.DEFAULT:
      if (!this.fullscreen) {
        if (this.fixRightComponentSize) {
          firstSplitpaneComponentSize = this.chromeSize.width -
           this.handleSize - this.fixRightComponentSize;
        }
      }
      this.firstSplitpane.setSize(this.chromeSize, firstSplitpaneComponentSize);
      break;

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
  if (this.firstSplitpane) {
    this.firstSplitpane.setHandleSize(this.handleSize);
  }
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
 * Adjusts the main UI element to fullscreen.
 * @param {!boolean} fullscreen
 * @param {number=} size
 */
cwc.ui.Layout.prototype.setFullscreen = function(fullscreen, size) {
  if (fullscreen && this.fullscreen !== fullscreen) {
    this.firstSplitpaneCachedSize = (this.firstSplitpane) ?
        this.firstSplitpane.getFirstComponentSize() : 200;
    this.secondSplitpaneCachedSize = (this.secondSplitpane) ?
        this.secondSplitpane.getFirstComponentSize() : 200;
  }
  let chromeWidth = (size !== undefined) ? size :
      this.chromeSize.width - this.handleSize;
  switch (this.layout) {
    case cwc.ui.LayoutType.DEFAULT:
      this.firstSplitpane.setFirstComponentSize(fullscreen ?
          chromeWidth : this.firstSplitpaneCachedSize);
      break;
  }

  this.handleResizeEvent();
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
 * @param {string=} prefix
 */
cwc.ui.Layout.prototype.renderLeftContent = function(template, prefix = '') {
  this.renderContent_(template, this.getNode('content-left'), prefix);
};


/**
 * @param {!function ({prefix: string}, null=): soydata.SanitizedHtml} template
 * @param {string=} prefix
 */
cwc.ui.Layout.prototype.renderMiddleContent = function(template, prefix = '') {
  this.renderContent_(template, this.getNode('content-middle'), prefix);
};


/**
 * @param {!function ({prefix: string}, null=): soydata.SanitizedHtml} template
 * @param {string=} prefix
 */
cwc.ui.Layout.prototype.renderRightContent = function(template, prefix = '') {
  this.renderContent_(template, this.getNode('content-right'), prefix);
};


/**
 * @param {!function ({prefix: string}, null=): soydata.SanitizedHtml} template
 * @param {Element} node
 * @param {string=} prefix
 * @private
 */
cwc.ui.Layout.prototype.renderContent_ = function(template, node, prefix = '') {
  goog.soy.renderElement(node, template, {
    'prefix': prefix || this.helper.getPrefix(),
  });
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
    'content-left': this.getNode_('content-left-chrome'),
    'content-middle': this.getNode_('content-middle-chrome'),
    'content-right': this.getNode_('content-right-chrome'),
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
  this.setFullscreen(false);
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
