/**
 * @fileoverview Tabbed Pane Addon
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
 * @author carheden@google.com (Adam Carheden)
 */
goog.provide('cwc.addon.TabbedPane');
goog.require('cwc.utils.Logger');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('goog.math.Size');
goog.require('goog.soy');
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('goog.ui.RoundedTabRenderer');
goog.require('goog.ui.SplitPane');
goog.require('goog.ui.SplitPane.Orientation');
goog.require('goog.ui.Tab');
goog.require('goog.ui.TabBar');

/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.addon.TabbedPane = function(helper) {
  /** @type {!string} */
  this.name = 'Tabbed Pane Addon';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('addon-tabbed_pane');

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);

  /** @private {Element} */
  this.container = null;

  /** @private {Element} */
  this.content = null;

  /** @private {goog.ui.SplitPane} */
  this.splitPane = null;

  /** @private {goog.ui.TabBar} */
  this.tabBar = null;

  /** @private {goog.ui.Tab} */
  this.centerTab = null;

  /** @private {goog.ui.Tab} */
  this.contentTab = null;

  /** @private {!number} */
  this.minContentWidth = 1024 / 2;
};

cwc.addon.TabbedPane.prototype.prepare = function() {
  if (!this.helper.experimentalEnabled()) {
    this.log_.info('not in experimental mode, disabling');
    return;
  }
  this.log_.info('tabbed pane available');
};

/**
 * @param {!function ({prefix: string}, null=): soydata.SanitizedHtml} template
 * @param {Object} templateData
 * @param {string} contentTabName
 * @param {string} centerTabName
 * @param {number} initial_width
 */
cwc.addon.TabbedPane.prototype.renderContent = function(template, templateData,
  contentTabName = 'Instructions', centerTabName = 'Preview',
  initial_width = null) {
  // Get dependent objects
  let layoutInstance = this.helper.getInstance('layout');
  if (!layoutInstance) {
    this.log_.info('No layout, quitting...');
    return;
  }
  let contentMiddle = layoutInstance.getNode('content-middle');
  if (!contentMiddle) {
    this.log_.info('No content-middle, quitting...');
    return;
  }
  let contentRight = layoutInstance.getNode('content-right');
  if (!contentRight) {
    this.log_.info('No content-right, quitting...');
    return;
  }
  let chromeMain = layoutInstance.getNode_('chrome-main');
  if (!chromeMain) {
    this.log_.info('No chrome-main, quitting...');
    return;
  }

  // Disable the layout's events
  if (!goog.events.unlisten(layoutInstance.viewport_monitor,
    goog.events.EventType.RESIZE, layoutInstance.adjustSize, false,
    layoutInstance)) {
    this.log_.warn('Failed to unlisten to window resize');
  }
  if (!goog.events.listen(layoutInstance.firstSplitpane,
    goog.ui.SplitPane.EventType.HANDLE_DRAG,
    layoutInstance.adjustSize, false, layoutInstance)) {
    this.log_.warn('Failed to unlisten to handle drag');
  }
  if (!goog.events.listen(layoutInstance.firstSplitpane,
    goog.ui.SplitPane.EventType.HANDLE_SNAP,
    layoutInstance.adjustSize, false, layoutInstance)) {
    this.log_.warn('Failed to unlisten to handle snap');
  }

  // Destroy the layout's splitpane
  let first_splitpane_size =
    layoutInstance.firstSplitpane.getFirstComponentSize();
  layoutInstance.firstSplitpane.dispose();

  // Add the require <div>s to the DOM
  goog.dom.classes.remove(contentRight, 'goog-splitpane-second-container');
  let outerRight = goog.dom.createDom('div',
    {'class': 'goog-splitpane-second-container'});
  goog.dom.insertSiblingAfter(outerRight, contentMiddle);
  this.container = goog.dom.createDom('div', {'id': this.prefix+'container',
    'class': 'goog-splitpane'});
  goog.dom.appendChild(outerRight, this.container);
  goog.dom.appendChild(this.container, contentRight);
  goog.dom.classes.add(contentRight, 'goog-splitpane-first-container');
  this.content = goog.dom.createDom('div',
    {'id': this.prefix+'content', 'class': 'goog-splitpane-second-container'},
    '');
  goog.dom.appendChild(this.container, this.content);
  goog.dom.appendChild(this.container, goog.dom.createDom('div',
    {'id': this.prefix+'handle', 'class': 'goog-splitpane-handle'}));

  // Create the tab bar
  let tabbar = goog.dom.createDom('div',
    {'id': this.prefix+'tab_bar', 'class': 'goog-tab-bar-bottom'});
  goog.dom.appendChild(tabbar, goog.dom.createDom('div',
    {'id': this.prefix+'tab_center',
    'class': 'goog-rounded-tab goog-rounded-tab-selected'}, centerTabName));
  goog.dom.appendChild(tabbar, goog.dom.createDom('div',
    {'id': this.prefix+'tab_right', 'class': 'goog-rounded-tab'},
     contentTabName));
  goog.dom.appendChild(outerRight, goog.dom.createDom('div',
    {'class': 'goog-tab-bar-clear'}));
  goog.dom.appendChild(outerRight, tabbar);
  this.tabBar = new goog.ui.TabBar();
  this.tabBar.decorate(tabbar);
  goog.events.listen(this.tabBar, goog.ui.Component.EventType.SELECT, (e) => {
    switch (e.target.getId()) {
      case this.prefix+'tab_center':
        break;
      case this.prefix+'tab_right':
        break;
      default:
        this.log_.error('Unknown tab: "'+e.target.getId()+'"');
    }
    this.adjustSize();
  });

  // Re-create the layout's splitpane
  layoutInstance.firstSplitpane = new goog.ui.SplitPane(new goog.ui.Component(),
    new goog.ui.Component(), goog.ui.SplitPane.Orientation.HORIZONTAL);
  layoutInstance.firstSplitpane.setInitialSize(first_splitpane_size);
  layoutInstance.firstSplitpane.setHandleSize(layoutInstance.handleSize);
  layoutInstance.firstSplitpane.decorate(chromeMain);
  layoutInstance.firstSplitpane.setFirstComponentSize(first_splitpane_size);

  // Create out splitpane
  let maxWidth = layoutInstance.chromeSize.width - first_splitpane_size;
  let second_splitpane_size = initial_width ?
    Math.max(0, maxWidth - initial_width) :
    maxWidth / 2;
  this.splitPane = new goog.ui.SplitPane(new goog.ui.Component(),
    new goog.ui.Component(), goog.ui.SplitPane.Orientation.HORIZONTAL);
  this.splitPane.setInitialSize(second_splitpane_size);
  this.splitPane.setHandleSize(layoutInstance.handleSize);
  this.splitPane.decorate(this.container);

  // Set up all events
  goog.events.listen(layoutInstance.viewport_monitor,
    goog.events.EventType.RESIZE, this.adjustSize, false, this);
  goog.events.listen(layoutInstance.firstSplitpane,
      goog.ui.SplitPane.EventType.HANDLE_DRAG,
    this.adjustSize, false, this);
  goog.events.listen(layoutInstance.firstSplitpane,
    goog.ui.SplitPane.EventType.HANDLE_SNAP,
    this.adjustSize, false, this);
  goog.events.listen(this.splitPane, goog.ui.SplitPane.EventType.HANDLE_DRAG,
    this.adjustSize, false, this);
  goog.events.listen(this.splitPane, goog.ui.SplitPane.EventType.HANDLE_SNAP,
    this.adjustSize, false, this);

  // Size the layout
  this.adjustSize();

  // Render the user's content
  goog.soy.renderElement(this.content, template, templateData);
};

