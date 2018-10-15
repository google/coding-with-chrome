/**
 * @fileoverview General config for Coding in Chrome.
 *
 * @license Copyright 2015 The Coding with Chrome Authors.
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
goog.provide('cwc.config');
goog.provide('cwc.config.Debug');
goog.provide('cwc.config.Default');
goog.provide('cwc.config.Experimental');
goog.provide('cwc.config.Logging');
goog.provide('cwc.config.Number');
goog.provide('cwc.config.Prefix');
goog.provide('cwc.config.Sample');
goog.provide('cwc.config.Version');

goog.require('cwc.utils.LogLevel');


/**
 * Debug modes.
 * @enum {boolean}
 * @export
 */
cwc.config.Debug = {
  ENABLED: false,
  EXPORT: false,
  PROPERTIES: false,
  EXAMPLES: false,
  SETTINGS: false,
  ARDUINO: false,
  RESOURCES: false,
  GALLERY: false,
  SPHERO: false,
  MBOT: false,
  TOUR: false,
};


/**
 * Default values.
 * @enum {string}
 */
cwc.config.Default = {
  LANGUAGE: 'eng',
};


/**
 * Debug modes.
 * @enum {boolean}
 */
cwc.config.Experimental = {
  ENABLED: false,
};


/**
 * Debug modes.
 * @enum {boolean|number}
 * @export
 */
cwc.config.Logging = {
  LEVEL: cwc.utils.LogLevel.INFO,
};


/**
 * Magic numbers for calculations.
 * @enum {number}
 */
cwc.config.Number = {
  /**
   * Magic Number for approximating a Circular Arc With a Cubic Bezier Path.
   * (see http://en.wikipedia.org/wiki/B%C3%A9zier_spline)
   */
  CIRCULAR_ARCS: .5522847498,
};


/**
 * General prefix.
 * @enum {string}
 */
cwc.config.Prefix = {
  CANVAS: 'canvas-',
  CSS: 'cwc_',
  EDITOR: 'editor-',
  PLAYGROUND: 'env-',
  FRAMEWORK: 'cwc.fn',
  GENERAL: 'cwc-',
};


/**
 * List of common samples.
 * @enum {string}
 */
cwc.config.Sample = {
  TEXT_PLACEHOLDER: 'Lorem ipsum non in vita reverti. Et facti sunt dies ut ' +
      'expertus. Experientiarum fecisti. Quod est tibi. In ' +
      'casu, cursus ut,',
};


/**
 * @return {string}
 */
cwc.config.Version = '5.10.16';
