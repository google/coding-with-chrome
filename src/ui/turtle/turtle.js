/**
 * @fileoverview Turtle output for the Coding with Chrome editor.
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
goog.provide('cwc.ui.Turtle');

goog.require('cwc.renderer.Helper');
goog.require('cwc.runner.Connector');
goog.require('cwc.soy.Turtle');



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.Turtle = function(helper) {
  /** @type {string} */
  this.name = 'Turtle';

  /** @type {string} */
  this.prefix = 'turtle-';

  /** @type {string} */
  this.generalPrefix = '';

  /** @type {!cwc.runner.Connector} */
  this.connector = new cwc.runner.Connector(helper, 'Turtle Runner Connector');

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeContent = null;

  /** @type {Object} */
  this.content = null;

  /** @type {Element|StyleSheet} */
  this.styleSheet = null;

  /** @type {Array} */
  this.listener = [];

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.utils.Logger} */
  this.log = this.helper.getLogger();

  /** @type {string} */
  this.turtleFramework = 'turtle_framework.js';

  /** @type {string} */
  this.jqueryFramework = 'jquery.min.js';

  /** @type {string} */
  this.jqueryTurtleFramework = 'jquery-turtle.js';

  /** @type {boolean} */
  this.ready = false;
};


/**
 * Decorates the given node and adds the turtle window.
 * @param {Element} node The target node to add the turtle window.
 * @param {string=} opt_prefix Additional prefix for the ids of the
 *    inserted elements and style definitions.
 */
cwc.ui.Turtle.prototype.decorate = function(node, opt_prefix) {
  this.ready = false;
  this.node = node;
  this.generalPrefix = opt_prefix || '';
  this.prefix = opt_prefix + this.prefix;

  if (!this.styleSheet) {
    this.styleSheet = goog.style.installStyles(
        cwc.soy.Turtle.style({ 'prefix': this.prefix }));
  }

  goog.soy.renderElement(
      this.node, cwc.soy.Turtle.template, { 'prefix': this.prefix });

  // Runner
  this.connector.init();

  // Content
  this.nodeContent = goog.dom.getElement(this.prefix + 'content');
  this.content = document.createElement('webview');
  this.content.addEventListener('consolemessage',
      this.handleConsoleMessage_.bind(this), false);
  this.content.addEventListener('loadstop',
      this.handleLoadStop_.bind(this), false);
  goog.dom.appendChild(this.nodeContent, this.content);
  this.connector.setTarget(this.content);
  this.content.src = this.renderContent_();
};


/**
 * @param {!string} action
 * @param {object} opt_value
 * @export
 */
cwc.ui.Turtle.prototype.action = function(action, opt_value) {
  if (!this.ready) {
    return;
  }
  this.connector.send(action, opt_value);
};


/**
 * @export
 */
cwc.ui.Turtle.prototype.reset = function() {
  this.action('__reset__');
};


/**
 * @private
 */
cwc.ui.Turtle.prototype.renderContent_ = function(opt_event) {
  var renderer = this.helper.getInstance('renderer', true);
  var frameworks = renderer.getFrameworks();
  var helper = renderer.getRendererHelper();

  var css = '';
  var header = helper.getFrameworkHeaders([this.jqueryFramework,
    this.jqueryTurtleFramework, this.turtleFramework], frameworks);
  var body = '\n<script>\n  new cwc.framework.Turtle();\n</script>\n';
  var html = helper.getHTMLGrid(body, header, css);
  return helper.getDataUrl(html);
};


/**
 * Displays the end of the load event.
 * @param {Event=} opt_event
 */
cwc.ui.Turtle.prototype.handleLoadStop_ = function(opt_event) {
  console.log('Turtle graphic loaded ...');
  this.connector.start();
  this.ready = true;
};


/**
 * Collects all messages from the preview window for the console.
 * @param {Event} e
 * @private
 */
cwc.ui.Turtle.prototype.handleConsoleMessage_ = function(e) {
  console.log('Turtle Runner:', e);
};
