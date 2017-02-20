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
goog.require('goog.ui.Button');
goog.require('goog.ui.CustomButton');
goog.require('goog.ui.LinkButtonRenderer');



/**
 * @param {!string} name
 * @param {string=} opt_description
 * @param {function(?)=} opt_func
 * @param {string=} opt_icon_size
 * @param {string=} opt_class_name
 * @return {!goog.ui.CustomButton}
 */
cwc.ui.Helper.getCustomButton = function(name, opt_description,
    opt_func, opt_icon_size, opt_class_name) {
  var button = new goog.ui.CustomButton(name);
  cwc.ui.Helper.decorateButton(button, opt_description, opt_func,
      opt_icon_size, opt_class_name);
  return button;
};


/**
 * @param {!string} icon_name
 * @param {string=} opt_description
 * @param {function(?)=} opt_func
 * @param {string=} opt_icon_size
 * @param {string=} opt_class_name
 * @return {!goog.ui.Button}
 */
cwc.ui.Helper.getIconButton = function(icon_name, opt_description,
    opt_func, opt_icon_size, opt_class_name) {
  var button = cwc.ui.Helper.getCustomButton(icon_name, opt_description,
      opt_func, opt_icon_size || '24px', opt_class_name);
  button.addClassName('icon_button');
  return button;
};


/**
 * Decorates the button element with some default values.
 * @param {goog.ui.Button} button
 * @param {string=} opt_description
 * @param {function(?)=} opt_func
 * @param {string=} opt_icon_size
 * @param {string=} opt_class_name
 */
cwc.ui.Helper.decorateButton = function(button, opt_description, opt_func,
    opt_icon_size, opt_class_name) {
  if (opt_description) {
    button.setTooltip(opt_description);
  }
  if (opt_func) {
    goog.events.listen(button, goog.ui.Component.EventType.ACTION, opt_func);
  }
  if (opt_icon_size) {
    button.addClassName('icon_' + opt_icon_size);
  }
  if (opt_class_name) {
    button.addClassName(opt_class_name);
  }
};


/**
 * @param {!string} name
 * @param {string=} opt_title
 * @param {function()=} opt_func
 * @return {!Element}
 */
cwc.ui.Helper.getMenuItem = function(name, opt_title, opt_func) {
  var text = document.createTextNode(i18t(name));
  var item = goog.dom.createDom(goog.dom.TagName.LI, 'mdl-menu__item');
  item.appendChild(text);
  if (opt_title) {
    item.title = i18t(opt_title);
  }
  if (opt_func) {
    goog.events.listen(item, goog.events.EventType.CLICK, opt_func);
  }
  return item;
};


/**
 * @param {!string} name
 * @param {function()=} opt_func
 * @returns {!Element}
 */
cwc.ui.Helper.getListItem = function(name, opt_func) {
  var text = document.createTextNode(i18t(name));
  var item = goog.dom.createDom(goog.dom.TagName.LI, 'mdl-list__item');
  var primaryContent = goog.dom.createDom(
    goog.dom.TagName.SPAN, 'mdl-list__item-primary-content');
  primaryContent.appendChild(text);
  item.appendChild(primaryContent);
  if (opt_func) {
    goog.events.listen(item, goog.events.EventType.CLICK, opt_func);
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
 */
cwc.ui.Helper.insertScript = function(script_url, opt_id) {
  if (opt_id) {
    var oldScriptNode = document.getElementById(opt_id);
    if (oldScriptNode) {
      oldScriptNode.parentNode.removeChild(oldScriptNode);
    }
  }
  var scriptNode = goog.dom.createDom(goog.dom.TagName.SCRIPT);
  if (opt_id) {
    scriptNode.id = opt_id;
  }
  scriptNode.src = script_url;
  document.getElementsByTagName('head')[0].appendChild(scriptNode);
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
 * @param {string=} opt_type
 */
cwc.ui.Helper.removeElements = function(class_names, opt_type) {
  var elements = cwc.ui.Helper.getElements(class_names, opt_type);
  for (let i = 0; i < elements.length; i++) {
    goog.dom.removeNode(elements[i]);
  }
};


/**
 * Hides all elements with the provided class names.
 * @param {Array|string} class_names
 * @param {string=} opt_type
 */
cwc.ui.Helper.hideElements = function(class_names, opt_type) {
  var elements = cwc.ui.Helper.getElements(class_names, opt_type);
  for (let i = 0; i < elements.length; i++) {
    goog.style.setElementShown(elements[i], false);
  }
};


/**
 * Shows all elements with the provided class names.
 * @param {Array|string} class_names
 * @param {string=} opt_type
 */
cwc.ui.Helper.showElements = function(class_names, opt_type) {
  var elements = cwc.ui.Helper.getElements(class_names, opt_type);
  for (let i = 0; i < elements.length; i++) {
    goog.style.setElementShown(elements[i], true);
  }
};


/**
 * Returns all elements with the provided class names.
 * @param {Array|string} class_names
 * @param {string=} opt_type
 * @return {Array} List of elements
 */
cwc.ui.Helper.getElements = function(class_names, opt_type) {
  var classes = (typeof class_names === 'string') ? [class_names] : class_names;
  var result = [];
  for (let i = 0; i < classes.length; i++) {
    var elements = goog.dom.getElementsByTagNameAndClass(
      opt_type || goog.dom.TagName.DIV, classes[i]);
    if (elements) {
      for (let i2 = 0; i2 < elements.length; i2++) {
        result.push(elements[i2]);
      }
    }
  }
  return result;
};
