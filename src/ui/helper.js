/**
 * @fileoverview UI Helper for the Coding with Chrome editor.
 *
 * This helper class provides shortcuts to get the different of UI elements.
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
goog.provide('cwc.ui.Helper');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.style');


/**
 * @param {string} name
 * @param {string=} title
 * @param {Function=} func
 * @return {!Element}
 */
cwc.ui.Helper.getMenuItem = function(name, title, func) {
  let text = document.createTextNode(i18t(name));
  let item = goog.dom.createDom(goog.dom.TagName.LI, 'mdl-menu__item');
  item.appendChild(text);
  if (title) {
    item.title = i18t(title);
  }
  if (func) {
    goog.events.listen(item, goog.events.EventType.CLICK, func);
  }
  return item;
};


/**
 * @param {string} name
 * @param {function()=} optFunc
 * @return {!Element}
 */
cwc.ui.Helper.getListItem = function(name, optFunc) {
  let text = document.createTextNode(i18t(name));
  let item = goog.dom.createDom(goog.dom.TagName.LI, 'mdl-list__item');
  let primaryContent = goog.dom.createDom(
    goog.dom.TagName.SPAN, 'mdl-list__item-primary-content');
  primaryContent.appendChild(text);
  item.appendChild(primaryContent);
  if (optFunc) {
    goog.events.listen(item, goog.events.EventType.CLICK, optFunc);
  }
  return item;
};


/**
 * Refreshs dom structure for mdl framework.
 */
cwc.ui.Helper.mdlRefresh = function() {
  if (typeof window.componentHandler !== 'undefined') {
    window.componentHandler.upgradeDom();
  }
};


/**
 * Enables or disables an element.
 * @param {Element|string} element
 * @param {boolean} enabled
 */
cwc.ui.Helper.enableElement = function(element, enabled) {
  let node = goog.dom.getElement(element);
  if (!node) {
    console.error('Unable to find element', element);
    return;
  }
  if (enabled) {
    if (node.hasAttribute('disabled')) {
      node.removeAttribute('disabled');
    }
  } else {
    node.setAttribute('disabled', true);
  }
};


/**
 * Removes all elements with the provided class names.
 * @param {Array|string} class_names
 * @param {string=} optType
 */
cwc.ui.Helper.removeElements = function(class_names, optType) {
  let elements = cwc.ui.Helper.getElements(class_names, optType);
  for (let i = 0; i < elements.length; i++) {
    goog.dom.removeNode(elements[i]);
  }
};


/**
 * Hides all elements with the provided class names.
 * @param {Array|string} class_names
 * @param {string=} optType
 */
cwc.ui.Helper.hideElements = function(class_names, optType) {
  let elements = cwc.ui.Helper.getElements(class_names, optType);
  for (let i = 0; i < elements.length; i++) {
    goog.style.setElementShown(elements[i], false);
  }
};


/**
 * Shows all elements with the provided class names.
 * @param {Array|string} class_names
 * @param {string=} optType
 */
cwc.ui.Helper.showElements = function(class_names, optType) {
  let elements = cwc.ui.Helper.getElements(class_names, optType);
  for (let i = 0; i < elements.length; i++) {
    goog.style.setElementShown(elements[i], true);
  }
};


/**
 * Returns all elements with the provided class names.
 * @param {Array|string} class_names
 * @param {string=} type
 * @return {Array} List of elements
 */
cwc.ui.Helper.getElements = function(class_names, type) {
  let classes = (typeof class_names === 'string') ? [class_names] : class_names;
  let result = [];
  for (let i = 0; i < classes.length; i++) {
    let elements = goog.dom.getElementsByTagNameAndClass(
      type || goog.dom.TagName.DIV, classes[i]);
    if (elements) {
      for (let i2 = 0; i2 < elements.length; i2++) {
        result.push(elements[i2]);
      }
    }
  }
  return result;
};
