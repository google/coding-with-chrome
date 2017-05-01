/**
 * @fileoverview BUILD configuration for internal framework files.
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
let glob = closureBuilder.globSupport();


/**
 * Arduino Framework
 */
closureBuilder.build({
  name: 'cwc.framework.Arduino',
  compress: true,
  srcs: glob([
    'src/frameworks/internal/arduino/*.js',
  ]),
  deps: [
    'src/frameworks/internal/runner/runner.js',
    'src/utils/logger.js',
    'src/utils/stack_queue.js',
  ],
  out: 'genfiles/frameworks/internal/arduino_framework.js',
});


/**
 * EV3 Framework
 */
closureBuilder.build({
  name: 'cwc.framework.Ev3',
  compress: true,
  srcs: glob([
    'src/frameworks/internal/ev3/*.js',
  ]),
  deps: glob([
    'src/frameworks/internal/runner/runner.js',
    'src/protocol/robots/ev3/*.js',
    'src/utils/stack_queue.js',
  ]),
  out: 'genfiles/frameworks/internal/ev3_framework.js',
});


/**
 * Python Framework
 */
closureBuilder.build({
  name: 'cwc.framework.Python',
  compress: true,
  srcs: glob([
    'src/frameworks/internal/python/*.js',
  ]),
  deps: glob([
    'src/utils/dialog/*',
  ]),
  externs: [
    'build/externs/skulpt.js',
  ],
  out: 'genfiles/frameworks/internal/python_framework.js',
});


/**
 * mBot Framework
 */
closureBuilder.build({
  name: 'cwc.framework.makeblock.mBot',
  compress: true,
  srcs: glob([
    'src/frameworks/internal/makeblock/mbot/*.js',
  ]),
  deps: glob([
    'src/frameworks/internal/runner/runner.js',
    'src/utils/stack_queue.js',
  ]),
  out: 'genfiles/frameworks/internal/mbot_framework.js',
});


/**
 * mBot Ranger Framework
 */
closureBuilder.build({
  name: 'cwc.framework.makeblock.mBotRanger',
  compress: true,
  srcs: glob([
    'src/frameworks/internal/makeblock/mbot_ranger/*.js',
  ]),
  deps: glob([
    'src/frameworks/internal/runner/runner.js',
    'src/utils/stack_queue.js',
  ]),
  out: 'genfiles/frameworks/internal/mbot_ranger_framework.js',
});


/**
 * Phaser Framework
 */
closureBuilder.build({
  name: 'cwc.framework.Phaser',
  compress: true,
  srcs: glob([
    'src/frameworks/internal/phaser/*.js',
  ]),
  externs: [
    'build/externs/phaser.js',
  ],
  out: 'genfiles/frameworks/internal/phaser_framework.js',
});


/**
 * Raspberry Pi Framework
 */
closureBuilder.build({
  name: 'cwc.framework.RaspberryPi',
  compress: true,
  srcs: glob([
    'src/frameworks/internal/raspberry_pi/*.js',
  ]),
  deps: [
    'src/frameworks/internal/runner/runner.js',
    'src/utils/stack_queue.js',
  ],
  out: 'genfiles/frameworks/internal/raspberry_pi_framework.js',
});


/**
 * Runner Framework
 */
closureBuilder.build({
  name: 'cwc.framework.Runner',
  compress: true,
  srcs: glob([
    'src/frameworks/internal/runner/*.js',
  ]),
  deps: [
    'src/utils/stack_queue.js',
  ],
  out: 'genfiles/frameworks/internal/runner_framework.js',
});


/**
 * Simple Framework
 */
closureBuilder.build({
  name: 'cwc.framework.simple.Loader',
  compress: true,
  srcs: glob([
    'src/frameworks/internal/simple/*.js',
  ]),
  deps: glob([
    'src/config/config.js',
    'src/frameworks/internal/runner/runner.js',
    'src/utils/logger.js',
    'src/utils/dialog/*',
  ]),
  out: 'genfiles/frameworks/internal/simple_framework.js',
});


/**
 * Sphero Framework
 */
closureBuilder.build({
  name: 'cwc.framework.Sphero',
  compress: true,
  srcs: glob([
    'src/frameworks/internal/sphero/*.js',
  ]),
  deps: [
    'src/frameworks/internal/runner/runner.js',
    'src/utils/stack_queue.js',
  ],
  out: 'genfiles/frameworks/internal/sphero_framework.js',
});


/**
 * TTS Framework
 */
closureBuilder.build({
  name: 'cwc.framework.TTS',
  compress: true,
  srcs: glob([
    'src/frameworks/internal/tts/*.js',
  ]),
  deps: [
    'src/frameworks/internal/runner/runner.js',
    'src/utils/stack_queue.js',
  ],
  out: 'genfiles/frameworks/internal/tts_framework.js',
});


/**
 * jQuery Turtle Framework
 */
closureBuilder.build({
  name: 'cwc.framework.Turtle',
  compress: true,
  srcs: glob([
    'src/frameworks/internal/turtle/*.js',
  ]),
  deps: glob([
    'src/frameworks/internal/runner/runner.js',
    'src/utils/stack_queue.js',
  ]),
  externs: [
    'build/externs/jquery.js',
  ],
  out: 'genfiles/frameworks/internal/turtle_framework.js',
});
