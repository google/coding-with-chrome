/**
 * @fileoverview Turtle output for the Coding with Chrome editor.
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
goog.provide('cwc.ui.Turtle');

goog.require('cwc.renderer.Helper');
goog.require('cwc.runner.Connector');
goog.require('cwc.soy.Turtle');
goog.require('cwc.utils.Logger');


/**
 * @param {!cwc.utils.Helper} helper
 * @param {string=} image
 * @constructor
 * @struct
 * @final
 */
cwc.ui.Turtle = function(helper, image = '') {
  /** @type {string} */
  this.name = 'Turtle';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('turtle');

  /** @type {!cwc.runner.Connector} */
  this.connector = new cwc.runner.Connector(helper, 'Turtle Runner Connector');

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeContent = null;

  /** @type {Object} */
  this.content = null;

  /** @type {boolean} */
  this.ready = false;

  /** @type {string} */
  this.image = image;

  /** @type {Array} */
  this.listener_ = [];

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * Decorates the given node and adds the turtle window.
 * @param {Element} node The target node to add the turtle window.
 */
cwc.ui.Turtle.prototype.decorate = function(node) {
  this.ready = false;
  this.node = node;

  goog.soy.renderElement(
      this.node, cwc.soy.Turtle.template, {'prefix': this.prefix});

  // Runner
  this.connector.init();

  // Content
  this.nodeContent = goog.dom.getElement(this.prefix + 'content');
  this.content = document.createElement('webview');
  this.content.setAttribute('partition', 'turtle');
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
 * @param {Object|number=} optValue
 * @export
 */
cwc.ui.Turtle.prototype.action = function(action, optValue) {
  if (!this.ready) {
    return;
  }
  this.connector.send(action, optValue);
};


/**
 * @export
 */
cwc.ui.Turtle.prototype.reset = function() {
  this.action('__reset__');
};


/**
 * @return {string}
 * @private
 */
cwc.ui.Turtle.prototype.renderContent_ = function() {
  let helper = new cwc.renderer.Helper();
  let header = helper.getJavaScriptURLs([
    cwc.framework.External.JQUERY.V2_2_4,
    cwc.framework.External.JQUERY_TURTLE,
    cwc.framework.Internal.TURTLE,
  ], this.helper.getBaseURL());
  let body = this.image ? '<img id="turtle" src="' + this.image + '" ' +
      'style="display: none;">\n' : '';
  body += '\n<script>\n  new cwc.framework.Turtle();\n</script>\n';
  let css = '';
  let html = helper.getHTMLGrid(body, header, css);
  return helper.getDataURL(html);
};


/**
 * Displays the end of the load event.
 * @param {Event=} opt_event
 */
cwc.ui.Turtle.prototype.handleLoadStop_ = function(opt_event) {
  this.log_.info('Turtle graphic loaded ...');
  this.connector.start();
  this.ready = true;
};


/**
 * Collects all messages from the preview window for the console.
 * @param {Event} e
 * @private
 */
cwc.ui.Turtle.prototype.handleConsoleMessage_ = function(e) {
  this.log_.info('Turtle Runner message:', e);
};
