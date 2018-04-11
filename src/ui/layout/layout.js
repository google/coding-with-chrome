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
goog.require('cwc.utils.Events');

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
 * Supported layout nodes.
 * @enum {!string}
 */
cwc.ui.LayoutNode = {
  CONTENT: 'content',
  CONTENT_EDITOR: 'content-editor',
  CONTENT_PREVIEW: 'content-preview',
  OVERLAY: 'overlay',
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
  this.handleSize = 2;

  /** @type {cwc.ui.LayoutType} */
  this.layout = cwc.ui.LayoutType.NONE;

  /** @type {goog.events.EventTarget} */
  this.eventHandler = new goog.events.EventTarget();

  /** @type {!goog.math.Size} */
  this.chromeSize = new goog.math.Size(400, 400);

  /** @type {goog.math.Size} */
  this.viewportSize = new goog.math.Size(0, 0);

  /** @type {goog.ui.SplitPane} */
  this.splitpane = null;

  /** @type {?number} */
  this.splitpaneSize = null;

  /** @type {?number} */
  this.splitpaneCachedSize = null;

  /** @type {boolean} */
  this.fullscreen = false;

  /** @type {boolean} */
  this.editorFullscreen = false;

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name);
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
 * @param {number=} splitpaneSize
 */
cwc.ui.Layout.prototype.decorateDefault = function(splitpaneSize = 400) {
  this.renderTemplate_(cwc.soy.ui.Layout.default.template,
    cwc.ui.LayoutType.DEFAULT);
  let chromeMain = this.getNode_('chrome-main');
  let leftComponent = new goog.ui.Component();
  let rightComponent = new goog.ui.Component();
  this.splitpane = new goog.ui.SplitPane(leftComponent, rightComponent,
      goog.ui.SplitPane.Orientation.HORIZONTAL);
  this.splitpane.setInitialSize(splitpaneSize);
  this.splitpane.setHandleSize(this.handleSize);
  this.splitpane.decorate(chromeMain);
  this.adjustSizeOnChange(this.splitpane);
  this.adjustSize();
  this.splitpane.setFirstComponentSize(splitpaneSize);
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
 * @return {Element}
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
 * Update sizes.
 */
cwc.ui.Layout.prototype.updateSizeInformation = function() {
  this.viewportSize = this.viewport_monitor.getSize();
  let guiInstance = this.helper.getInstance('gui');
  if (guiInstance) {
    this.chromeSize = new goog.math.Size(this.viewportSize.width,
        this.viewportSize.height - guiInstance.getHeaderSize().height);
  } else {
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
  this.events_.listen(splitpane, goog.ui.SplitPane.EventType.HANDLE_DRAG_END,
      this.adjustSize, false, this);

  this.events_.listen(splitpane, goog.ui.SplitPane.EventType.HANDLE_SNAP,
      this.adjustSize, false, this);
};


/**
 * Adjusts the UI to the correct size after an resize.
 */
cwc.ui.Layout.prototype.adjustSize = function() {
  this.updateSizeInformation();
  this.adjustLayoutChrome();

  switch (this.layout) {
    case cwc.ui.LayoutType.BLANK:
      goog.style.setSize(this.nodes['content'], this.chromeSize);
      break;

    case cwc.ui.LayoutType.DEFAULT:
      if (this.fullscreen && !this.editorFullscreen) {
        this.splitpane.setFirstComponentSize(
          this.chromeSize.width - this.handleSize);
      } else {
        this.splitpane.setSize(this.chromeSize);
      }
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
  this.splitpane.setHandleSize(this.handleSize);
  this.adjustSize();
};


/**
 * @param {!boolean} fullscreen
 */
cwc.ui.Layout.prototype.setFullscreenEditor = function(fullscreen) {
  this.setFullscreen_(fullscreen, true);
};


/**
 * @param {!boolean} fullscreen
 */
cwc.ui.Layout.prototype.setFullscreenPreview = function(fullscreen) {
  this.setFullscreen_(fullscreen, false);
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
cwc.ui.Layout.prototype.renderContent = function(template, prefix = '') {
  this.renderContent_(template, this.getNode('content'), prefix);
};


/**
 * @param {!function ({prefix: string}, null=): soydata.SanitizedHtml} template
 * @param {string=} prefix
 */
cwc.ui.Layout.prototype.renderEditorContent = function(template, prefix = '') {
  this.renderContent_(template, this.getNode('content-editor'), prefix);
};


/**
 * @param {!function ({prefix: string}, null=): soydata.SanitizedHtml} template
 * @param {string=} prefix
 */
cwc.ui.Layout.prototype.renderPreviewContent = function(template, prefix = '') {
  this.renderContent_(template, this.getNode('content-preview'), prefix);
};


/**
 * Clears all object based events.
 */
cwc.ui.Layout.prototype.cleanUp = function() {
  this.events_.clear();
  this.resetLayout_();
};


/**
 * @return {goog.events.EventTarget}
 */
cwc.ui.Layout.prototype.getEventHandler = function() {
  return this.eventHandler;
};


/**
 * Adjusts the main UI element to fullscreen.
 * @param {!boolean} fullscreen
 * @param {!boolean} editorMode
 * @param {number=} size
 */
cwc.ui.Layout.prototype.setFullscreen_ = function(fullscreen,
    editorMode = false) {
  if (!this.splitpane) {
    return;
  }
  if (fullscreen) {
    if (this.fullscreen !== fullscreen) {
      this.splitpaneCachedSize = this.splitpane.getFirstComponentSize();
    }
    if (editorMode) {
      this.splitpane.setFirstComponentSize(0);
    } else {
      this.splitpane.setFirstComponentSize(
        this.chromeSize.width - this.handleSize);
    }
  } else {
    this.splitpane.setFirstComponentSize(
      this.splitpaneCachedSize >= 10 ? this.splitpaneCachedSize : 10);
  }
  this.fullscreen = fullscreen;
  this.editorFullscreen = editorMode;
  this.adjustSize();
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
    'content-editor': this.getNode_('content-editor-chrome'),
    'content-preview': this.getNode_('content-preview-chrome'),
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
  this.setFullscreen_(false);
  this.splitpane = null;
  this.splitpaneCachedSize = null;
};


/**
 * @param {string} name
 * @return {Element}
 * @private
 */
cwc.ui.Layout.prototype.getNode_ = function(name) {
  return goog.dom.getElement(this.prefix + name);
};
