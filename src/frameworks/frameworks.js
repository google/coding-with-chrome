/**
 * @fileoverview General frameworks files.
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
goog.provide('cwc.framework.StyleSheet');


/**
 * External frameworks used for the preview.
 * @enum {!Object.<string>|string}
 */
cwc.framework.External = {
  BRYTHON: {
    CORE: '/frameworks/external/brython.js',
    STDLIB: '/frameworks/external/brython_stdlib.js',
  },
  COFFEESCRIPT: '/frameworks/external/coffee-script.js',
  JQUERY: {
    V3_X: '/frameworks/external/jquery.min.js',
    V2_2_4: '/frameworks/external/jquery-2.2.4.min.js',
  },
  JQUERY_TURTLE: '/frameworks/external/jquery-turtle.js',
  PHASER: '/frameworks/external/phaser.min.js',
  SKULPT: {
    CORE: '/frameworks/external/skulpt.min.js',
    STDLIB: '/frameworks/external/skulpt-stdlib.js',
  },
  THREE_JS: {
    CORE: '/frameworks/external/three.min.js',
  },
};


/**
 * Internal frameworks used for the preview.
 * @enum {!Object.<string>|string}
 */
cwc.framework.Internal = {
  EV3: '/frameworks/internal/ev3_framework.js',
  MBOT: '/frameworks/internal/mbot_framework.js',
  MBOT_RANGER: '/frameworks/internal/mbot_ranger_framework.js',
  MESSENGER: '/frameworks/internal/messenger_framework.js',
  PHASER: '/frameworks/internal/phaser_framework.js',
  PYTHON2: '/frameworks/internal/python2_framework.js',
  PYTHON3: '/frameworks/internal/python3_framework.js',
  RASPBERRY_PI: '/frameworks/internal/raspberry_pi_framework.js',
  SIMPLE: '/frameworks/internal/simple_framework.js',
  SPHERO: '/frameworks/internal/sphero_framework.js',
  TURTLE: '/frameworks/internal/turtle_framework.js',
};


/**
 * Style Sheet files for the preview window.
 * @enum {!Object.<string>|string}
 */
cwc.framework.StyleSheet = {
  DIALOG: '/css/dialog.css',
  RUNNER: '/css/runner.css',
};
