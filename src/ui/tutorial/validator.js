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
 */
goog.provide('cwc.ui.TutorialValidator');

goog.require('cwc.utils.Helper');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.Logger');
goog.require('cwc.soy.ui.Tutorial');

goog.require('goog.dom');
goog.require('goog.events');


/**
 * @enum {string}
 * @export
 */
cwc.ui.TutorialValidator.Type = {
  FUNCTION: 'function',
  MATCH_TEXT_OUTPUT: 'match_text_output',
};

/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.TutorialValidator = function(helper) {
  /** @type {string} */
  this.name = 'TutorialValidator';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('tutorialValidator');

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, '', this);

  /** @private {boolean} */
  this.webviewSupport_ = this.helper.checkChromeFeature('webview');

  /** @private {cwc.ui.Tutorial} */
  this.tutorial_ = helper.getInstance('tutorial');

  /** @private {Element} */
  this.sandbox_ = null;

  /** @private {!boolean} */
  this.running_ = false;
};

/**
 * Creates a validator webview/iframe with the same code as the preview and
 * runs validation code in it.
 */
cwc.ui.TutorialValidator.prototype.start = function() {
  this.events_.clear();

  if (!this.getValidate_()) {
    this.log_.info('No validate, not starting validation');
    return;
  }

  if (!this.sandbox_) {
    if (this.webviewSupport_) {
      this.sandbox_ = document.createElement('webview');
    } else {
      this.sandbox_ = document.createElement('iframe');
    }
    goog.dom.appendChild(document.body, this.sandbox_);
  }
  this.events_.listen(this.sandbox_,
    this.webviewSupport_ ? 'contentload' : 'onload',
    this.handleValidatorLoaded_);
  this.running_ = true;

  let rendererInstance = this.helper.getInstance('renderer');
  // Renderer will fail if there's no editor
  if (!rendererInstance || !this.helper.getInstance('editor')) {
    this.log_.error('Failed to get renderer instance');
    return;
  }
  let contentUrl = rendererInstance.getContentUrl();
  if (contentUrl.length >= 1600000) {
    this.log_.error('Content URL too long, refusing to set');
    return;
  }

  this.sandbox_['src'] = contentUrl;
};

/**
 * @return {string|null}
 * @private
 */
cwc.ui.TutorialValidator.prototype.getValidate_ = function() {
  let validate = this.tutorial_.getValidate();
  if (!validate) {
    this.log_.info('No validation function, not running validation');
    return null;
  }

  if (!(typeof validate === 'object')) {
    this.log_.warn('Invalid validate. Expecting object, got', validate);
    return null;
  }
  if (!('value' in validate)) {
    this.log_.warn('Invalid validate, missing key \'value\'', validate);
    return null;
  }
  if (!('type' in validate)) {
    this.log_.warn('Invalid validate, missing key \'type\'', validate);
    return null;
  }

  return validate;
};

/**
 * @param {string} textMatch
 * @param {string} message
 * @private
 */
cwc.ui.TutorialValidator.prototype.validateByMatchTextOutput_ =
  function(textMatch, message) {
  this.log_.info('Starting validation by text match');

  let code = `(function() { return document.body.innerText; })();`;
  try {
    this.sandbox_.executeScript({code: code}, (results) => {
      let textOutput = '';
      if (results && results.length >= 1) {
        textOutput = results[0];
      } else {
        this.log_.info('No results, text output is empty');
      }
      this.matchTextOutput_(textOutput, textMatch, message);
    });
  } catch (e) {
    this.log_.error('Failed to inject', code, ' into ', this.sandbox_, ': ', e);
  }
};

/**
 * @param {string} textOutput
 * @param {string} textMatch
 * @param {string} message
 * @private
 */
cwc.ui.TutorialValidator.prototype.matchTextOutput_ = function(textOutput,
  textMatch, message) {
  this.log_.info('Got text content', textOutput);
  let result = {
    'solved': false,
  };
  if (this.normalizeText(textMatch) === this.normalizeText(textOutput)) {
    result = {
      'solved': true,
      'message': message,
    };
  }
  this.processValidateResults_(result);
};

/**
 * Callback for validate.
 * @param {object} result
 * @private
 */
cwc.ui.TutorialValidator.prototype.processValidateResults_ = function(result) {
  this.log_.info('Validation results:', result);
  if (typeof result !== 'object') {
    this.log_.warn('Ignoring script result because it is not an object');
    return;
  }
  if ('message' in result && result['message']) {
    this.tutorial_.setMessage(result['message']);
    this.tutorial_.solved('solved' in result && result['solved']);
  } else {
    this.tutorial_.setMessage('');
    this.tutorial_.solved(false);
  }
};


/**
 * Injects code into an iframe/webview and handles the results.
 * @param {string} code
 * @param {any} expect
 * @param {int} timeout
 * @private
 * @return {Promise}
 */
cwc.ui.TutorialValidator.prototype.injectCode_ = function(code, expect,
  timeout = 5000) {
  this.log_.info('Injecting ', code);
  return new Promise((resolve) => {
    code = `(${code.replace(/\s*;\s*$/, '')})();`;
    try {
      this.sandbox_.executeScript({code: code}, (results) => {
        if (!results || results.length < 1 || results[0] !== expect) {
          this.log_.error('Injected code', code, ' returned ', results,
            'Expecting', expect);
          resolve(false);
        }
        resolve(true);
      });
      setTimeout(() => {
        if (this.running()) {
          this.log_.warn('Killing validation script after', timeout,
            'seconds.');
          this.stop();
        }
      }, timeout);
    } catch (e) {
      this.log_.error('Failed to inject', code, ' into ', this.sandbox_, ': ',
        e);
      resolve(false);
    }
  });
};


