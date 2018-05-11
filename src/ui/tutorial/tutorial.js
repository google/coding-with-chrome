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
goog.require('cwc.renderer.Helper');
goog.require('cwc.soy.ui.Tutorial');
goog.require('cwc.ui.Helper');
goog.require('cwc.utils.Database');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.Logger');
goog.require('cwc.utils.mime.Type');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.style');

goog.require('goog.soy');


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

  /** @type {!cwc.renderer.Helper} */
  this.rendererHelper = new cwc.renderer.Helper();

  /** @type {string} */
  this.prefix = this.helper.getPrefix('tutorial');

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);

  /** @private {!string} */
  this.content_ = '';

  /** @private {!string} */
  this.contentType_ = '';

  /** @private {!Element} */
  this.contentNode;

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, '', this);

  /** @private {!boolean} */
  this.webviewSupport_ = this.helper.checkChromeFeature('webview');

  /** @private {!string} */
  this.validatePreview_ = '';

  /** @private {!string} */
  this.processResults_ = '';
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
  let type = typeof tutorial['content'];
  switch (type) {
    case 'string':
      this.content_ = tutorial['content'];
      this.contentType_ = cwc.utils.mime.Type.MARKDOWN.type;
      break;
    case 'object':
      if (!('text' in tutorial['content'])) {
        this.log_.error('Tutorial content missing text key');
        return;
      }
      this.content_ = tutorial['content']['text'];
      if (!('mime_type' in tutorial['content'])) {
        this.log_.warn('Tutorial content missing mime_type key, defaulting to',
          cwc.utils.mime.Type.MARKDOWN.type);
        this.contentType_ = cwc.utils.mime.Type.MARKDOWN.type;
      } else {
        this.contentType_ = tutorial['content']['mime_type'];
      }
      break;
    default:
      this.log_.error('Can\'t process tutorial content of unknown type ', type);
      return;
  }
  this.processResults_ = tutorial['processResults'];
  this.validatePreview_ = tutorial['validatePreview'];
};


cwc.ui.Tutorial.prototype.startTutorial = function() {
  if (!this.content_) {
    return;
  }

  let htmlContent;
  switch (this.contentType_) {
    case cwc.utils.mime.Type.HTML.type:
      htmlContent = this.content_;
      break;
    case cwc.utils.mime.Type.MARKDOWN.type:
      if (this.helper.checkJavaScriptFeature('marked')) {
        htmlContent = window['marked'](this.content_);
      } else {
        this.log_.warn('Markdown not supported, displaying content as text');
        htmlContent = this.content_;
      }
      break;
    case cwc.utils.mime.Type.TEXT.type:
      htmlContent = goog.soy.renderAsFragment(cwc.coy.ui.Tutorial.text,
        {content: this.content_});
      break;
    default:
      this.log_.error('Unknown or unsupported content type', this.contentType_);
  }

  this.log_.info('Starting tutorial ...');
  let sidebarInstance = this.helper.getInstance('sidebar');
  if (sidebarInstance) {
    sidebarInstance.renderContent('tutorial', 'Tutorial',
      cwc.soy.ui.Tutorial.template, {
        prefix: this.prefix,
        webviewSupport: this.webviewSupport_,
      });
    this.contentNode_ = goog.dom.getElement(this.prefix+'body');
    if (!this.contentNode_) {
      this.log_.error('Failed to render content node');
    } else {
      this.contentNode_.src = this.rendererHelper.getDataURL(htmlContent);
    }
    this.events_.listen(this.contentNode_, 'consolemessage',
      this.handleConsoleMessage_);
    this.setMessage();
  }

  this.start();
};

/**
 * Logs console messages from the tutorial webview
 * @param {Event} event
 * @private
 */
cwc.ui.Tutorial.prototype.handleConsoleMessage_ = function(event) {
  let browserEvent = event.getBrowserEvent();
  // TODO: Log this to a tutorial developer console once we build one
  this.log_.info('['+browserEvent.level+']: '+browserEvent.message);
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
  if (!preview || !this.content_) {
    return;
  }
  if (this.validatePreview_) {
    preview.executeScript({code: this.validatePreview_}, (results) => {
      this.log_.info('validatePreview returned', results);
      let message = '';
      let solved = false;
      if (results.length >= 1) {
        switch (typeof results[0]) {
          case 'string':
            message = results[0];
            break;
          case 'boolean':
            solved = results[0];
            break;
          case 'object':
            if ('message' in results[0]) message = results[0]['message'];
            if ('solved' in results[0]) solved = results[0]['solved'];
            break;
          default:
            this.log_.warn('validatePreview returned unknown type: ',
              results[0]);
        }
      }
      this.solved(solved);
      this.setMessage(message);
      this.processValidatePreviewResults_.bind(this)(results[0]);
     });
    return;
  }
  this.processValidatePreviewResults_(null);
};

/**
 * @param {string} message
 */
cwc.ui.Tutorial.prototype.setMessage = function(message) {
  let messageDiv = goog.dom.getElement(this.prefix+'message');
  if (!messageDiv) {
    this.log_.error('Failed to get element with id "'+this.prefix+'message"');
    return;
  }
  if (message) {
    goog.soy.renderElement(messageDiv, cwc.soy.ui.Tutorial.message,
      {message: message});
    goog.style.setElementShown(messageDiv, true);
  } else {
    goog.style.setElementShown(messageDiv, false);
  }
};

/**
 * @param {!boolean} solved
 */
cwc.ui.Tutorial.prototype.solved = function(solved) {
  let messageDiv = goog.dom.getElement(this.prefix+'message');
  if (!messageDiv) {
    this.log_.error('Failed to get element with id "'+this.prefix+'message"');
    return;
  }
  if (solved) {
    goog.dom.classlist.add(messageDiv, 'solved');
  } else {
    goog.dom.classlist.remove(messageDiv, 'solved');
  }
};


/**
 * @param {!Object} results
 * @private
 */
cwc.ui.Tutorial.prototype.processValidatePreviewResults_ = function(results) {
  if (!this.processResults_) return;

  this.log_.info('Processing results:', results);

  if (!this.contentNode_) {
    this.log_.warn('No content node, no place to run processResults.');
    return;
  }
  let listenForResults = function() {
    window.addEventListener('message', function(e) {
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
    this.contentNode_.contentWindow.postMessage(args, '*');
  }.bind(this);

  // We attempt to inject the script twice because webview has no way to check
  // if the page load is done. If it's not, executeScript() fails. If we
  // always listen for 'loadstop', but it's already fired, we miss it and never
  // execute.
  let injectedCode = this.processResults_ +
    '(' + listenForResults.toString() + ')()';
  this.contentNode_.addEventListener('loadstop', () => {
    this.contentNode_.executeScript({code: injectedCode}, postResults);
  });
  try {
    this.contentNode_.executeScript({code: injectedCode}, postResults);
  } catch (e) {
    this.log_.info('Failed to inject results.',
      'but it should run next time the preview changes:', e);
  }
};


cwc.ui.Tutorial.prototype.clear = function() {
  this.content_ = null;
  this.processResults_ = null;
  this.validatePreview_ = null;
  this.contentNode_ = null;
};
