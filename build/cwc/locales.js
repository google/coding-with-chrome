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
 * Blacklisted words.
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
  options: {
    closure: {
      rewrite_polyfills: false,
    },
  },
  out: 'genfiles/core/js/locales/blacklist.js',
});


/**
 * Supported languages.
 */
closureBuilder.build({
  name: 'Locales.supportedLanguages',
  srcs: glob([
    'locales/supported.js',
  ]),
  externs: [
    'build/externs/locales.js',
  ],
  compress: true,
  options: {
    closure: {
      rewrite_polyfills: false,
    },
  },
  out: 'genfiles/core/js/locales/supported.js',
});


/**
 * DEU Translation.
 */
closureBuilder.build({
  name: 'Locales.deu',
  srcs: glob([
    'locales/_deu.js',
    'locales/deu/**/*.js',
  ]),
  externs: [
    'build/externs/locales.js',
  ],
  compress: true,
  options: {
    closure: {
      rewrite_polyfills: false,
    },
  },
  out: 'genfiles/core/js/locales/deu.js',
});


/**
 * ENG Translation.
 */
closureBuilder.build({
  name: 'Locales.eng',
  srcs: glob([
    'locales/_eng.js',
    'locales/eng/**/*.js',
  ]),
  externs: [
    'build/externs/locales.js',
  ],
  compress: true,
  options: {
    closure: {
      rewrite_polyfills: false,
    },
  },
  out: 'genfiles/core/js/locales/eng.js',
});


/**
 * JPN Translation.
 */
closureBuilder.build({
  name: 'Locales.jpn',
  srcs: glob([
    'locales/jpn/translation.js',
  ]),
  externs: [
    'build/externs/locales.js',
  ],
  compress: true,
  options: {
    closure: {
      rewrite_polyfills: false,
    },
  },
  out: 'genfiles/core/js/locales/jpn.js',
});


/**
 * KOR Translation.
 */
closureBuilder.build({
  name: 'Locales.kor',
  srcs: glob([
    'locales/kor/translation.js',
  ]),
  externs: [
    'build/externs/locales.js',
  ],
  compress: true,
  options: {
    closure: {
      rewrite_polyfills: false,
    },
  },
  out: 'genfiles/core/js/locales/kor.js',
});


/**
 * HIN Translation.
 */
closureBuilder.build({
  name: 'Locales.hin',
  srcs: glob([
    'locales/hin/translation.js',
  ]),
  externs: [
    'build/externs/locales.js',
  ],
  compress: true,
  options: {
    closure: {
      rewrite_polyfills: false,
    },
  },
  out: 'genfiles/core/js/locales/hin.js',
});

/**
 * FRA Translation.
 */
closureBuilder.build({
  name: 'Locales.fra',
  srcs: glob([
    'locales/_fra.js',
    'locales/fra/**/*.js',
  ]),
  externs: [
    'build/externs/locales.js',
  ],
  compress: true,
  options: {
    closure: {
      rewrite_polyfills: false,
    },
  },
  out: 'genfiles/core/js/locales/fra.js',
});
