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


closureBuilder.build({
  name: 'Coffeescript',
  resources: [
    'https://raw.githubusercontent.com/jashkenas/coffeescript/master/extras/' +
    'coffee-script.js'
  ],
  out: 'genfiles/frameworks/external/'
});


closureBuilder.build({
  name: 'jQuery file',
  resources: [
    'node_modules/jquery/dist/jquery.min.js'
  ],
  out: 'genfiles/frameworks/external/'
});


closureBuilder.build({
  name: 'jQuery Turtle file',
  srcs: [
    'node_modules/jquery-turtle/dist/jquery-turtle.js'
  ],
  externs: [
    'build/externs/coffeescript.js',
    'build/externs/global.js',
    'build/externs/jquery-turtle.js',
    'build/externs/jquery.js'
  ],
  out: 'genfiles/frameworks/external/jquery-turtle.js'
});
