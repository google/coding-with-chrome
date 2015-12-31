/**
 * @fileoverview Settings panel for the Coding with Chrome editor.
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

goog.provide('cwc.ui.Setting');

goog.require('cwc.soy.ui.Setting');
goog.require('cwc.utils.Helper');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.soy');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Option');
goog.require('goog.ui.Select');
goog.require('goog.ui.Zippy');



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 */
cwc.ui.Setting = function(helper) {
  /** @type {string} */
  this.name = 'Settings';

  /** @type {Element} */
  this.node = null;

  /** @type {string} */
  this.prefix = 'setting-';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;
};


/**
 * Decorates the given node and adds the settings.
 * @param {Element} node The target node to add the settings.
 * @param {string=} opt_prefix Additional prefix for the ids of the
 *    inserted elements and style definitions.
 */
cwc.ui.Setting.prototype.decorate = function(node, opt_prefix) {
  this.node = node;
  this.prefix = opt_prefix + this.prefix;

  goog.soy.renderElement(
      this.node,
      cwc.soy.ui.Setting.settingTemplate,
      {'prefix': this.prefix}
  );

  goog.style.installStyles(
      cwc.soy.ui.Setting.settingStyle({ 'prefix': this.prefix })
  );

  this.javascriptZippy = new goog.ui.Zippy(
      goog.dom.getElement(this.prefix + 'javascript-header'),
      goog.dom.getElement(this.prefix + 'javascript-content')
      );

  var jsLoadFlag = goog.dom.getElement(this.prefix + 'javascript-load-flag');
  var jsLoadFlagSelect = new goog.ui.Select();
  var selectDefault = new goog.ui.Option('Default');
  selectDefault.setValue('');
  var selectOnLoad = new goog.ui.Option('on Load');
  selectOnLoad.setValue('onLoad');
  var selectOnDomReady = new goog.ui.Option('on DOM ready');
  selectOnDomReady.setValue('onDomReady');
  var selectInHead = new goog.ui.Option('in Head');
  selectInHead.setValue('inHead');
  var selectInBody = new goog.ui.Option('in Body');
  selectInBody.setValue('inBody');
  jsLoadFlagSelect.addItem(selectDefault);
  jsLoadFlagSelect.addItem(selectOnLoad);
  jsLoadFlagSelect.addItem(selectOnDomReady);
  jsLoadFlagSelect.addItem(selectInHead);
  jsLoadFlagSelect.addItem(selectInBody);
  jsLoadFlagSelect.setSelectedIndex(0);
  jsLoadFlagSelect.render(jsLoadFlag);

  goog.events.listen(jsLoadFlagSelect, goog.ui.Component.EventType.ACTION,
      this.setJavaScriptLoadFlag.bind(this));

  this.optionZippy = new goog.ui.Zippy(
      goog.dom.getElement(this.prefix + 'option-header'),
      goog.dom.getElement(this.prefix + 'option-content')
      );

};


/**
 * @param {Event} event
 */
cwc.ui.Setting.prototype.setJavaScriptLoadFlag = function(event) {
  var select = event.target;
  var value = select.getValue();
  console.log(select, value);
};
