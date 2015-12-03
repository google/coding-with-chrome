/**
 * @fileoverview Collection of tutorials for Coding with Chrome.
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
 * @author brunopanara@google.com (Bruno Panara)
 * @author mbordihn@google.com (Markus Bordihn)
 */
goog.provide('cwc.ui.Tutorial');

goog.require('cwc.soy.Tutorial');
goog.require('cwc.utils.Helper');



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 */
cwc.ui.Tutorial = function(helper) {
  /** @type {string} */
  this.name = 'Tutorial';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = 'select-screen-';

  /** @type {string} */
  this.generalPrefix = this.helper.getPrefix();
};


/**
 * Decorates the given node and adds the start screen.
 * @param {Element} node
 * @param {string=} opt_prefix
 */
cwc.ui.Tutorial.prototype.decorate = function(node, opt_prefix) {
  this.node = node;
  this.prefix = (opt_prefix || '') + this.prefix;

  goog.soy.renderElement(this.node, cwc.soy.Tutorial.template,
      {'prefix': this.prefix});

  if (!this.styleSheet) {
    this.styleSheet = goog.style.installStyles(
        cwc.soy.Tutorial.style({ 'prefix': this.prefix }));
  }

  this.nodeContent = goog.dom.getElement(this.prefix + 'content');
};


/**
 * Creates a request to show the tutorial screen.
 */
cwc.ui.Tutorial.prototype.requestShowTutorialScreen = function() {
  this.helper.handleUnsavedChanges(this.showTutorialScreen.bind(this));
};


/**
 * Renders and shows the tutorial screen.
 */
cwc.ui.Tutorial.prototype.showTutorialScreen = function() {
  var layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    layoutInstance.decorateSimpleSingleColumnLayout();
    var overlayNode = layoutInstance.getOverlay();
    this.decorate(overlayNode);
    this.showOverview();
  }
};


/**
 * Shows general overview.
 */
cwc.ui.Tutorial.prototype.showOverview = function() {
  this.showTemplate('overview');
};


/**
 * Shows initial Tutorial.
 */
cwc.ui.Tutorial.prototype.showTutorial = function() {

  var tutorialCardEvent = function(e) {
    var order = goog.dom.dataset.get(e.target, 'order');
    var target = goog.dom.dataset.get(e.target, 'target');
    this.tutorialCardChange(order, target);
  }.bind(this);

  this.showTemplate('tutorial');

  this.setClickEvent('link-home-1', this.showOverview);
  this.setClickEvent('link-home-2', this.showOverview);
  this.setClickEvent('link-home-3', this.showOverview);
  this.setClickEvent('link-home-4', this.showOverview);
  this.setClickEvent('link-home-5', this.showOverview);
  this.setClickEvent('link-home-6', this.showOverview);
  this.setClickEvent('link-home-7', this.showOverview);
  this.setClickEvent('link-home-8', this.showOverview);
  this.setClickEvent('link-home-9', this.showOverview);

  this.setClickEvent('tutorialCard-nav-1-next', tutorialCardEvent);
  this.setClickEvent('tutorialCard-nav-2-prev', tutorialCardEvent);
  this.setClickEvent('tutorialCard-nav-2-next', tutorialCardEvent);
  this.setClickEvent('tutorialCard-nav-3-prev', tutorialCardEvent);
  this.setClickEvent('tutorialCard-nav-3-next', tutorialCardEvent);
  this.setClickEvent('tutorialCard-nav-4-prev', tutorialCardEvent);
  this.setClickEvent('tutorialCard-nav-4-next', tutorialCardEvent);
  this.setClickEvent('tutorialCard-nav-5-prev', tutorialCardEvent);
  this.setClickEvent('tutorialCard-nav-5-next', tutorialCardEvent);
  this.setClickEvent('tutorialCard-nav-6-prev', tutorialCardEvent);
  this.setClickEvent('tutorialCard-nav-6-next', tutorialCardEvent);
  this.setClickEvent('tutorialCard-nav-7-prev', tutorialCardEvent);
  this.setClickEvent('tutorialCard-nav-7-next', tutorialCardEvent);
  this.setClickEvent('tutorialCard-nav-8-prev', tutorialCardEvent);
  this.setClickEvent('tutorialCard-nav-8-next', tutorialCardEvent);
  this.setClickEvent('tutorialCard-nav-9-prev', tutorialCardEvent);
};


/**
 * Changes tutorialCard and sets up links
 * @param {!string} order
 * @param {string=} opt_prev
 * @param {string=} opt_next
 */
cwc.ui.Tutorial.prototype.showTutorialCard = function(order, opt_prev,
    opt_next) {
  this.tutorialCardChange('1', '2');
  if (opt_next) {
    this.setClickEvent('tutorialCard-nav-' + order + '-' + opt_next,
      this.tutorialCardChange(order, opt_next));
  }
  if (opt_prev) {
    this.setClickEvent('tutorialCard-nav-' + order + '-' + opt_prev,
      this.tutorialCardChange(order, opt_prev));
  }
  this.setClickEvent('link-home-2', this.showOverview);
};


/**
 * Hides current tutorial card, and shows next/previous as indicated.
 * @param {!string} hidee
 * @param {!string} showee
 * @param {string=} opt_prefix
 */
cwc.ui.Tutorial.prototype.tutorialCardChange = function(hidee, showee,
    opt_prefix) {
  var prefix = opt_prefix || this.prefix;
  console.log('called ttc for ' + hidee + ' and ' + showee + '. prefix is ' +
      prefix);
  var hideeName = prefix + 'tutorialCard-' + hidee;
  var hideeElem = goog.dom.getElement(hideeName);
  var showeeName = prefix + 'tutorialCard-' + showee;
  var showeeElem = goog.dom.getElement(showeeName);
  if (!hideeElem) {
    console.error('tcc: Was not able to find element ' + hideeName + '!');
  } else if (!showeeElem) {
    console.error('tcc: Was not able to find element ' + showeeName + '!');
  } else {
    console.log('trying to swap ' + hideeName + ' with ' + showeeName);
    goog.style.setElementShown(hideeElem, false);
    goog.style.setElementShown(showeeElem, true);
    console.log('swapped ' + hideeName + ' with ' + showeeName + '!');
  }
};


/**
 * @param {!string} template_name
 */
cwc.ui.Tutorial.prototype.showTemplate = function(template_name) {
  if (this.nodeContent && template_name) {
    goog.soy.renderElement(this.nodeContent,
        cwc.soy.Tutorial[template_name], {'prefix': this.prefix});
    var layoutInstance = this.helper.getInstance('layout');
    if (layoutInstance) {
      layoutInstance.showOverlay(true);
    }
  } else {
    console.error('Unable to render template', template_name);
  }
};


/**
 * Adds the click event for the given name and the given function.
 * @param {!string} name
 * @param {!function()} event
 * @param {string=} opt_prefix
 * @return {function()}
 */
cwc.ui.Tutorial.prototype.setClickEvent = function(name, event,
    opt_prefix) {
  var prefix = opt_prefix || this.prefix;
  var elementName = prefix + name;
  var element = goog.dom.getElement(elementName);
  if (!element) {
    console.error('Was not able to find element ' + elementName + '!');
  }

  return goog.events.listen(element, goog.events.EventType.CLICK,
      event, false, this);
};
