/**
 * @fileoverview Sidebar.
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
goog.provide('cwc.ui.Sidebar');

goog.require('cwc.renderer.Helper');
goog.require('cwc.soy.ui.Sidebar');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.Logger');

goog.require('goog.dom.classlist');


/**
 * Class represents the sidebar inside the UI.
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.Sidebar = function(helper) {
  /** @type {string} */
  this.name = 'Sidebar';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.renderer.Helper} */
  this.rendererHelper = new cwc.renderer.Helper();

  /** @type {string} */
  this.prefix = this.helper.getPrefix('sidebar');

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeContent = null;

  /** @type {Element} */
  this.nodeCustomIcons = null;

  /** @type {!string} */
  this.contentName = '';

  /** @type {Array} */
  this.customButtonIds = [];

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, this.prefix);

  /** @private {!boolean} */
  this.webviewSupport_ = this.helper.checkChromeFeature('webview');

  /** @private {!cwc.utils.Logger|null} */
  this.log_ = new cwc.utils.Logger(this.name);

  /** @private {Element} */
  this.contentNode_ = null;
};


/**
 * Decorates the given node and adds the sidebar to the ui.
 * @param {Element} node The target node to add the status bar.
 */
cwc.ui.Sidebar.prototype.decorate = function(node) {
  this.node = node || goog.dom.getElement(this.prefix + 'chrome');
  if (!this.node) {
    this.log_.error('Invalid Status node:', this.node);
    return;
  }

  goog.soy.renderElement(
      this.node,
      cwc.soy.ui.Sidebar.template, {
        'prefix': this.prefix,
      }
  );

  this.nodeContent = goog.dom.getElement(this.prefix + 'content');
  this.nodeCustomIcons = goog.dom.getElement(this.prefix + 'icons-custom');
  this.hideContent();

  // File Library
  this.events_.listen('library-button', goog.events.EventType.CLICK, () => {
    if (this.isContentActive('library')) {
      this.hideContent();
    } else {
      this.helper.getInstance('library').showLibrary();
      let dialogInstance = this.helper.getInstance('dialog');
      if (dialogInstance) {
        dialogInstance.getCloseButton().addEventListener('click', () => {
          this.setActive('library', false);
        });
      }
    }
  });

  // Media functions
  this.events_.listen('media-button', goog.events.EventType.CLICK, () => {
    if (this.isContentActive('media')) {
      this.hideContent();
    } else {
      this.helper.getInstance('library').showMediaUpload();
      let dialogInstance = this.helper.getInstance('dialog');
      if (dialogInstance) {
        dialogInstance.getCloseButton().addEventListener('click', () => {
          this.setActive('library', false);
        });
      }
    }
  });

  // File Description
  this.events_.listen('file_description-button', goog.events.EventType.CLICK,
    () => {
      if (this.isContentActive('file_description')) {
        this.hideContent();
      } else {
        this.showContent('file_description', 'Description',
          this.helper.getInstance('file').getFileDescription());
      }
  });

  // Tour
  this.events_.listen('tour-button', goog.events.EventType.CLICK, () => {
    if (this.isContentActive('tour')) {
      this.hideContent();
    } else {
      this.helper.getInstance('tour').startTour();
    }
  });

  // Tutorial
  this.events_.listen('tutorial-button', goog.events.EventType.CLICK, () => {
    if (this.isContentActive('tutorial')) {
      this.hideContent();
    } else {
      this.helper.getInstance('tutorial').startTutorial();
    }
  });
};


/**
 * @return {Element}
 */
cwc.ui.Sidebar.prototype.getContentNode = function() {
  return this.contentNode_;
};

/**
 * @return {Element}
 */
cwc.ui.Sidebar.prototype.getContentBodyNode = function() {
  return goog.dom.getElement(this.prefix+'content-body');
};

/**
 * @param {!string} id
 * @param {!string} icon
 * @param {string=} tooltip
 * @param {Function=} func
 * @return {Element}
 */
cwc.ui.Sidebar.prototype.addCustomButton = function(id, icon, tooltip = '',
    func) {
  if (this.customButtonIds.includes(id)) {
    this.log_.error('Custom button', id, 'already exists');
    return null;
  }

  let button = goog.soy.renderAsElement(
    cwc.soy.ui.Sidebar.sidebarIcon, {
      'prefix': this.prefix,
      'id': id,
      'icon': icon,
      'tooltip': tooltip,
    }
  );

  if (this.nodeCustomIcons) {
    this.nodeCustomIcons.appendChild(button);
    this.customButtonIds.push(id);
  }

  if (func) {
    this.events_.listen(button, goog.events.EventType.CLICK, function() {
      if (this.isContentActive(id)) {
        this.hideContent();
      } else {
        func();
      }
    }.bind(this));
  }

  return button;
};


/**
 * @param {!string} id
 * @param {boolean} enabled
 */
cwc.ui.Sidebar.prototype.enableButton = function(id, enabled) {
  cwc.ui.Helper.enableElement(this.prefix + id + '-button', enabled);
};


