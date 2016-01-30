/**
 * @fileoverview BUILD configuration for static files.
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
var glob = closureBuilder.globSupport();


closureBuilder.build({
  name: 'Static files',
  resources: [
    'app/_locales/',
    'app/css/',
    'app/fonts/',
    'app/html/',
    'app/icons/',
    'app/images/',
    'app/js/',
    'app/manifest.json'
  ],
  out: 'genfiles/'
});


closureBuilder.build({
  name: 'Resource files',
  resources: [
    'resources/'
  ],
  out: 'genfiles/'
});


closureBuilder.build({
  name: '3rd party Images',
  resources: glob([
    'third_party/**/*.png'
  ]),
  out: 'genfiles/images/'
});
