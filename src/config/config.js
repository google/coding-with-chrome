/**
 * @fileoverview General config for Coding in Chrome.
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

goog.provide('cwc.config');
goog.provide('cwc.config.Debug');
goog.provide('cwc.config.Number');
goog.provide('cwc.config.Prefix');
goog.provide('cwc.config.Sample');
goog.provide('cwc.config.Settings');
goog.provide('cwc.config.framework');
goog.provide('cwc.config.id');
goog.provide('cwc.config.interpreter');
goog.provide('cwc.config.sound');

goog.require('cwc.utils.LogLevel');


/**
 * Default log level.
 * @type {cwc.utils.LogLevel}
 */
cwc.config.LogLevel = cwc.utils.LogLevel.INFO;


/**
 * True if the Google Youth IO UI should be enabled.
 * @enum {boolean}
 */
cwc.config.Settings = {
  YOUTH_IO_UI: false
};


/**
 * General prefix.
 * @enum {!Object.<string>|boolean}
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
  TOUR: false
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
  CIRCULAR_ARCS: .5522847498
};


/**
 * Fullscreen ID.
 * @const {string}
 */
cwc.config.id.FULLSCREEN = 'mb';


/**
 * General prefix.
 * @enum {!Object.<string>|string}
 */
cwc.config.Prefix = {
  CANVAS: 'canvas-',
  CSS: 'cwc_',
  EDITOR: 'editor-',
  PLAYGROUND: 'env-',
  FRAMEWORK: 'cwc.fn',
  GENERAL: 'cwc-'
};


/**
 * List of common samples.
 * @enum {string}
 */
cwc.config.Sample = {
  TEXT_PLACEHOLDER: 'Lorem ipsum non in vita reverti. Et facti sunt dies ut ' +
      'expertus. Experientiarum fecisti. Quod est tibi. In ' +
      'casu, cursus ut,'
};


/**
 * Framework Marker.
 * @const {string}
 */
cwc.config.framework.MARKER = '"use simple";';


/**
 * Supported commands Flags for the Interpreter.
 * @enum {!Object.<string>}
 */
cwc.config.interpreter.Flag = {
  LOAD: {
    ONLOAD: 'onLoad',  // Load on "window.onload"
    ONDOMREADY: 'onDomReady',  // Load on "document.DOMContentLoaded"
    INHEAD: 'inHead',  // Place script inside <head>…</head>
    INBODY: 'inBody'  // Place script inside <body>…</body>
  }
};


/**
 * Supported music notes for EV3 mode.
 * @enum {!Object.<number>|number}
 */