cwc.addon.TabbedPane.prototype.contentActive = function() {
  if (!this.tabBar) return false;
  let selected = this.tabBar.getSelectedTab();
  if (!selected) return false;
  return selected.getId() == this.prefix+'tab_right';
};

cwc.addon.TabbedPane.prototype.adjustSize = function() {
  let layoutInstance = this.helper.getInstance('layout');
  if (!layoutInstance) {
    this.log_.info('No layout, quitting...');
    return;
  }

  let firstSplitpaneComponentWidth = null;
  layoutInstance.updateSizeInformation();
  layoutInstance.adjustLayoutChrome();

  switch (layoutInstance.layout) {
    case cwc.ui.LayoutType.BLANK: {
      goog.style.setSize(layoutInstance.nodes['content'],
        layoutInstance.chromeSize);
      break;
    }
    case cwc.ui.LayoutType.DEFAULT: {
      if (!layoutInstance.fullscreen) {
        if (layoutInstance.fixRightComponentSize) {
          firstSplitpaneComponentWidth = layoutInstance.chromeSize.width -
           layoutInstance.handleSize - layoutInstance.fixRightComponentSize;
        }
      }
      layoutInstance.firstSplitpane.setSize(layoutInstance.chromeSize,
        firstSplitpaneComponentWidth);
      let secondSplitpaneWidth = layoutInstance.chromeSize.width -
        layoutInstance.firstSplitpane.getFirstComponentSize();
      const tabBarHeight = 30;
      let handleWidth = 10;
      let secondSplitpaneHeight = layoutInstance.chromeSize.height;
      let tabBar = goog.dom.getElement(this.prefix+'tab_bar');
      let rightPane = goog.dom.getElement(this.prefix+'content');
      let centerWidth;
      let rightWidth;
      let secondSplitpaneComponentWidth;
      if (secondSplitpaneWidth < this.minContentWidth) {
        goog.style.setElementShown(tabBar, true);
        secondSplitpaneHeight = Math.max(0, secondSplitpaneHeight -
          tabBarHeight);
        let width = Math.max(0, Math.floor(secondSplitpaneWidth - handleWidth));
        if (this.contentActive()) {
          centerWidth = 0;
          rightWidth = width;
          secondSplitpaneComponentWidth = -handleWidth * 2;
        } else {
          centerWidth = width;
          rightWidth = 0;
          secondSplitpaneComponentWidth = secondSplitpaneWidth;
        }
      } else {
        goog.style.setElementShown(tabBar, false);
        centerWidth = this.splitPane.getFirstComponentSize();
        rightWidth = Math.max(0, Math.floor(secondSplitpaneWidth -
          this.splitPane.getFirstComponentSize() - handleWidth * 2));
        if (this.splitPane.getFirstComponentSize() <= 0) {
          secondSplitpaneComponentWidth = Math.max(0, secondSplitpaneWidth / 2);
        }
      }
      let secondSplitpaneSize = new goog.math.Size(secondSplitpaneWidth,
        secondSplitpaneHeight);
      this.splitPane.setSize(secondSplitpaneSize,
        secondSplitpaneComponentWidth);

      let paneCenterSize = new goog.math.Size(centerWidth,
        secondSplitpaneHeight);
      goog.style.setSize(layoutInstance.getNode('content-right'),
        paneCenterSize);
      let paneRightSize = new goog.math.Size(rightWidth, secondSplitpaneHeight);
      goog.style.setSize(rightPane, paneRightSize);

      break;
    }
    case cwc.ui.LayoutType.NONE: {
      break;
    }
    default: {
      console.error('Unknown layout:', layoutInstance.layout);
      break;
    }
  }
  layoutInstance.handleResizeEvent();
};

