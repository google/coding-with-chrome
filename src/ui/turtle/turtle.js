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

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeContent = null;

  /** @type {Object} */
  this.content = null;

  /** @type {string} */
  this.targetOrigin = '*';

  /** @type {string} */
  this.image = image;

  /** @type {Array} */
  this.listener_ = [];

  /** @private {boolean} */
  this.webviewSupport_ = this.helper.checkChromeFeature('webview');

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * Decorates the given node and adds the turtle window.
 * @param {Element} node The target node to add the turtle window.
 */
cwc.ui.Turtle.prototype.decorate = function(node) {
  this.node = node;

  goog.soy.renderElement(
      this.node, cwc.soy.Turtle.template, {'prefix': this.prefix});

  // Turtle content
  this.nodeContent = goog.dom.getElement(this.prefix + 'content');
  this.content = this.webviewSupport_
    ? document.createElement('webview') : document.createElement('iframe');
  if (this.webviewSupport_) {
    this.content.setAttribute('partition', 'turtle');
  }
  goog.dom.appendChild(this.nodeContent, this.content);
  this.content.src = this.renderContent_();
};


/**
 * @param {string} name
 * @param {Object|number=} value
 * @export
 */
cwc.ui.Turtle.prototype.action = function(name, value) {
  if (!this.content || !this.content.contentWindow) {
    return;
  }

  this.content.contentWindow.postMessage({
    'name': name, 'value': value},
    this.targetOrigin);
};


/**
 * @export
 */
cwc.ui.Turtle.prototype.reset = function() {
  this.action('reset');
};


/**
 * @return {string}
 * @private
 */
cwc.ui.Turtle.prototype.renderContent_ = function() {
  let helper = new cwc.renderer.Helper();
  let header = helper.getJavaScriptURLs([
    cwc.config.framework.External.JQUERY.V2_2_4,
    cwc.config.framework.External.JQUERY_TURTLE,
    cwc.config.framework.Internal.TURTLE,
  ], this.helper.getBaseURL());
  let body = this.image ? '<img id="turtle" src="' + this.image + '" ' +
      'style="display: none;">\n' : '';
  body += '\n<script>\n  new cwc.framework.Turtle();\n</script>\n';
  let html = helper.getHTMLGrid(body, header);
  return helper.getDataURL(html);
};
