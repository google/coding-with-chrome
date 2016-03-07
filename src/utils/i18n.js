/**
 * @fileoverview Internationalization and localization (i18n).
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
 * @author mbordihn@google.com (Markus Bordihn)
 */
goog.provide('cwc.utils.I18n');



/**
 * Helper for i18n.
 * @param {string=} opt_area
 * @constructor
 * @final
 * @export
 */
cwc.utils.I18n = function(opt_area) {

  /** @type {!string} */
  this.area = opt_area || 'general';

  /** @type {!Object} */
  this.untranslated = {};

  /** @type {!Object} */
  this.usage = {};

  /** @type {!Array} */
  this.appendix = ['(', ')', '{', '}', '[', ']', ' ', ',', '.', '!', '?', '=',
                   '-', '+', '…'];
};


/**
 * @param {!string} text Text to translate
 * @return {!string}
 * @export
 */
cwc.utils.I18n.prototype.get = function(text) {
  if (!text) {
    return '';
  }
  var appendix = '';
  var textId = text;
  var untranslatedText = text;
  if (this.appendix.indexOf(text.slice(-1)) != -1) {
    if (text.slice(-2, -1) == ' ') {
      appendix = text.slice(-2);
      untranslatedText = textId = textId.slice(0, -2);
    } else {
      appendix = text.slice(-1);
      untranslatedText = textId = textId.slice(0, -1);
    }
  }
  textId = textId.replace(/ /g, '_')
    .replace(/[^a-zA-Z_]+/g, '')
    .toLowerCase();
  var translated_text = chrome.i18n.getMessage(textId);
  this.usage[textId] = (textId in this.usage) ? this.usage[textId] + 1 : 1;
  if (!translated_text) {
    console.warn('Text', textId, 'is not translated:', untranslatedText);
    this.untranslated[textId] = untranslatedText;
    return text;
  }
  translated_text = translated_text + appendix;
  if (text[0] == text[0].toUpperCase()) {
    return translated_text[0].toUpperCase() + translated_text.slice(1);
  }
  return translated_text[0].toLowerCase() + translated_text.slice(1);
};


/**
 * Maps function to the global window name space.
 * @export
 */
cwc.utils.I18n.prototype.mapGlobal = function() {
  if (!window) {
    throw 'Window name space is not avalible in this instance.';
  }
  if ('i18n' in window) {
    console.warn('i18n is already mapped to the global namespace!');
    return;
  }
  window['i18n'] = this;
  console.info('Added i18n to the global namespace.');
};


/**
 * @return {!string}
 */
cwc.utils.I18n.prototype.getToDo = function() {
  var counter = 0;
  var result = '';
  var language = chrome.i18n.getUILanguage();
  for (var textId in this.untranslated) {
    if (this.untranslated.hasOwnProperty(textId)) {
      result += '  "' + textId + '": {\n'
        + '    "message": "' + this.untranslated[textId] + '"\n'
        + '  },\n';
    }
    counter += 1;
  }
  if (result) {
    console.log('Found', counter, 'entries for', language, '!');
    console.log('File: app/_locales/.../message.json');
    console.log(result);
  }
  return result;
};
