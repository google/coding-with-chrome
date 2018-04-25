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

goog.require('goog.events');

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

  /** @private {!string} */
  this.content_ = null;

  /** @private {Shepherd.Tour} */
  this.tour_ = null;

  /** @private {!number} */
  this.tourLength_ = 0;

  /** @private {!boolean} */
  this.webviewSupport_ = this.helper.checkChromeFeature('webview');

  /** @private {string} */
  this.validatePreview_ = null;

  /** @private {string} */
  this.processResults_ = null;
};

/**
 * @param {!string} content
 */
cwc.ui.Tutorial.prototype.setContent = function(content) {
  if (!content) {
    this.log_.warn('Set empty tutorial content');
    return;
  }
  this.content_ = content;
};

/**
 * @param {!string} validate
 */
cwc.ui.Tutorial.prototype.setValidatePreview = function(validate) {
  if (!validate) {
    this.log_.warn('Set empty validatePreview');
    return;
  }
  this.validatePreview_ = validate;
};

/**
 * @param {!string} validate
 */
cwc.ui.Tutorial.prototype.setProcessResults = function(validate) {
  if (!validate) {
    this.log_.warn('Set empty processRsults');
    return;
  }
  this.processResults_ = validate;
};

/**
 * @return {!string}
 */
cwc.ui.Tutorial.prototype.getContent = function() {
  return this.content_;
};

/**
/**
 * @param {!Array} tourData
 */
cwc.ui.Tutorial.prototype.setTour = function(tourData) {
  if (!tourData) {
    this.tour_ = null;
    return;
  }
  this.log_.info('Loading tour data', tourData);
  this.tour_ = new Shepherd.Tour({
    'defaults': {
      'classes': 'shepherd-theme-arrows',
      'showCancelLink': true,
    },
  });
  this.tour_['once']('cancel', () => {
    let sidebarInstance = this.helper.getInstance('sidebar');
    if (sidebarInstance) {
      sidebarInstance.setActive('tutorial', false);
    }
  });
  this.tourLength_ = tourData.length;
  for (let i in tourData) {
    if (!Object.prototype.hasOwnProperty.call(tourData, i)) continue;
    let data = tourData[i];
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
      step['buttons'] = [];
      // Back button
      if (i > 0) {
        step['buttons'].push({
          'text': i18t('BACK'),
          'action': this.tour_['back'],
          'classes': 'shepherd-button-secondary',
        });
      }

      // Exit
      if (i == 0) {
        step['buttons'].push({
          'text': i18t('EXIT'),
          'action': this.cancelTour.bind(this),
          'classes': 'shepherd-button-secondary',
        });
      }

      // Done
      if (i == this.tourLength_ - 1) {
        step['buttons'].push({
          'text': i18t('DONE'),
          'action': this.cancelTour.bind(this),
          'classes': 'shepherd-button-example-primary',
        });
      }
      // Next button
      if (i < this.tourLength_ - 1) {
        step['buttons'].push({
          'text': i18t('NEXT'),
          'action': this.tour_['next'],
          'classes': 'shepherd-button-example-primary',
        });
      }
    }

    this.tour_.addStep(step);
  }
};


cwc.ui.Tutorial.prototype.start = function() {
  if (!this.webviewSupport_) {
     this.log_.warn('No webview support');
     return;
  } // TODO(carheden): support iframe

  let previewInstance = this.helper.getInstance('preview');
  if (!previewInstance) {
    this.log_.error('Failed to get preview instance');
    return;
  }

  if (previewInstance.content) {
    this.runValidatePreview(previewInstance.content);
  }

  goog.events.listen(previewInstance.getEventHandler(),
    cwc.ui.preview.Events.Type.CONTENT_LOAD,
    this.handlePreviewLoad, false, this);
};

cwc.ui.Tutorial.prototype.handlePreviewLoad = function(e) {
  // TODO(carheden): call the user's function with the source from the editor
  // as an argument.
  this.runValidatePreview(e.data['preview']);
};

cwc.ui.Tutorial.prototype.runValidatePreview = function(preview) {
  if (this.validatePreview_) {
    preview.executeScript({code: '(' + this.validatePreview_ + ')()'},
      (results) => {
        this.log_.info('validatePreview returned', results);
        this.processValidatePreviewResults_.bind(this)(results[0]);
     });
    return;
  }
  this.processValidatePreviewResults_(null);
};

/**
 * @param {Object} results
 */
cwc.ui.Tutorial.prototype.processValidatePreviewResults_ = function(results) {
  let sidebarInstance = this.helper.getInstance('sidebar');
  if (!sidebarInstance) {
    this.log_.error('No sidebar, ignoring results of validatePreview');
    return;
  }
  let tutorialNode = sidebarInstance.getTutorialNode();
  if (!tutorialNode) {
    this.log_.warn('No tutorial node, ignore results of validatePreview');
    return;
  }

  let listenForResults = function() {
    addEventListener('message', function(e) {
      if (e.data && (typeof e.data) === 'object' &&
          e.data.hasOwnProperty('cwc-validated-data') &&
          'cwc-validated' in window.top &&
          (typeof window.top['cwc-validated'] == 'function')) {
        window.top['cwc-validated'](e.data['cwc-validated-data']['code'],
          e.data['cwc-validated-data']['results']);
      }
    });
    return true;
  };
  let postResults = function(ret) {
    if (ret !== true) {
      this.log_.warn('Error injecting listener for preview validator tutorial',
        'Sending results anyway. Error was: ', ret);
    }

    let editorContent = this.helper.getInstance('editor').getEditorContent();
    let code = '';
    for (let key in editorContent) {
      if (editorContent.hasOwnProperty(key)) {
        code = editorContent[key];
      }
    }
    let args = {'cwc-validated-data': {'code': code, 'results': results}};
    this.log_.info('calling processResults with arguments', args);
    tutorialNode.contentWindow.postMessage(args, '*');
  }.bind(this);

  // We attempt to inject the script twice because webview has no way to check
  // if the page load is done. If it's not, executeScript() fails. If we
  // always listen for 'loadstop', but it's already fired, we miss it and never
  // execute.
  let injectedCode =
    '( window.top["cwc-validated"] = ('+this.processResults_+') );'+
    '('+listenForResults.toString()+')()';
  tutorialNode.addEventListener('loadstop', () => {
    tutorialNode.executeScript({code: injectedCode}, postResults);
  });
  try {
    tutorialNode.executeScript({code: injectedCode}, postResults);
  } catch (e) {
    this.log_.info('Failed to inject results.',
      'but it should run next time the page changes:', e);
  }
};

cwc.ui.Tutorial.prototype.startTour = function() {
  if (!this.tour_) return;
  this.log_.info('Starting tour with', this.tourLength_, 'steps...');
  let sidebarInstance = this.helper.getInstance('sidebar');
  if (sidebarInstance) {
    sidebarInstance.showContent('');
    sidebarInstance.setActive('tour', true);
  }
  this.tour_.start();
};


cwc.ui.Tutorial.prototype.cancelTour = function() {
  let sidebarInstance = this.helper.getInstance('sidebar');
  if (sidebarInstance) {
    sidebarInstance.setActive('tour', false);
  }
  this.tour_.cancel();
};


cwc.ui.Tutorial.prototype.clearTour = function() {
  if (this.tour_) {
    this.cancelTour();
    this.tour_ = null;
  }
  this.tourLength_ = 0;
};
