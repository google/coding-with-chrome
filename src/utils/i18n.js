/**
 * @fileoverview Internationalization and localization (i18n).
 *
 * @license Copyright 2017 The Coding with Chrome Authors.
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

goog.require('cwc.utils.Logger');


/**
 * Helper for i18n.
 * @constructor
 * @final
 * @export
 */
cwc.utils.I18n = function() {
  /** @type {!string} */
  this.name = 'i18n';

  /** @type {!string} */
  this.language = '';

  /** @type {!string} */
  this.fallbackLanguage = 'eng';

  /** @type {!Array} */
  this.supportedLanguages = [this.fallbackLanguage];

  /** @type {!Object} */
  this.untranslated = {};

  /** @type {!string} */
  this.blacklistNodeId = 'cwc-i18n-blacklist';

  /** @type {!string} */
  this.languageNodeId = 'cwc-i18n-language';

  /** @type {!string} */
  this.supportedLanguagesNodeId = 'cwc.i18n-supported-languages';

  /** @type {!Object} */
  this.usage = {};

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);

  this.prepare_();
};


/**
 * @private
 */
cwc.utils.I18n.prototype.prepare_ = function() {
  // Register global Locales variable if needed.
  window['Locales'] = window['Locales'] || {};
  window['Locales']['blacklist'] = window['Locales']['blacklist'] || [];
  window['Locales']['supportedLanguages'] =
    window['Locales']['supportedLanguages'] || [];

  // Register global handler
  window['i18t'] = this.translate.bind(this);
  window['i18v'] = this.translateVariable.bind(this);
  window['i18soy'] = this.translateSoy.bind(this);

  this.setSupportedLanguages();
  let language = this.getLanguage();
  if (language) {
    this.log_.info('Detected user language', language);
    this.setLanguage(language);
  } else {
    this.log_.info('Using fallback language', this.fallbackLanguage);
    this.setLanguage(this.fallbackLanguage);
  }
};


/**
 * @param {!string} file
 * @return {Promise}
 */
cwc.utils.I18n.prototype.loadSupportedLanguagesFile = function(file) {
  return this.loadFile_(file, this.supportedLanguagesNodeId);
};


/**
 * @param {!string} file
 * @return {Promise}
 */
cwc.utils.I18n.prototype.loadBlacklistFile = function(file) {
  return this.loadFile_(file, this.blacklistNodeId);
};


/**
 * @param {!string} file
 * @return {Promise}
 */
cwc.utils.I18n.prototype.loadLanguageFile = function(file) {
  return this.loadFile_(file, this.languageNodeId);
};


/**
 * Translate the given text to the current language.
 * @param {!string} key
 * @param {string=} text
 * @return {!string}
 */
cwc.utils.I18n.prototype.translate = function(key, text = '') {
  if (!Locales || !Locales[this.language] ||
      typeof Locales['blacklist'][key] !== 'undefined') {
    return text || key;
  }

  if (typeof Locales[this.language][key] === 'undefined') {
    this.handleMissingKey_(key, text);
    return text || key;
  }

  return Locales[this.language][key];
};


/**
 * Translate the given soy context to the current language.
 * @param {!string} text
 * @param {Object=} optValues
 * @return {!string}
 */
cwc.utils.I18n.prototype.translateSoy = function(text, optValues) {
  if (!optValues) {
    return this.translate(text);
  }

  let indirect = (/^\{\$\w+\}$/.test(text));
  if (!indirect) {
    text = this.translate(text);
  }
  text = text.replace(/\{\$([^}]+)}/g, function(match, key) {
    return (optValues != null && key in optValues) ? optValues[key] : match;
  });

  return indirect ? this.translate(text) : text;
};


/**
 * Translate the given key and variable.
 * @param {!string} key
 * @param {!string} variable
 * @return {!string}
 */
cwc.utils.I18n.prototype.translateVariable = function(key, variable) {
  return this.translate(key).replace('$VAR$', variable);
};


/**
 * @return {!string}
 */
cwc.utils.I18n.prototype.getLanguage = function() {
  if (!this.language) {
    if (typeof navigator !== 'undefined' && navigator['language']) {
      return cwc.utils.I18n.bcp47ToISO639_3(navigator['language']);
    } else if (typeof chrome !== 'undefined' && chrome.i18n) {
      return chrome.i18n.getUILanguage();
    } else if (this.fallbackLanguage) {
      return this.fallbackLanguage;
    }
  }
  return this.language;
};


