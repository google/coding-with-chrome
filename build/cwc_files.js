/**
 * @fileoverview BUILD configuration for Coding with Chrome.
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
  name: 'cwc.framework.Arduino',
  srcs: [
    glob('src/frameworks/**/*.js')
  ],
  out: 'genfiles/frameworks/arduino_framework.js'
});


closureBuilder.build({
  name: 'cwc.framework.Ev3',
  srcs: [
    glob('src/frameworks/**/*.js')
  ],
  deps: [
    glob('src/**/*.js')
  ],
  out: 'genfiles/frameworks/ev3_framework.js'
});


closureBuilder.build({
  name: 'cwc.framework.Sphero',
  srcs: [
    glob('src/frameworks/**/*.js')
  ],
  deps: [
    glob('src/**/*.js')
  ],
  out: 'genfiles/frameworks/sphero_framework.js'
});


closureBuilder.build({
  name: 'cwc.framework.TTS',
  srcs: [
    glob('src/frameworks/**/*.js')
  ],
  deps: [
    glob('src/**/*.js')
  ],
  out: 'genfiles/frameworks/tts_framework.js'
});


closureBuilder.build({
  name: 'cwc.framework.Runner',
  srcs: [
    glob('src/frameworks/**/*.js')
  ],
  out: 'genfiles/frameworks/runner_framework.js'
});


closureBuilder.build({
  name: 'cwc.framework.simple.Loader',
  srcs: [
    glob('src/frameworks/**/*.js')
  ],
  deps: [
    glob('src/**/*.js')
  ],
  out: 'genfiles/frameworks/simple_framework.js'
});


closureBuilder.build({
  name: 'cwc.ui.Builder',
  srcs: [
    glob('src/**/*')
  ],
  deps: [
    glob('node_modules/blockly/**/*.js')
  ],
  out: 'genfiles/js/cwc_ui.js'
});
