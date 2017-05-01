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
 * @param {!string} name
 * @param {string=} opt_title
 * @param {function()=} optFunc
 * @return {!Element}
 */
cwc.ui.Helper.getMenuItem = function(name, opt_title, optFunc) {
  let text = document.createTextNode(i18t(name));
  let item = goog.dom.createDom(goog.dom.TagName.LI, 'mdl-menu__item');
  item.appendChild(text);
  if (opt_title) {
    item.title = i18t(opt_title);
  }
  if (optFunc) {
    goog.events.listen(item, goog.events.EventType.CLICK, optFunc);
  }
  return item;
};


/**
 * @param {!string} name
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
 * Uninstalls styles and returns null.
 * @param {Element|StyleSheet} style_sheet
 * @return {null}
 */
cwc.ui.Helper.uninstallStyles = function(style_sheet) {
  if (style_sheet) {
    goog.style.uninstallStyles(style_sheet);
  }
  return null;
};


/**
 * Adding script element to head.
 * @param {!string} script_url
 * @param {string=} opt_id
 * @param {Function=} optCallback
 */
cwc.ui.Helper.insertScript = function(script_url, opt_id, optCallback) {
  console.log('Insert Script', opt_id, 'with src:', script_url);
  if (opt_id) {
    let oldScriptNode = document.getElementById(opt_id);
    if (oldScriptNode) {
      oldScriptNode.parentNode.removeChild(oldScriptNode);
    }
  }
  let scriptNode = document.createElement('script');
  if (opt_id) {
    scriptNode.id = opt_id;
  }
  if (goog.isFunction(optCallback)) {
    scriptNode.onload = optCallback;
  }
  let headNode = document.head || document.getElementsByTagName('head')[0];
  headNode.appendChild(scriptNode);
  scriptNode.src = script_url;
};


/**
 * Enables or disables an element.
 * @param {Element} element
 * @param {boolean} enabled
 */
cwc.ui.Helper.enableElement = function(element, enabled) {
  if (enabled) {
    if (element.hasAttribute('disabled')) {
      element.removeAttribute('disabled');
    }
  } else {
    element.setAttribute('disabled', true);
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
 * @param {string=} optType
 * @return {Array} List of elements
 */
cwc.ui.Helper.getElements = function(class_names, optType) {
  let classes = (typeof class_names === 'string') ? [class_names] : class_names;
  let result = [];
  for (let i = 0; i < classes.length; i++) {
    let elements = goog.dom.getElementsByTagNameAndClass(
      optType || goog.dom.TagName.DIV, classes[i]);
    if (elements) {
      for (let i2 = 0; i2 < elements.length; i2++) {
        result.push(elements[i2]);
      }
    }
  }
  return result;
};