/**
 * @param {boolean} enabled
 */
cwc.ui.Sidebar.prototype.enableDescription = function(enabled) {
  this.enableButton('file_description', enabled);
};


/**
 * @param {boolean} enabled
 */
cwc.ui.Sidebar.prototype.enableTour = function(enabled) {
  this.enableButton('tour', enabled);
};

/**
 * @param {boolean} enabled
 */
cwc.ui.Sidebar.prototype.enableTutorial = function(enabled) {
  this.enableButton('tutorial', enabled);
};


/**
 * @param {boolean} enabled
 */
cwc.ui.Sidebar.prototype.enableLibrary = function(enabled) {
  this.enableButton('library', enabled);
};


/**
 * @param {!string} id
 * @param {boolean} visible
 */
cwc.ui.Sidebar.prototype.showButton = function(id, visible) {
  goog.style.setElementShown(
    goog.dom.getElement(this.prefix + id), visible);
};


/**
 * @param {boolean} visible
 */
cwc.ui.Sidebar.prototype.showLibrary = function(visible) {
  this.showButton('library', visible);
};


/**
 * @param {boolean} visible
 */
cwc.ui.Sidebar.prototype.showMedia = function(visible) {
  this.showButton('media', visible);
};


/**
 * @param {!string} id
 * @param {boolean} active
 */
cwc.ui.Sidebar.prototype.setActive = function(id, active) {
  if (active) {
    this.clearActive_();
    goog.dom.classlist.enable(
      goog.dom.getElement(this.prefix + id), 'active', active);
  } else {
    this.hideContent();
  }
};


/**
 * Show normal sidebar content.
 * @param {!string} id
 * @param {string=} title
 * @param {string=} content
 */
cwc.ui.Sidebar.prototype.showContent = function(id, title, content = '') {
  this.contentNode_ = null; // Content node is only used for raw content.
  if (this.contentName === id) {
    return;
  }
  if (content) {
    goog.soy.renderElement(
      this.nodeContent,
      cwc.soy.ui.Sidebar.content, {
        'prefix': this.prefix,
        'title': title,
        'content': content === '__RAW__' ? '' : content,
      }
    );
    this.events_.listen('content-close', goog.events.EventType.CLICK,
      this.hideContent.bind(this));
    this.showContent_(true);
  } else {
    this.showContent_(false);
  }
  this.setActive(id, true);
  this.contentName = id;
};


/**
 * Show raw sidebar content.
 * @param {!string} id
 * @param {!string} title
 * @param {string} content
 */
cwc.ui.Sidebar.prototype.showRawContent = function(id, title, content = '') {
  this.showContent(id, title, '__RAW__');

  // TODO(carheden): Add markdown support

  let contentBody = this.getContentBodyNode();
  if (!contentBody) {
    return;
  }
  if (this.webviewSupport_) {
    this.contentNode_ = document.createElement('webview');
  } else {
    this.contentNode_ = document.createElement('iframe');
  }
  goog.dom.appendChild(contentBody, this.contentNode_);
  this.contentNode_.src = this.rendererHelper.getDataURL(content);
};

/**
 * Render a template to the sidebar
 * @param {!string} id
 * @param {!string} title
 * @param {Function} template
 * @param {Object} params
 */
cwc.ui.Sidebar.prototype.renderContent = function(id, title, template,
  params = {}) {
  this.showContent(id, title, '__RAW__');

  let contentBody = this.getContentBodyNode();
  if (!contentBody) {
    return;
  }
  goog.soy.renderElement(contentBody, template, params);
};

cwc.ui.Sidebar.prototype.hideContent = function() {
  this.showContent_(false);
  this.clearActive_();
  this.contentName = '';
};


/**
 * @param {!string} contentName
 * @return {boolean}
 */
cwc.ui.Sidebar.prototype.isContentActive = function(contentName) {
  return contentName === this.contentName;
};


cwc.ui.Sidebar.prototype.clear = function() {
  this.hideContent();
  this.clearCustomButtons_();
};


/**
 * @param {boolean} visible
 * @private
 */
cwc.ui.Sidebar.prototype.showContent_ = function(visible) {
  if (!visible) {
    this.clearActive_();
  }
  goog.style.setElementShown(this.nodeContent, visible);
  this.helper.getInstance('layout').adjustSize();
};


/**
 * @private
 */
cwc.ui.Sidebar.prototype.clearCustomButtons_ = function() {
  if (this.nodeCustomIcons) {
    goog.dom.removeChildren(this.nodeCustomIcons);
  }
  this.customButtonIds = [];
};


/**
 * @private
 */
cwc.ui.Sidebar.prototype.clearActive_ = function() {
  let elements = cwc.ui.Helper.getElements(this.prefix + 'icon');
  if (elements) {
    elements.forEach((elem) => {
      goog.dom.classlist.enable(elem, 'active', false);
    });
  }
};