/**
 * Calls the appropriate function to run validatior code in sandbox
 * webview/iframe
 * @private
 */
cwc.ui.TutorialValidator.prototype.handleValidatorLoaded_ = function() {
  if (!this.running()) {
    return;
  }

  let validate = this.getValidate_();
  if (!validate) {
    return;
  }

  switch (validate['type']) {
    case cwc.ui.TutorialValidator.Type.FUNCTION:
      this.validateByFunction_(validate['value']);
      break;
    case cwc.ui.TutorialValidator.Type.MATCH_TEXT_OUTPUT:
      this.validateByMatchTextOutput_(validate['value'],
        'message' in validate && typeof validate['message'] == 'string' ?
          validate['message'] : 'Great Job!');
      break;
    default:
      this.log_.warn('Unknown validator type ', validate['type']);
      return;
  }
};

/**
 * Listens for validator messages and calls the validator function.
 * This code is injected into the iframe/webview.
 * @param {string} func
 * @private
 */
cwc.ui.TutorialValidator.prototype.validateByFunction_ = async function(func) {
  // Inject the validation function
  let setCwCValidate = `function() {
    window.top['cwc-validate-script'] = (${func});
      return true;
    }`;
  if (!(await this.injectCode_(setCwCValidate, true))) {
    return;
  }

  // Inject the listener for validation messages
  if (!(await this.injectCode_(this.validationListener_.toString(), true))) {
    return;
  }

  this.callValidator_();
};

/**
 * Listens for validator messages and calls the validator function.
 * This code is injected into the iframe/webview.
 * @private
 * @return {boolean}
 */
cwc.ui.TutorialValidator.prototype.validationListener_ = function() {
  // Create a function to listen for validation messages
  window.addEventListener('message', function(event) {
    const validatorArgs = 'cwc-validate-args';
    if (!event['data'] || typeof event['data'] !== 'object' ||
        !event['data'].hasOwnProperty(validatorArgs)) {
      console.log('validation listener: Ignoring unknown message', event);
      return false;
    }

    const validatorFunctionName = 'cwc-validate-script';
    if (typeof window[validatorFunctionName] !== 'function') {
      console.error(`window[${validatorFunctionName}] is not a function.`);
      return false;
    }

    let args = Array.isArray(event['data'][validatorArgs]) ?
      event['data'][validatorArgs] : [event['data'][validatorArgs]];

    console.log('calling ', window[validatorFunctionName], 'with', args);
    let result = window[validatorFunctionName].apply(null, args);
    console.log('got restuls', result);

    event['source'].postMessage({'cwc-validate-result': result},
      event['origin']);
  });
  return true;
};


/**
 * Calls the validation function with the current editor code.
 * @private
 */
cwc.ui.TutorialValidator.prototype.callValidator_ = function() {
  let editorInstance = this.helper.getInstance('editor');
  // TODO: support multiple editor views
  let editorContent = editorInstance.getEditorContent(
    editorInstance.getCurrentView());

  // Listen for the reply
  this.events_.listen(window, 'message',
    this.handleValidatorMessage_.bind(this));

  this.log_.info('Calling validator with code ', editorContent);

  // Call the validator in the iframe/webview
  this.sandbox_.contentWindow.postMessage({
    'cwc-validate-args': [editorContent],
  }, '*');
};


/**
 * Processes the results of the current step's validation function.
 * @param {Event} event
 * @private
 */
cwc.ui.TutorialValidator.prototype.handleValidatorMessage_ = function(event) {
  let browserEvent = event.getBrowserEvent();
  if (!browserEvent) {
    this.log_.warn('Got message without browser event:', event);
    return;
  }

  if (!this.running()) {
    this.log_.warn('Ignoring message', event,
      'because valiation isn\'t running');
    return;
  }
  if (!('source' in browserEvent) ||
    browserEvent['source'] !== this.sandbox_.contentWindow) {
    this.log_.warn('Ignoring message', browserEvent, 'because source isn\'t',
      this.sandbox_.contentWindow);
    return;
  }

  if (typeof browserEvent['data'] === 'object' &&
    'cwc-validate-result' in browserEvent['data']) {
    this.processValidateResults_(browserEvent['data']['cwc-validate-result']);
    this.stop();
  } else {
    this.log_.info('Igorning unknown event', browserEvent);
  }
};


/**
 * Determins if the script is running.
 * @return {boolean}
 */
cwc.ui.TutorialValidator.prototype.running = function() {
  return this.running_;
};

/**
 * Stops validation and cleans up events and sandbox.
 */
cwc.ui.TutorialValidator.prototype.stop = function() {
  this.log_.info('Stopping validation');
  this.events_.clear();
  if (this.running()) {
    this.sandbox_['src'] = 'about:blank';
  }
  this.running_ = false;
};

/**
 * @param {!string} text
 * @return {!string}
 */
cwc.ui.TutorialValidator.prototype.normalizeText = function(text) {
  return text.toLowerCase()
    .trim()
    .replace(/\s+/, ' ')
    .replace(/[^A-Za-z0-9 ]/g, '');
};
