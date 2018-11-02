/**
 * @fileoverview Internationalization and localization (i18n) mapping.
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
goog.provide('cwc.utils.I18nMapping');


/**
 * ISO639-3 english names.
 */
cwc.utils.I18nMapping.englishName = {
  'eng': 'English',
  'deu': 'German',
  'fra': 'French',
  'hin': 'Hindi',
  'jpn': 'Japanese',
  'kor': 'Korean',
  'swe': 'Swedish',
  'vie': 'Vietnamese',
};


/**
 * ISO639-3 native names.
 */
cwc.utils.I18nMapping.nativeName = {
  'eng': 'English',
  'deu': 'Deutsch',
  'fra': 'Français',
  'hin': 'हिन्दी',
  'jpn': '日本語',
  'kor': '한국어',
  'swe': 'Svenska',
  'vie': 'Tiếng Việt',
};


/**
 * ISO639-3 to ISO639-2 mapping table.
 */
cwc.utils.I18nMapping.ISO639_3 = {
  'eng': 'en',
  'deu': 'de',
  'fra': 'fr',
  'hin': 'hi',
  'jpn': 'ja',
  'kor': 'ko',
  'swe': 'sv',
  'vie': 'vi',
};


/**
 * bcp47 mapping table
 */
cwc.utils.I18nMapping.BCP47 = {
  'de': 'deu',
  'de-DE': 'deu',
  'fr-FR': 'fra',
  'fr': 'fra',
  'en': 'eng',
  'en-US': 'eng',
  'ja': 'jpn',
  'ja-JP': 'jpn',
  'sv': 'swe',
  'sv-SE': 'swe',
  'vi': 'vie',
  'vi-VN': 'vie',
};
