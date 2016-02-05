/**
 * @fileoverview BUILD configuration for remote files.
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
  name: 'Coffeescript file',
  resources: [
    'http://coffeescript.org/extras/coffee-script.js'
  ],
  out: 'genfiles/external/coffeescript/'
});


closureBuilder.build({
  name: 'Coffeelint file',
  resources: [
    'http://www.coffeelint.org/js/coffeelint.js'
  ],
  out: 'genfiles/external/coffeelint/'
});


closureBuilder.build({
  name: 'Material design icons',
  resources: [
    'https://raw.github.com/google/material-design-icons/master/iconfont/' +
    'MaterialIcons-Regular.woff2'
  ],
  out: 'genfiles/fonts/'
});


closureBuilder.build({
  name: 'Open Fonts',
  resources: [
    'https://raw.github.com/google/fonts/master/apache/opensans/' +
    'OpenSans-Regular.ttf',
    'https://raw.github.com/google/fonts/master/apache/roboto/' +
    'Roboto-Regular.ttf'
  ],
  out: 'genfiles/fonts/'
});