cwc.config.sound = {
  BPM: 120,
  NOTE: {
    'C0' : {'f' : 16.35},
    'C#0/Db0' : {'f' : 17.32},
    'D0' : {'f' : 18.35},
    'D#0/Eb0' : {'f' : 19.45},
    'E0' : {'f' : 20.6},
    'F0' : {'f' : 21.83},
    'F#0/Gb0' : {'f' : 23.12},
    'G0' : {'f' : 24.5},
    'G#0/Ab0' : {'f' : 25.96},
    'A0' : {'f' : 27.5},
    'A#0/Bb0' : {'f' : 29.14},
    'B0' : {'f' : 30.87},
    'C1' : {'f' : 32.7},
    'C#1/Db1' : {'f' : 34.65},
    'D1' : {'f' : 36.71},
    'D#1/Eb1' : {'f' : 38.89},
    'E1' : {'f' : 41.2},
    'F1' : {'f' : 43.65},
    'F#1/Gb1' : {'f' : 46.25},
    'G1' : {'f' : 49},
    'G#1/Ab1' : {'f' : 51.91},
    'A1' : {'f' : 55},
    'A#1/Bb1' : {'f' : 58.27},
    'B1' : {'f' : 61.74},
    'C2' : {'f' : 65.41},
    'C#2/Db2' : {'f' : 69.3},
    'D2' : {'f' : 73.42},
    'D#2/Eb2' : {'f' : 77.78},
    'E2' : {'f' : 82.41},
    'F2' : {'f' : 87.31},
    'F#2/Gb2' : {'f' : 92.5},
    'G2' : {'f' : 98},
    'G#2/Ab2' : {'f' : 103.83},
    'A2' : {'f' : 110},
    'A#2/Bb2' : {'f' : 116.54},
    'B2' : {'f' : 123.47},
    'C3' : {'f' : 130.81},
    'C#3/Db3' : {'f' : 138.59},
    'D3' : {'f' : 146.83},
    'D#3/Eb3' : {'f' : 155.56},
    'E3' : {'f' : 164.81},
    'F3' : {'f' : 174.61},
    'F#3/Gb3' : {'f' : 185},
    'G3' : {'f' : 196},
    'G#3/Ab3' : {'f' : 207.65},
    'A3' : {'f' : 220},
    'A#3/Bb3' : {'f' : 233.08},
    'B3' : {'f' : 246.94},
    'C4' : {'f' : 261.63},
    'C#4/Db4' : {'f' : 277.18},
    'D4' : {'f' : 293.66},
    'D#4/Eb4' : {'f' : 311.13},
    'E4' : {'f' : 329.63},
    'F4' : {'f' : 349.23},
    'F#4/Gb4' : {'f' : 369.99},
    'G4' : {'f' : 392},
    'G#4/Ab4' : {'f' : 415.3},
    'A4' : {'f' : 440},
    'A#4/Bb4' : {'f' : 466.16},
    'B4' : {'f' : 493.88},
    'C5' : {'f' : 523.25},
    'C#5/Db5' : {'f' : 554.37},
    'D5' : {'f' : 587.33},
    'D#5/Eb5' : {'f' : 622.25},
    'E5' : {'f' : 659.25},
    'F5' : {'f' : 698.46},
    'F#5/Gb5' : {'f' : 739.99},
    'G5' : {'f' : 783.99},
    'G#5/Ab5' : {'f' : 830.61},
    'A5' : {'f' : 880},
    'A#5/Bb5' : {'f' : 932.33},
    'B5' : {'f' : 987.77},
    'C6' : {'f' : 1046.5},
    'C#6/Db6' : {'f' : 1108.73},
    'D6' : {'f' : 1174.66},
    'D#6/Eb6' : {'f' : 1244.51},
    'E6' : {'f' : 1318.51},
    'F6' : {'f' : 1396.91},
    'F#6/Gb6' : {'f' : 1479.98},
    'G6' : {'f' : 1567.98},
    'G#6/Ab6' : {'f' : 1661.22},
    'A6' : {'f' : 1760},
    'A#6/Bb6' : {'f' : 1864.66},
    'B6' : {'f' : 1975.53},
    'C7' : {'f' : 2093},
    'C#7/Db7' : {'f' : 2217.46},
    'D7' : {'f' : 2349.32},
    'D#7/Eb7' : {'f' : 2489.02},
    'E7' : {'f' : 2637.02},
    'F7' : {'f' : 2793.83},
    'F#7/Gb7' : {'f' : 2959.96},
    'G7' : {'f' : 3135.96},
    'G#7/Ab7' : {'f' : 3322.44},
    'A7' : {'f' : 3520},
    'A#7/Bb7' : {'f' : 3729.31},
    'B7' : {'f' : 3951.07},
    'C8' : {'f' : 4186.01},
    'C#8/Db8' : {'f' : 4434.92},
    'D8' : {'f' : 4698.63},
    'D#8/Eb8' : {'f' : 4978.03},
    'E8' : {'f' : 5274.04},
    'F8' : {'f' : 5587.65},
    'F#8/Gb8' : {'f' : 5919.91},
    'G8' : {'f' : 6271.93},
    'G#8/Ab8' : {'f' : 6644.88},
    'A8' : {'f' : 7040},
    'A#8/Bb8' : {'f' : 7458.62},
    'B8' : {'f' : 7902.13}
  },
  DURATION: {
    '1/1' : {'d' : 240},
    '1/2' : {'d' : 120},
    '1/4' : {'d' : 60},
    '1/8' : {'d' : 30},
    '1/16' : {'d' : 15},
    '1/1 dotted' : {'d' : 360},
    '1/2 dotted' : {'d' : 180},
    '1/4 dotted' : {'d' : 90},
    '1/8 dotted' : {'d' : 45},
    '1/16 dotted' : {'d' : 22.5},
    '1/4 triplet' : {'d' : 40},
    '1/8 triplet' : {'d' : 20},
    '1/16 triplet' : {'d' : 10}
  }
};
