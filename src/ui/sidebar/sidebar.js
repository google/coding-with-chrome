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
 * Class represents the statusbar inside the ui.
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
  this.tutorialNode_ = null;
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
  this.events_.listen('library-button', goog.events.EventType.CLICK,
    (e) => {
      this.hideContent();
      this.setActive_(e.target);
      this.helper.getInstance('library').showLibrary();
      let dialogInstance = this.helper.getInstance('dialog');
      if (dialogInstance) {
        dialogInstance.getCloseButton().addEventListener('click',
          this.clearActive_.bind(this));
      }
  });

  // Media functions
  this.events_.listen('media-button', goog.events.EventType.CLICK,
    (e) => {
      this.hideContent();
      this.setActive_(e.target);
      this.helper.getInstance('library').showMediaUpload();
      let dialogInstance = this.helper.getInstance('dialog');
      if (dialogInstance) {
        dialogInstance.getCloseButton().addEventListener('click',
          this.clearActive_.bind(this));
      }
  });

  // File Description
  this.events_.listen('file_description-button', goog.events.EventType.CLICK,
    (e) => {
      this.setActive_(e.target);
      this.showContent('Description',
        this.helper.getInstance('file').getFileDescription());
  });

  let tutorial = this.helper.getInstance('tutorial');

  // Tour
  this.events_.listen('tour-button', goog.events.EventType.CLICK,
    (e) => {
      this.setActive_(e.target);
      tutorial.startTour();
  });

  // Tutorial
  this.events_.listen('tutorial-button', goog.events.EventType.CLICK,
    this.renderTutorial.bind(this));
};

/**
 * @return {Element}
 */
cwc.ui.Sidebar.prototype.getTutorialNode = function() {
  return this.tutorialNode_;
};

cwc.ui.Sidebar.prototype.renderTutorial = function() {
  let tutorialInstance = this.helper.getInstance('tutorial');
  if (!tutorialInstance) return;
  let tutorialContent = tutorialInstance.getContent();
  if (!tutorialContent) return;

  let tutorialButton = goog.dom.getElement(this.prefix+'tutorial-button');
  if (!tutorialButton) {
    this.log_.error('Failed to find tutorial button');
    return;
  }
  this.setActive_(tutorialButton);
  // TODO(carheden): Support markdown for non-interactive tutorials

  // The content must be non-false or the content-body element isn't created
  this.showContent('Tutorial', ' ', true);
  let content = goog.dom.getElement(this.prefix + 'content-body');
  if (this.webviewSupport_) {
    this.tutorialNode_ = document.createElement('webview');
  } else {
    this.tutorialNode_ = document.createElement('iframe');
  }
  goog.dom.appendChild(content, this.tutorialNode_);
  this.tutorialNode_.src = this.rendererHelper.getDataURL(
    tutorialInstance.getContent());
  tutorialInstance.start(this.tutorialNode_);
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
      this.setActive_(button);
      func();
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
  }
  goog.dom.classlist.enable(
    goog.dom.getElement(this.prefix + id), 'active', active);
};


/**
 * @param {!string} title
 * @param {!function (Object, null=, (Object<string,*>|null)=)} template
 * @param {!Object} values
 */
cwc.ui.Sidebar.prototype.renderContent = function(title, template, values) {
  this.showContent(title, '');
  goog.soy.renderElement(
    goog.dom.getElement(this.prefix + 'content-body'), template, values);
};


/**
 * @param {!string} title
 * @param {string} content
 * @param {boolean} raw
 */
cwc.ui.Sidebar.prototype.showContent = function(title, content = '',
  raw = false) {
  if (this.contentName === title) {
    this.showContent_(false);
    this.contentName = '';
    return;
  }

  if (content) {
    if (raw) {
      goog.dom.classlist.add(this.nodeContent, this.prefix+'raw');
    } else {
      goog.dom.classlist.remove(this.nodeContent, this.prefix+'raw');
    }
    goog.soy.renderElement(
      this.nodeContent,
      cwc.soy.ui.Sidebar.content, {
        'prefix': this.prefix,
        'title': title,
        'content': content,
      }
    );
    this.events_.listen('content-close', goog.events.EventType.CLICK,
      this.hideContent.bind(this));
    this.showContent_(true);
  } else {
    this.showContent_(false);
  }
  this.contentName = title;
};


cwc.ui.Sidebar.prototype.hideContent = function() {
  this.showContent_(false);
  this.contentName = '';
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
 * @param {Element} button
 * @private
 */
cwc.ui.Sidebar.prototype.setActive_ = function(button) {
  this.clearActive_();
  goog.dom.classlist.enable(
    button.closest('.' + this.prefix + 'icon'), 'active', true);
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
