/**
 * @fileoverview UI Helper for the Coding with Chrome editor.
 *
 * This helper class provides shortcuts to get the different of UI elements.
 *
 * @license Copyright 2015 Google Inc. All Rights Reserved.
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

goog.require('cwc.config.Prefix');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.style');
goog.require('goog.ui.Button');
goog.require('goog.ui.ToolbarButton');
goog.require('goog.ui.ToolbarToggleButton');


/**
 * Helper for all the different ui parts and elements.
 * @final
 * @export
 */
cwc.ui.Helper = function() {};


/**
 * @param {!string} name
 * @param {!string} description
 * @param {function(?)=} opt_func
 * @param {string=} opt_icon_size
 * @param {string=} opt_class_name
 * @return {!goog.ui.Button}
 */
cwc.ui.Helper.getButton = function(name, description,
    opt_func, opt_icon_size, opt_class_name) {
  var button = new goog.ui.Button(name);
  cwc.ui.Helper.decorateButton(button, description, opt_func,
      opt_icon_size, opt_class_name);
  return button;
};


/**
 * @param {!string} icon_name
 * @param {!string} description
 * @param {function(?)=} opt_func
 * @param {string=} opt_icon_size
 * @param {string=} opt_class_name
 * @return {!goog.ui.Button}
 */
cwc.ui.Helper.getIconButton = function(icon_name, description,
    opt_func, opt_icon_size, opt_class_name) {
  var button = cwc.ui.Helper.getButton(icon_name, description,
      opt_func, opt_icon_size || '24px', opt_class_name);
  button.addClassName('icon_button');
  return button;
};


/**
 * @param {!string} name
 * @param {!string} description
 * @param {function(?)=} opt_func
 * @param {string=} opt_icon_size
 * @param {string=} opt_class_name
 * @return {!goog.ui.ToolbarButton}
 */
cwc.ui.Helper.getToolbarButton = function(name,
    description, opt_func, opt_icon_size, opt_class_name) {
  var button = new goog.ui.ToolbarButton(name);
  cwc.ui.Helper.decorateButton(button, description, opt_func,
      opt_icon_size, opt_class_name);
  return button;
};


/**
 * @param {!string} icon_name
 * @param {!string} description
 * @param {function(?)=} opt_func
 * @param {string=} opt_icon_size
 * @param {string=} opt_class_name
 * @return {!goog.ui.ToolbarButton}
 */
cwc.ui.Helper.getIconToolbarButton = function(icon_name, description,
    opt_func, opt_icon_size, opt_class_name) {
  var button = cwc.ui.Helper.getToolbarButton(icon_name, description,
      opt_func, opt_icon_size || '24px', opt_class_name);
  button.addClassName('icon_button');
  return button;
};


/**
 * @param {!string} name
 * @param {!string} description
 * @param {function(?)=} opt_func
 * @param {string=} opt_icon_size
 * @param {string=} opt_class_name
 * @return {!goog.ui.ToolbarToggleButton}
 */
cwc.ui.Helper.getToolbarToggleButton = function(name,
    description, opt_func, opt_icon_size, opt_class_name) {
  var button = new goog.ui.ToolbarToggleButton(name);
  cwc.ui.Helper.decorateButton(button, description, opt_func,
      opt_icon_size, opt_class_name);
  return button;
};


/**
 * @param {!string} icon_name
 * @param {!string} description
 * @param {function(?)=} opt_func
 * @param {string=} opt_icon_size
 * @param {string=} opt_class_name
 * @return {!goog.ui.ToolbarToogleButton}
 */
cwc.ui.Helper.getIconToolbarToogleButton = function(icon_name,
    description, opt_func, opt_icon_size, opt_class_name) {
  var button = cwc.ui.Helper.getToolbarToggleButton(icon_name,
      description, opt_func, opt_icon_size || '24px', opt_class_name);
  button.addClassName('icon_button');
  return button;
};


/**
 * Decorates the button element with some default values.
 * @param {goog.ui.Button|
 *         goog.ui.ToolbarButton|goog.ui.ToolbarToogleButton} button
 * @param {!string} description
 * @param {function(?)=} opt_func
 * @param {string=} opt_icon_size
 * @param {string=} opt_class_name
 */
cwc.ui.Helper.decorateButton = function(button, description, opt_func,
    opt_icon_size, opt_class_name) {
  if (description) {
    button.setTooltip(description);
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
 * @param {function()=} opt_func
 * @param {Object=} opt_scope
 * @return {!goog.ui.MenuItem}
 */
cwc.ui.Helper.getMenuItem = function(name, opt_func, opt_scope) {
  var menuItem = new goog.ui.MenuItem(i18n.get(name));
  if (opt_func) {
    goog.events.listen(menuItem, goog.ui.Component.EventType.ACTION, opt_func,
        false, opt_scope);
  }
  return menuItem;
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
 * Removes all elements with the provided class names.
 * @param {array|string} class_names
 * @param {string=} opt_type
 */
cwc.ui.Helper.removeElements = function(class_names, opt_type) {
  var elements = cwc.ui.Helper.getElements(class_names, opt_type);
  for (var i = 0; i < elements.length; i++) {
    goog.dom.removeNode(elements[i]);
  }
};


/**
 * Hides all elements with the provided class names.
 * @param {array|string} class_names
 * @param {string=} opt_type
 */
cwc.ui.Helper.hideElements = function(class_names, opt_type) {
  var elements = cwc.ui.Helper.getElements(class_names, opt_type);
  for (var i = 0; i < elements.length; i++) {
    goog.style.showElement(elements[i], false);
  }
};


/**
 * Shows all elements with the provided class names.
 * @param {array|string} class_names
 * @param {string=} opt_type
 */
cwc.ui.Helper.showElements = function(class_names, opt_type) {
  var elements = cwc.ui.Helper.getElements(class_names, opt_type);
  for (var i = 0; i < elements.length; i++) {
    goog.style.showElement(elements[i], true);
  }
};


/**
 * Returns all elements with the provided class names.
 * @param {array|string} class_names
 * @param {string=} opt_type
 * @return {array} List of elements
 */
cwc.ui.Helper.getElements = function(class_names, opt_type) {
  var classes = (typeof someVar === 'string') ? [class_names] : class_names;
  var result = [];
  for (var i = 0; i < classes.length; i++) {
    var elements = goog.dom.getElementsByTagNameAndClass(opt_type || 'div',
        classes[i]);
    if (elements) {
      for (var i2 = 0; i2 < elements.length; i2++) {
        result.push(elements[i2]);
      }
    }
  }
  return result;
};
