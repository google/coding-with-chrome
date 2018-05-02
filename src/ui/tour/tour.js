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
goog.require('cwc.utils.Database');
goog.require('cwc.utils.Logger');

goog.require('goog.events');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.Tour = function(helper) {
  /** @type {!string} */
  this.name = 'Tour';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('tour');

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);

  /** @private {!string} */
  this.content_ = null;

  /** @private {Shepherd.Tour} */
  this.tour_ = null;

  /** @private {!string} */
  this.tourDescription_ = null;

  /** @private {!number} */
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
  this.tour_['once']('cancel', () => {
    let sidebarInstance = this.helper.getInstance('sidebar');
    if (sidebarInstance) {
      sidebarInstance.setActive('tour', false);
    }
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
 * @return {!string}
 */
cwc.ui.Tour.prototype.getTourDescription = function() {
  return this.tourDescription_ || '';
};


cwc.ui.Tour.prototype.startTour = function() {
  if (!this.tour_) {
    return;
  }
  this.tour_.cancel();
  this.log_.info('Starting tour with', this.tourLength_, 'steps...');
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
 * @param {!number} step
 * @return {!array}
 * @private
 */
cwc.ui.Tour.prototype.processButtons_ = function(step) {
  let tourButtons = [];
  // Back button
  if (step > 0) {
    tourButtons.push({
      'text': i18t('BACK'),
      'action': this.tour_['back'],
      'classes': 'shepherd-button-secondary',
    });
  }

  // Exit
  if (step == 0) {
    tourButtons.push({
      'text': i18t('EXIT'),
      'action': this.cancelTour.bind(this),
      'classes': 'shepherd-button-secondary',
    });
  }

  // Done
  if (step == this.tourLength_ - 1) {
    tourButtons.push({
      'text': i18t('DONE'),
      'action': this.cancelTour.bind(this),
      'classes': 'shepherd-button-example-primary',
    });
  }
  // Next button
  if (step < this.tourLength_ - 1) {
    tourButtons.push({
      'text': i18t('NEXT'),
      'action': this.tour_['next'],
      'classes': 'shepherd-button-example-primary',
    });
  }
  return tourButtons;
};
