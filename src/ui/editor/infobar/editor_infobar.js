/**
 * @fileoverview Infobar of the Code Editor.
 *
 * @license Copyright 2017 The Coding with Chrome Authors.
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
goog.provide('cwc.ui.EditorInfobar');

goog.require('cwc.soy.ui.EditorInfobar');
goog.require('cwc.ui.Helper');
goog.require('cwc.utils.Events');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.ui.EditorInfobar = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('editor-infobar');

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeLineText = null;

  /** @type {Element} */
  this.nodeViews = null;

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, this.prefix, this);
};


/**
 * @param {Element} node
 */
cwc.ui.EditorInfobar.prototype.decorate = function(node) {
  this.node = node;

  // Render editor infobar.
  goog.soy.renderElement(
      this.node,
      cwc.soy.ui.EditorInfobar.template, {
        prefix: this.prefix,
      }
  );

  this.nodeLineText = goog.dom.getElement(this.prefix +'line-text');
  this.nodeViews = goog.dom.getElement(this.prefix + 'views');

  // Events.
  this.events_.listen(this.nodeViews, goog.events.EventType.CLICK,
    this.handleViewChange_);
};


/**
 * @param {!Object} position
 */
cwc.ui.EditorInfobar.prototype.setLineInfo = function(position) {
  if (this.nodeLineText) {
    this.nodeLineText.textContent = 'Line ' + (position['line'] + 1) +
      ', Column ' + (position['ch'] + 1);
  }
};


/**
 * @param {!Array} views
 * @param {string=} currentView
 */
cwc.ui.EditorInfobar.prototype.setViews = function(views, currentView) {
  goog.soy.renderElement(
      this.nodeViews,
      cwc.soy.ui.EditorInfobar.viewTabs, {
        prefix: this.prefix,
        views: views,
        currentView: currentView,
      }
  );
};


/**
 * @param {Object} e
 * @private
 */
cwc.ui.EditorInfobar.prototype.handleViewChange_ = function(e) {
  let eventTarget = e.target.closest('.' + this.prefix + 'tab');
  if (!eventTarget || goog.dom.classlist.contains(eventTarget, 'active')) {
    return;
  }
  let viewTarget = eventTarget.dataset['editorView'];
  if (viewTarget) {
    this.helper.getInstance('editor').changeView(viewTarget);
    this.helper.getInstance('file').setView(viewTarget);
  }
};
