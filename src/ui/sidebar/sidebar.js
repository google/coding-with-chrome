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

goog.require('cwc.soy.ui.Sidebar');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.Logger');


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

  /** @private {!cwc.utils.Logger|null} */
  this.log_ = new cwc.utils.Logger(this.name);
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


  this.events_.listen('speaker_notes-button', goog.events.EventType.CLICK,
    (e) => {
      this.setActive_(e.target);
      this.showContent('Description',
        this.helper.getInstance('file').getFileDescription());
  });
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
    return;
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
 * @param {!string} content
 */
cwc.ui.Sidebar.prototype.showContent = function(title, content) {
  if (this.contentName === title) {
    this.showContent_(false);
    this.contentName = '';
    return;
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
  this.contentName = title;
  this.showContent_(true);
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
