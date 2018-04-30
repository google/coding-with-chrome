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

  /** @private {!boolean} */
  this.webviewSupport_ = this.helper.checkChromeFeature('webview');

  /** @private {string} */
  this.validatePreview_ = null;

  /** @private {string} */
  this.processResults_ = null;
};


/**
 * @param {!Object} tutorial
 */
cwc.ui.Tutorial.prototype.setTutorial = function(tutorial) {
  if (!tutorial || !tutorial['content']) {
    return;
  }

  if (!tutorial['processResults']) {
    this.log_.warn('Empty processRsults');
  }
  if (!tutorial['validatePreview']) {
    this.log_.warn('Empty validatePreview');
  }

  this.log_.info('Loading tutorial data', tutorial);
  this.content_ = tutorial['content'];
  this.processResults_ = tutorial['processResults'];
  this.validatePreview_ = tutorial['validatePreview'];
};


cwc.ui.Tutorial.prototype.startTutorial = function() {
  if (!this.content_) {
    return;
  }
  this.log_.info('Starting tutorial ...');
  let sidebarInstance = this.helper.getInstance('sidebar');
  if (sidebarInstance) {
    sidebarInstance.showRawContent('Tutorial', this.content_);
    sidebarInstance.setActive('tutorial', true);
    this.start();
  }
};


/**
 * @return {!string}
 */
cwc.ui.Tutorial.prototype.getContent = function() {
  return this.content_;
};


cwc.ui.Tutorial.prototype.start = function() {
  if (!this.webviewSupport_) {
     this.log_.warn('No webview support');
     return;
  } // TODO(carheden): support iframe

  let previewInstance = this.helper.getInstance('preview');
  this.runValidatePreview(previewInstance.getContent());

  goog.events.listen(previewInstance.getEventHandler(),
    cwc.ui.preview.Events.Type.CONTENT_LOAD, (e) => {
      this.runValidatePreview(e.data['preview']);
    }, false, this);
};


/**
 * @param {Object} preview
 */
cwc.ui.Tutorial.prototype.runValidatePreview = function(preview) {
  if (!preview) {
    return;
  }
  if (this.validatePreview_) {
    preview.executeScript({code: this.validatePreview_}, (results) => {
      this.log_.info('validatePreview returned', results);
      this.processValidatePreviewResults_.bind(this)(results[0]);
     });
    return;
  }
  this.processValidatePreviewResults_(null);
};


/**
 * @param {!Object} results
 * @private
 */
cwc.ui.Tutorial.prototype.processValidatePreviewResults_ = function(results) {
  let sidebarInstance = this.helper.getInstance('sidebar');
  if (!sidebarInstance) {
    this.log_.error('No sidebar, ignoring results of validatePreview');
    return;
  }
  let tutorialNode = sidebarInstance.getContentNode();
  if (!tutorialNode) {
    this.log_.warn('No tutorial node, ignore results of validatePreview');
    return;
  }

  let listenForResults = function() {
    addEventListener('message', function(e) {
      if (e.data && (typeof e.data) === 'object' &&
          e.data.hasOwnProperty('cwc-validated-data') &&
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
    this.log_.info('Process results with arguments', args);
    tutorialNode.contentWindow.postMessage(args, '*');
  }.bind(this);

  // We attempt to inject the script twice because webview has no way to check
  // if the page load is done. If it's not, executeScript() fails. If we
  // always listen for 'loadstop', but it's already fired, we miss it and never
  // execute.
  let injectedCode = this.processResults_ +
    '(' + listenForResults.toString() + ')()';
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
