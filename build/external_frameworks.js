/**
 * @fileoverview BUILD configuration external framework files.
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
var closureBuilder = require('closure-builder');



/**
 * Coffeescript
 */
closureBuilder.build({
  name: 'Coffeescript',
  resources: [
    'third_party/coffeescript/extras/coffee-script.js'
  ],
  out: 'genfiles/frameworks/external/'
});

closureBuilder.build({
  name: 'Coffeescript file',
  resources: [
    'third_party/coffeescript/extras/coffee-script.js'
  ],
  out: 'genfiles/external/coffeescript/'
});


/**
 * jQuery 3.x
 */
closureBuilder.build({
  name: 'jQuery 3.x',
  resources: [
    'third_party/jquery-dist/dist/jquery.min.js'
  ],
  out: 'genfiles/frameworks/external/'
});


/**
 * jQuery 2.2.4
 */
closureBuilder.build({
  name: 'jQuery 2.2.4',
  resources: [
    'third_party/jquery-dist-2.2.4/dist/jquery.min.js'
  ],
  out: 'genfiles/frameworks/external/jquery-2.2.4.min.js'
});


/**
 * jQuery Turtle
 */
closureBuilder.build({
  name: 'jQuery Turtle file',
  srcs: [
    'third_party/jquery-turtle/jquery-turtle.js'
  ],
  externs: [
    'build/externs/coffeescript.js',
    'build/externs/global.js',
    'build/externs/jquery-turtle.js',
    'build/externs/jquery.js'
  ],
  out: 'genfiles/frameworks/external/jquery-turtle.js'
});
