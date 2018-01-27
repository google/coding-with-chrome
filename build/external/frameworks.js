/**
 * @fileoverview BUILD configuration external framework files.
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
let closureBuilder = require('closure-builder');


/**
 * Coffeescript
 */
closureBuilder.build({
  name: 'Coffeescript',
  resources: [
    'third_party/coffeescript/extras/coffee-script.js',
  ],
  out: 'genfiles/third_party/frameworks/external/',
});

closureBuilder.build({
  name: 'Coffeescript file',
  resources: [
    'third_party/coffeescript/extras/coffee-script.js',
  ],
  out: 'genfiles/third_party/external/coffeescript/',
});


/**
 * three.js
 */
closureBuilder.build({
  name: 'three.js',
  resources: [
    'third_party/three.js/build/three.min.js',
  ],
  out: 'genfiles/third_party/frameworks/external/three.min.js',
});


/**
 * jQuery 3.x
 */
closureBuilder.build({
  name: 'jQuery 3.x',
  resources: [
    'third_party/jquery-dist/dist/jquery.min.js',
  ],
  out: 'genfiles/third_party/frameworks/external/',
});


/**
 * jQuery 2.2.4
 */
closureBuilder.build({
  name: 'jQuery 2.2.4',
  resources: [
    'third_party/jquery-dist-2.2.4/dist/jquery.min.js',
  ],
  out: 'genfiles/third_party/frameworks/external/jquery-2.2.4.min.js',
});


/**
 * jQuery Turtle
 */
closureBuilder.build({
  name: 'jQuery Turtle file',
  resources: [
    'third_party/jquery-turtle/jquery-turtle.min.js',
  ],
  out: 'genfiles/third_party/frameworks/external/jquery-turtle.js',
});


/**
 * Phaser CE
 */
closureBuilder.build({
  name: 'phaser.js',
  resources: [
    'third_party/phaser-ce/build/phaser.min.js',
  ],
  out: 'genfiles/third_party/frameworks/external/phaser.min.js',
});


/**
 * Brython Core
 */
closureBuilder.build({
  name: 'Brython Core',
  resources: [
    'third_party/brython/www/src/brython.js',
  ],
  out: 'genfiles/third_party/frameworks/external/brython.js',
});


/**
 * Brython Std lib
 */
closureBuilder.build({
  name: 'Brython Std lib',
  resources: [
    'third_party/brython/www/src/brython_stdlib.js',
  ],
  out: 'genfiles/third_party/frameworks/external/brython_stdlib.js',
});


/**
 * Skulpt Core
 */
closureBuilder.build({
  name: 'Skulpt Core',
  resources: [
    'third_party/skulpt-dist/skulpt.min.js',
  ],
  out: 'genfiles/third_party/frameworks/external/skulpt.min.js',
});


/**
 * Skulpt Std lib
 */
closureBuilder.build({
  name: 'Skulpt Std lib',
  resources: [
    'third_party/skulpt-dist/skulpt-stdlib.js',
  ],
  out: 'genfiles/third_party/frameworks/external/skulpt-stdlib.js',
});
