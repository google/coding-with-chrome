/**
 * @fileoverview BUILD configuration for Coding with Chrome locales files.
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
let closureBuilder = require('closure-builder');
let glob = closureBuilder.globSupport();


/**
 * Blacklist.
 */
closureBuilder.build({
  name: 'Locales.blacklist',
  srcs: glob([
    'locales/blacklist.js',
  ]),
  externs: [
    'build/externs/locales.js',
  ],
  compress: true,
  out: 'genfiles/core/js/locales/blacklist.js',
});


/**
 * DE Translation.
 */
closureBuilder.build({
  name: 'Locales.de',
  srcs: glob([
    'locales/de/translation.js',
  ]),
  externs: [
    'build/externs/locales.js',
  ],
  compress: true,
  out: 'genfiles/core/js/locales/de.js',
});


/**
 * EN Translation.
 */
closureBuilder.build({
  name: 'Locales.en',
  srcs: glob([
    'locales/en/translation.js',
  ]),
  externs: [
    'build/externs/locales.js',
  ],
  compress: true,
  out: 'genfiles/core/js/locales/en.js',
});


/**
 * JA Translation.
 */
closureBuilder.build({
  name: 'Locales.ja',
  srcs: glob([
    'locales/ja/translation.js',
  ]),
  externs: [
    'build/externs/locales.js',
  ],
  compress: true,
  out: 'genfiles/core/js/locales/ja.js',
});


/**
 * KO Translation.
 */
closureBuilder.build({
  name: 'Locales.ko',
  srcs: glob([
    'locales/ko/translation.js',
  ]),
  externs: [
    'build/externs/locales.js',
  ],
  compress: true,
  out: 'genfiles/core/js/locales/ko.js',
});
