/**
 * @fileoverview Tour
 *
 * @license Copyright 2018 The Coding with Chrome Authors.
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
 * @author carheden@google.com (Adam Carheden)
 * @author mbordihn@google.com (Markus Bordihn)
 */
goog.provide('cwc.ui.Tour');

goog.require('cwc.mode.Modder.Events');
goog.require('cwc.mode.Type');
goog.require('cwc.ui.Helper');
goog.require('cwc.utils.Logger');

goog.require('goog.events');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.Tour = function(helper) {
  /** @type {string} */
  this.name = 'Tour';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);

  /** @private {string} */
  this.content_ = '';

  /** @private {Shepherd.Tour} */
  this.tour_ = null;

  /** @private {string} */
  this.tourDescription_ = '';

  /** @private {number} */
  this.tourLength_ = 0;
};


/**
 * @param {!Object} tour
 */
cwc.ui.Tour.prototype.setTour = function(tour) {
  if (!tour || !tour['data']) {
    this.tour_ = null;
    return;
  }

  this.log_.info('Loading tour', tour['description']);
  this.tourDescription_ = tour['description'] || '';
  this.tour_ = new Shepherd.Tour({
    'defaults': {
      'classes': 'shepherd-theme-arrows',
      'showCancelLink': true,
    },
  });
  this.tourLength_ = tour['data'].length;
  for (let i in tour['data']) {
    if (!Object.prototype.hasOwnProperty.call(tour['data'], i)) continue;
    let data = tour['data'][i];
    let step = {};

    // Step id
    step['id'] = data['id'] || 'step' + i;

    // Title
    if (data['title']) {
      step['title'] = i18t(data['title']);
    } else {
      this.log_.error('Step', i, 'missing title!');
    }

    // Text
    if (data['text']) {
      step['text'] = i18t(data['text']);
    } else {
      this.log_.error('Step', i, 'missing text!');
    }

    // Attached to element
    if (typeof data['attachTo'] !== 'undefined') {
      step['attachTo'] = data['attachTo'];
    }

    // Handle buttons
    if (data['buttons']) {
      step['buttons'] = data['buttons'];
    } else {
      step['buttons'] = this.processButtons_(i);
    }

    this.tour_.addStep(step);
  }
};


/**
 * @return {string}
 */
cwc.ui.Tour.prototype.getTourDescription = function() {
  return this.tourDescription_ || '';
};


/**
 * @return {Shepherd.Tour|boolean}
 */
cwc.ui.Tour.prototype.getTour = function() {
  return this.tour_ || false;
};

cwc.ui.Tour.prototype.startTour = function() {
  if (!this.tour_) {
    return;
  }
  this.tour_.cancel();
  this.log_.info('Starting tour with', this.tourLength_, 'steps...');
  this.tour_['once']('cancel', () => {
    let sidebarInstance = this.helper.getInstance('sidebar');
    if (sidebarInstance) {
      sidebarInstance.setActive('tour', false);
    }
  });
  let sidebarInstance = this.helper.getInstance('sidebar');
  if (sidebarInstance) {
    sidebarInstance.showContent('tour', 'Tour', this.tourDescription_);
  }
  this.tour_.start();
};


cwc.ui.Tour.prototype.cancelTour = function() {
  let sidebarInstance = this.helper.getInstance('sidebar');
  if (sidebarInstance) {
    sidebarInstance.setActive('tour', false);
  }
  this.tour_.cancel();
};


cwc.ui.Tour.prototype.clear = function() {
  if (this.tour_) {
    this.cancelTour();
    this.tour_ = null;
  }
  this.tourLength_ = 0;
};


/**
 * @param {number} stepNumber
 * @param {number} tourLength
 * @param {Function} cancel
 * @return {!Array}
 * @private
 */
cwc.ui.Tour.prototype.getStepButtons = function(stepNumber, tourLength,
  cancel) {
  let tourButtons = [];

  // Back button
  if (stepNumber > 0) {
    tourButtons.push({
      'text': i18t('@@GENERAL__BACK'),
      // The inline func lets us call getStepButtons before this.tour_ is set
      'action': () => {
        this.tour_['back']();
      },
      'classes': 'shepherd-button-secondary',
    });
  }

  // Exit
  if (stepNumber == 0) {
    tourButtons.push({
      'text': i18t('@@GENERAL__EXIT'),
      'action': cancel,
      'classes': 'shepherd-button-secondary',
    });
  }

  // Done
  if (stepNumber == tourLength - 1) {
    tourButtons.push({
      'text': i18t('@@GENERAL__DONE'),
      'action': cancel,
      'classes': 'shepherd-button-example-primary',
    });
  }

  // Next button
  if (stepNumber < tourLength - 1) {
    tourButtons.push({
      'text': i18t('@@GENERAL__NEXT'),
      // The inline func lets us call getStepButtons before this.tour_ is set
      'action': () => {
        this.tour_['next']();
      },
      'classes': 'shepherd-button-example-primary',
    });
  }
  return tourButtons;
};


/**
 * @param {number} stepNumber
 * @return {!Array}
 * @private
 */
cwc.ui.Tour.prototype.processButtons_ = function(stepNumber) {
  return this.getStepButtons(stepNumber, this.tourLength_,
    this.cancelTour.bind(this));
};
