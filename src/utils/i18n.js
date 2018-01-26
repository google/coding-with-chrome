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

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);

  /** @type {!string} */
  this.language = '';

  /** @type {!Array} */
  this.supportedLanguages = [];

  /** @type {!string} */
  this.fallbackLanguage = 'en';

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
};


/**
 * @param {Function=} callback
 * @param {string=} language
 * @param {string=} languageFile
 * @param {string=} blacklistFile
 * @param {string=} supportedLanguagesFile
 */
cwc.utils.I18n.prototype.prepare = function(callback = undefined, language = '',
    languageFile = '', blacklistFile = '', supportedLanguagesFile = '') {
  // Register global Locales variable if needed.
  window['Locales'] = window['Locales'] || {};
  window['Locales']['blacklist'] = window['Locales']['blacklist'] || [];
  window['Locales']['supportedLanguages'] =
    window['Locales']['supportedLanguages'] || [];

  // Register global handler
  window['i18t'] = this.translate.bind(this);
  window['i18soy'] = this.translateSoy.bind(this);

  // Callback handling
  let callbackHandling = function() {
    this.setSupportedLanguages();
    this.setLanguage(language);
    if (goog.isFunction(callback)) {
      callback();
    }
  }.bind(this);

  // Load optional files like blacklist and language
  const promises = [];
  if (supportedLanguagesFile) {
    promises.push(this.loadFile_(supportedLanguagesFile,
      this.supportedLanguagesNodeId));
  }
  if (blacklistFile) {
    promises.push(this.loadFile_(blacklistFile, this.blacklistNodeId));
  }
  if (languageFile) {
    promises.push(this.loadFile_(languageFile, this.languageNodeId));
  }

  if (promises.length) {
    Promise.all(promises).then(
      callbackHandling
    ).catch((e) => {
      this.log_.error('Unable to load required file(s):', e);
      callbackHandling();
    });
  } else {
    callbackHandling();
  }
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
 * @return {!string}
 */
cwc.utils.I18n.prototype.getLanguage = function() {
  if (!this.language) {
    if (typeof chrome !== 'undefined' && typeof chrome.i18n !== 'undefined') {
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
  if (!Locales) {
    this.log_.error('Global variable "Locales" is undefined.');
  } else if (Locales && Object.keys(Locales).length == 0) {
    this.log_.error('Unable to find any language file.');
  } else if (!Locales[this.language]) {
    this.log_.error('Language', this.language, ' is untranslated.');
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
cwc.utils.I18n.prototype.loadFile_ = function(file,
    node_id = 'cwc-i18n-loader') {
  return new Promise((resolve, reject) => {
    let headNode = document.head || document.getElementsByTagName('head')[0];
    let oldScriptNode = document.getElementById(node_id);
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
