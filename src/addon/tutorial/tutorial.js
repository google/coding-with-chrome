/**
 * @fileoverview Tutorial addon.
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
goog.provide('cwc.addon.Tutorial');

goog.require('cwc.mode.Modder.Events');
goog.require('cwc.mode.Type');
goog.require('cwc.soy.addon.Tutorial');
goog.require('cwc.ui.SelectScreen.Events');
goog.require('cwc.utils.Database');
goog.require('cwc.utils.Logger');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.addon.Tutorial = function(helper) {
  /** @type {!string} */
  this.name = 'Addon Tutorial';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('addon-tutorial');

  /** @private {!boolean} */
  this.chromeApp_ = this.helper.checkChromeFeature('app');

  /** @private {!string} */
  this.resourcesPath_ = '../resources/tutorial/';

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);

  /** @private {Shepherd.Tour} */
  this.tour_ = null;
};


cwc.addon.Tutorial.prototype.prepare = function() {
  if (!this.helper.experimentalEnabled()) {
    return;
  }

  this.log_.info('Preparing tutorial addon ...');

  let selectScreenInstance = this.helper.getInstance('selectScreen');
  if (selectScreenInstance) {
    goog.events.listen(selectScreenInstance.getEventHandler(),
      cwc.ui.SelectScreen.Events.Type.VIEW_CHANGE,
      this.decorate, false, this);
  }

  let modeInstance = this.helper.getInstance('mode');
  if (modeInstance) {
    goog.events.listen(modeInstance.getEventHandler(),
      cwc.mode.Modder.Events.Type.MODE_CHANGE,
      this.eventsModder, false, this);
  }
};


/**
 * @param {Event} opt_e
 */
cwc.addon.Tutorial.prototype.decorate = function(opt_e) {
  // Render cards
  let basicNode = document.getElementById(
    'cwc-select-screen-normal_basic-addon');
  if (basicNode) {
    let template = goog.soy.renderAsElement(cwc.soy.addon.Tutorial.cards, {
      prefix: this.prefix,
    });
    basicNode.appendChild(template);

    // Event handler for the cards
    let cwcCard = document.getElementById('cwc-addon-tutorial-link-cwc');
    goog.events.listen(cwcCard, goog.events.EventType.CLICK, function() {
        this.loadFile_('cwc.cwc');
      }, false, this);
    let blocklyCard =
      document.getElementById('cwc-addon-tutorial-link-blockly');
    goog.events.listen(blocklyCard, goog.events.EventType.CLICK, function() {
        this.loadFile_('blockly.cwc');
      }, false, this);
  }
};

/**
 * @param {Array} steps
 */
cwc.addon.Tutorial.prototype.loadTour_ = function(steps) {
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

  let sidebarInstance = this.helper.getInstance('sidebar');
  if (sidebarInstance) {
    let button = sidebarInstance.addCustomButton('tour', 'timeline',
      'Restart Tour');
    // We listen ourselves instead of passing the event handler to
    // addCustomButton() because addCustomButton() highlights the button on
    // click. Since we have no content, we don't want to change the active
    // button.
    goog.events.listen(button, goog.events.EventType.CLICK, () => {
      this.log_.info('Restarting tour...');
      this.tour.cancel();
      this.tour.start();
    });
  }
  this.log_.info('Starting tour with '+steps.length+' steps...');
  this.tour.start();
};

/**
 * @param {Event} e
 */
cwc.addon.Tutorial.prototype.eventsModder = function(e) {
  let file = e.data.file;
  let fileInstance = this.helper.getInstance('file');

  let tour = fileInstance.getFile().getMetadata('tour', 'tutorial');
  if (tour) {
    if (Array.isArray(tour)) {
      this.loadTour_(tour);
    } else {
      this.log_.error('Invalid tutorial data. "tour" is not an array');
    }
  } else {
    this.log_.info('No tour for file', file);
  }


  let content = fileInstance.getFile().getMetadata('content', 'tutorial');
  if (content) {
     this.loadContent_(content);
  } else {
    this.log_.info('No content for file', file);
  }
};

/**
 * Loads file into editor.
 * @param {string} filename Example file name to load.
 * @private
 */
cwc.addon.Tutorial.prototype.loadFile_ = function(filename) {
  let loaderInstance = this.helper.getInstance('fileLoader');
  if (loaderInstance) {
    loaderInstance.loadLocalFile(this.resourcesPath_ + filename);
  }
  let editorWindow = this.chromeApp_ && chrome.app.window.get('editor');
  if (editorWindow) {
    editorWindow['clearAttention']();
  }
};