/**
 * @param {string=} language
 */
cwc.utils.I18n.prototype.setLanguage = function(language = '') {
  this.language = language || this.getLanguage();
  this.log_.info('Set language to', this.language);
  if (!Locales) {
    this.log_.error('Global variable "Locales" is undefined.');
  } else if (Locales && Object.keys(Locales).length == 0) {
    this.log_.error('Unable to find any language file.');
  } else if (!Locales[this.language] &&
             !Locales['supportedLanguages'].includes(this.language)) {
    this.log_.error('Language', this.language, 'is untranslated.');
  }
};


/**
 * @param {string=} language
 * @param {string=} text
 * @return {Object}
 */
cwc.utils.I18n.prototype.getLanguageData = function(
    language = this.getLanguage(), text = '') {
  if (text) {
    return Locales[language][text];
  }
  return Locales[language];
};


/**
 * @return {Array}
 */
cwc.utils.I18n.prototype.getSupportedLanguages = function() {
  return this.supportedLanguages;
};


/**
 * @param {Array=} languages
 */
cwc.utils.I18n.prototype.setSupportedLanguages = function(languages) {
  this.supportedLanguages = languages || Locales['supportedLanguages'];
};


/**
 * @return {!string}
 */
cwc.utils.I18n.prototype.getToDo = function() {
  let counter = 0;
  let result = '';
  for (let textId in this.untranslated) {
    if (Object.prototype.hasOwnProperty.call(this.untranslated, textId)) {
      result += '  \'' + textId + '\': \'' + textId + '\',\n';
      counter += 1;
    }
  }
  if (result) {
    console.log('Found', counter, 'untranslated text for', this.getLanguage());
    console.log('File: src/locales/' + this.getLanguage() + '/translation.js');
    console.log(result);
  }
  return result;
};


/**
 * Adding language file.
 * @param {!string} file
 * @param {string} node_id
 * @return {Promise}
 * @private
 */
cwc.utils.I18n.prototype.loadFile_ = function(file, node_id) {
  return new Promise((resolve, reject) => {
    let headNode = document.head || document.getElementsByTagName('head')[0];
    let oldScriptNode = document.getElementById(node_id || 'cwc-i18n-loader');
    if (oldScriptNode) {
      if (oldScriptNode.src === file) {
        this.log_.warn('File', file, 'was already loaded!');
        return;
      }
      oldScriptNode.parentNode.removeChild(oldScriptNode);
    }
    this.log_.info('Loading file:', file);
    let scriptNode = document.createElement('script');
    scriptNode.id = node_id;
    scriptNode.onload = resolve;
    scriptNode.onerror = reject;
    headNode.appendChild(scriptNode);
    scriptNode.src = file;
  });
};


/**
 * @param {!string} key
 * @param {string=} text
 * @private
 */
cwc.utils.I18n.prototype.handleMissingKey_ = function(key, text = '') {
  if (!/[a-zA-Z]{2,}/.test(key)) {
    return;
  }

  if (typeof this.untranslated[key] === 'undefined') {
    if (text) {
      this.log_.warn('Untranslated Key', key, 'with text:', text);
    } else {
      this.log_.warn('Untranslated Key', key);
    }
    this.untranslated[key] = 1;
  } else {
    this.untranslated[key]++;
  }
};


/**
 * ISO639-3 mapping table
 */
cwc.utils.I18n.ISO639_3 = {
  'eng': 'en',
  'deu': 'de',
  'hin': 'hi',
  'jpn': 'ja',
  'kor': 'ko',
};


/**
 * @param {!string} language
 * @return {string}
 */
cwc.utils.I18n.getISO639_1 = function(language) {
  if (language.length === 2) {
    return language;
  }

  if (cwc.utils.I18n.ISO639_3[language]) {
    return cwc.utils.I18n.ISO639_3[language];
  }

  return '';
};


/**
 * bcp47 mapping table
 */
cwc.utils.I18n.BCP47 = {
  'de': 'deu',
  'de-DE': 'deu',
  'en': 'eng',
  'en-US': 'eng',
};


/**
 * @param {!string} language
 * @return {!string}
 */
cwc.utils.I18n.bcp47ToISO639_3 = function(language) {
  return cwc.utils.I18n.BCP47[language] || '';
};
