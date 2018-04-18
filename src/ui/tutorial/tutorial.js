/**
 * @fileoverview Tutorial
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
goog.provide('cwc.ui.Tutorial');

goog.require('cwc.mode.Modder.Events');
goog.require('cwc.mode.Type');
goog.require('cwc.ui.Helper');
goog.require('cwc.utils.Database');
goog.require('cwc.utils.Logger');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.Tutorial = function(helper) {
  /** @type {!string} */
  this.name = 'Tutorial';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('tutorial');

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);

  /** @private {Shepherd.Tour} */
  this.tour_ = null;

  /** @private {Number} */
  this.tourLength_ = null;
};


/**
 * @param {!Array} tourData
 */
cwc.ui.Tutorial.prototype.setTour = function(tourData) {
  if (!tourData) {
    return;
  }
  this.log_.info('Loading tour data', tourData);
  this.tour_ = new Shepherd.Tour({
    'defaults': {
      'classes': 'shepherd-theme-arrows',
      'showCancelLink': true,
    },
  });
  this.tourLength_ = tourData.length;
  for (let i in tourData) {
    if (!Object.prototype.hasOwnProperty.call(tourData, i)) continue;
    let data = tourData[i];
    let step = {};

    // Step id
    step.id = data.id || 'step' + i;

    // Title
    if (data.title) {
      step.title = i18t(data.title);
    } else {
      this.log_.error('Step', i, 'missing title!');
    }

    // Text
    if (data.text) {
      step.text = i18t(data.text);
    } else {
      this.log_.error('Step', i, 'missing text!');
    }

    // Attached to element
    if (data.attachTo) {
      step.attachTo = data.attachTo;
    }

    // Handle buttons
    if (data.buttons) {
      step.buttons = data.buttons;
    } else {
      step.buttons = [];
      console.log(i, this.tourLength_);
      // Back button
      if (i > 0) {
        step.buttons.push({
          'text': i18t('Back'),
          'action': this.tour_.back,
          'classes': 'shepherd-button-secondary',
        });
      }

      // Exit
      if (i == 0) {
        step.buttons.push({
          'text': i18t('Exit'),
          'action': this.cancel.bind(this),
          'classes': 'shepherd-button-secondary',
        });
      }

      // Done
      if (i == this.tourLength_ - 1) {
        step.buttons.push({
          'text': i18t('Done'),
          'action': this.cancel.bind(this),
          'classes': 'shepherd-button-example-primary',
        });
      }
      // Next button
      if (i < this.tourLength_ - 1) {
        step.buttons.push({
          'text': i18t('Next'),
          'action': this.tour_.next,
          'classes': 'shepherd-button-example-primary',
        });
      }
    }

    this.tour_.addStep(step);
  }
};


cwc.ui.Tutorial.prototype.startTour = function() {
  this.log_.info('Starting tour with', this.tourLength_, 'steps...');
  let sidebarInstance = this.helper.getInstance('sidebar');
  if (sidebarInstance) {
    sidebarInstance.showContent('');
    sidebarInstance.setActive('tutorial', true);
  }
  this.tour_.start();
};


cwc.ui.Tutorial.prototype.cancel = function() {
  let sidebarInstance = this.helper.getInstance('sidebar');
  if (sidebarInstance) {
    sidebarInstance.setActive('tutorial', false);
  }
  this.tour_.cancel();
};


cwc.ui.Tutorial.prototype.clear = function() {
  if (this.tour_) {
    this.cancel();
    this.tour_ = null;
  }
  this.tourLength_ = null;
};
