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
 * @author mbordihn@google.com (Markus Bordihn)
 */
goog.provide('cwc.Tutorial');

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
cwc.Tutorial = function(helper) {
  /** @type {!string} */
  this.name = 'Tutorial';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('tutorial');

  /** @private {!boolean} */
  this.chromeApp_ = this.helper.checkChromeFeature('app');

  /** @private {!string} */
  this.resourcesPath_ = '../resources/tutorial/';

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);

  /** @private {Shepherd.Tour} */
  this.tour_ = null;

  /** @private {Element} */
  this.tourButton_ = null;

  /** @private {number|goog.events.ListenableKey|null} */
  this.tourButtonKey_ = null;
};

/**
 * @param {Array} steps
 */
cwc.Tutorial.prototype.setTour_ = function(steps) {
  this.log_.info('Loading tour...');
  this.tour = new Shepherd.Tour({
    'defaults': {
      'classes': 'shepherd-theme-arrows',
      'showCancelLink': true,
    },
  });
  for (let i in steps) {
    if (!Object.prototype.hasOwnProperty.call(steps, i)) continue;
    let step = steps[i];
    for (let key of ['id', 'buttons']) {
      if (key in step) {
        this.log_.warn('Overwriting "'+key+'"="'+step.id+' in step '+i);
      }
    }
    step.id = 'step'+i;
    step.buttons = [];
    if (i > 0) {
      step.buttons.push({
        'text': i18t('Back'),
        'action': this.tour.back,
        'classes': 'shepherd-button-example-primary',
      });
    }
    let cancelText = (i < steps.length-1) ? 'Exit' : 'Done';
    step.buttons.push({
      'text': i18t(cancelText),
      'action': this.tour.cancel,
      'classes': 'shepherd-button-secondary',
    });
    if (i < steps.length-1) {
      step.buttons.push({
        'text': i18t('Next'),
        'action': this.tour.next,
        'classes': 'shepherd-button-example-primary',
      });
    }
    for (let key of ['title', 'text']) {
      if (key in step) {
        step[key] = i18t(step[key]);
      } else {
        this.log_.warn('Step '+i+' has no "'+key+'" key.');
      }
    }
    this.tour.addStep(step);
  }

  this.log_.info('Starting tour with '+steps.length+' steps...');
  this.tour.start();
};

/**
 * @param {Event} e
 */
cwc.Tutorial.prototype.render = function() {
  if (!this.helper.experimentalEnabled()) {
    return;
  }

  let fileInstance = this.helper.getInstance('file');
  if (!fileInstance) {
    this.log_.info('No file instance');
    return;
  }

  let modeInstance = this.helper.getInstance('mode');
  if (!modeInstance) {
    this.log_.info('No mode instance');
    return;
  }

  if (!modeInstance.filename.toLowerCase().endsWith('.cwct')) {
    this.log_.info('"'+modeInstance.filename+'" is not a .cwct file');
    return;
  }

  let sidebarInstance = this.helper.getInstance('sidebar');
  if (!sidebarInstance) {
    this.log_.error('No sidebar, quitting');
    return;
  }
  let buttonId = 'tour';
  this.tourButton_ = sidebarInstance.addCustomButton(buttonId, 'timeline',
      'Start Tour');
    // We listen ourselves instead of passing the event handler to
    // addCustomButton() because addCustomButton() highlights the button on
    // click. Since we have no content, we don't want to change the active
    // button.
  this.tourButtonKey_ = goog.events.listen(this.tourButton_,
    goog.events.EventType.CLICK, () => {
      this.log_.info('Restarting tour...');
      this.tour.cancel();
      this.tour.start();
    });

  let tour = fileInstance.getFile().getMetadata('tour', 'tutorial');
  if (tour && Array.isArray(tour)) {
      this.setTour_(tour);
  } else {
    cwc.ui.Helper.enableElement('cwc-sidebar-'+buttonId+'-button', false);
    if (tour) {
      this.log_.error('Invalid tutorial data. "tour" is not an array');
    } else {
      this.log_.info('No tour for file "'+modeInstance.filename+'"');
    }
  }
};

cwc.Tutorial.prototype.clear = function() {
  if (this.tour_) this.tour_.cancel();
  if (this.tourButtonKey_) {
    if (!goog.events.unlistenByKey(this.tourButtonKey_)) {
      this.log_.warn('Failed to unlisten to tutorial button.');
    }
  }
};
