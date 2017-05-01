/**
 * @fileoverview General frameworks files.
 * This Arduino framework will be used by the runner instance, inside the
 * webview sandbox, to access the Arduino over the runner instance and
 * the serial interface.
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
goog.provide('cwc.framework.External');
goog.provide('cwc.framework.Internal');


/**
 * External frameworks for the preview window or runner framework.
 * @enum {!Object.<string>|string}
 */
cwc.framework.External = {
  COFFEESCRIPT: 'coffee-script.js',
  JQUERY: {
    V3_X: 'jquery.min.js',
    V2_2_4: 'jquery-2.2.4.min.js',
  },
  JQUERY_TURTLE: 'jquery-turtle.js',
  PHASER: 'phaser.min.js',
  SKULPT: {
    CORE: 'skulpt.min.js',
    STDLIB: 'skulpt-stdlib.js',
  },
  THREE_JS: {
    CORE: 'three.min.js',
  },
};


/**
 * Internal frameworks for the preview window or runner framework.
 * @enum {!Object.<string>|string}
 */
cwc.framework.Internal = {
  ARDUINO: 'arduino_framework.js',
  EV3: 'ev3_framework.js',
  MBOT: 'mbot_framework.js',
  MBOT_RANGER: 'mbot_ranger_framework.js',
  PHASER: 'phaser_framework.js',
  PYTHON: 'python_framework.js',
  RASPBERRY_PI: 'raspberry_pi_framework.js',
  RUNNER: 'runner_framework.js',
  SIMPLE: 'simple_framework.js',
  SPHERO: 'sphero_framework.js',
  TURTLE: 'turtle_framework.js',
};
