/**
 * @license Copyright 2020 The Coding with Chrome Authors.
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
 */

/**
 * @fileoverview Language Detection.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import { LanguageType } from './LanguageType.js';

/**
 * Language detection class.
 */
export class LanguageDetection {
  static languagePattern = {
    javascript:
      /(^|\n|\r)(var|let|const|function|class|if|for|while|switch|try|catch)\b/,
    html: /(^|\n|\r)<(!doctype|html|head|body|div|p|span|img|a|ul|ol|li|table|tr|th|td|form|input|button|textarea|select|option)\b/,
    typescript:
      /(^|\n|\r)(let|const|interface|class|if|for|while|switch|try|catch)\b/,
    python: /(^|\n|\r)(import|def|if|for|while|try|except)\b/,
    css: /(^|\n|\r)[{:]\s*[a-zA-Z-]+\s*:\s*[^\s;]+[;\n\r]*/,
    json: /^\s*[[{]/,
    xml: /(^|\n|\r)<([a-zA-Z0-9]+:)?[a-zA-Z0-9]+\b/,
  };

  /**
   * @param {string} filename
   * @param {string} content
   * @return {LanguageType}
   */
  static detect(filename, content) {
    const LanguageType = this.detectByFilename(filename);
    if (LanguageType !== LanguageType.UNKNOWN) {
      return LanguageType;
    }
    return this.detectByContent(content);
  }

  /**
   * @param {string} filename
   * @return {LanguageType}
   */
  static detectByFilename(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    switch (extension) {
      case 'css':
        return LanguageType.CSS;
      case 'html':
        return LanguageType.HTML;
      case 'js':
      case 'mjs':
        return LanguageType.JAVASCRIPT;
      case 'json':
        return LanguageType.JSON;
      case 'md':
        return LanguageType.MARKDOWN;
      case 'py':
        return LanguageType.PYTHON;
      case 'txt':
        return LanguageType.TEXT;
      case 'xml':
        return LanguageType.XML;
      default:
        return LanguageType.UNKNOWN;
    }
  }

  /**
   * @param {string} content
   * @return {LanguageType}
   */
  static detectByContent(content) {
    // Cheap content type detection
    if (content.startsWith('<!DOCTYPE html') || content.startsWith('<html')) {
      return LanguageType.HTML;
    } else if (content.startsWith('<?xml')) {
      return LanguageType.XML;
    } else if (content.startsWith('#!')) {
      if (content.includes('python')) {
        return LanguageType.PYTHON;
      }
    }

    // Expensive content type detection
    if (LanguageDetection.languagePattern.javascript.test(content)) {
      return LanguageType.JAVASCRIPT;
    } else if (LanguageDetection.languagePattern.html.test(content)) {
      return LanguageType.HTML;
    } else if (LanguageDetection.languagePattern.typescript.test(content)) {
      return LanguageType.JAVASCRIPT;
    } else if (LanguageDetection.languagePattern.python.test(content)) {
      return LanguageType.PYTHON;
    } else if (LanguageDetection.languagePattern.css.test(content)) {
      return LanguageType.CSS;
    } else if (LanguageDetection.languagePattern.json.test(content)) {
      return LanguageType.JSON;
    } else if (LanguageDetection.languagePattern.xml.test(content)) {
      return LanguageType.XML;
    }
    return LanguageType.UNKNOWN;
  }
}
