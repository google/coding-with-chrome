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
 * Lego EV3 Framework
 */
closureBuilder.build({
  name: 'cwc.framework.lego.Ev3',
  compress: true,
  srcs: glob([
    'src/frameworks/lego/ev3/*.js',
  ]),
  deps: glob([
    'src/frameworks/messenger/*.js',
    'src/protocol/robots/lego/ev3/*.js',
    'third_party/coding-with-chrome-libraries/src/utils/stack/stack.js',
  ]),
  out: 'genfiles/core/frameworks/internal/ev3_framework.js',
});


/**
 * Lego WeDo 2.0 Framework
 */
closureBuilder.build({
  name: 'cwc.framework.lego.WeDo2',
  compress: true,
  srcs: glob([
    'src/frameworks/lego/wedo2/*.js',
  ]),
  deps: glob([
    'src/frameworks/messenger/*.js',
    'src/protocol/robots/lego/wedo2/*.js',
    'third_party/coding-with-chrome-libraries/src/utils/stack/stack.js',
  ]),
  out: 'genfiles/core/frameworks/internal/wedo2_framework.js',
});


/**
 * mBot Framework
 */
closureBuilder.build({
  name: 'cwc.framework.makeblock.mBot',
  compress: true,
  srcs: glob([
    'src/frameworks/makeblock/mbot/*.js',
  ]),
  deps: glob([
    'src/frameworks/messenger/*.js',
    'third_party/coding-with-chrome-libraries/src/utils/stack/stack.js',
  ]),
  out: 'genfiles/core/frameworks/internal/mbot_framework.js',
});


/**
 * mBot Ranger Framework
 */
closureBuilder.build({
  name: 'cwc.framework.makeblock.mBotRanger',
  compress: true,
  srcs: glob([
    'src/frameworks/makeblock/mbot_ranger/*.js',
  ]),
  deps: glob([
    'src/frameworks/messenger/*.js',
    'third_party/coding-with-chrome-libraries/src/utils/stack/stack.js',
  ]),
  out: 'genfiles/core/frameworks/internal/mbot_ranger_framework.js',
});


/**
 * JavaScript Framework
 */
closureBuilder.build({
  name: 'cwc.framework.JavaScript',
  compress: true,
  srcs: glob([
    'src/frameworks/javascript/*.js',
  ]),
  deps: glob([
    'src/frameworks/messenger/*.js',
    'third_party/coding-with-chrome-libraries/src/utils/stack/stack.js',
  ]),
  out: 'genfiles/core/frameworks/internal/javascript_framework.js',
});


/**
 * Messenger Framework
 */
closureBuilder.build({
  name: 'cwc.framework.Messenger',
  compress: true,
  srcs: glob([
    'src/frameworks/messenger/*.js',
  ]),
  deps: glob([
    'third_party/coding-with-chrome-libraries/src/utils/stack/stack.js',
  ]),
  externs: [],
  out: 'genfiles/core/frameworks/internal/messenger_framework.js',
});


/**
 * Phaser Framework
 */
closureBuilder.build({
  name: 'cwc.framework.Phaser',
  compress: true,
  srcs: glob([
    'src/frameworks/phaser/*.js',
  ]),
  deps: glob([
    'src/frameworks/messenger/*.js',
    'third_party/coding-with-chrome-libraries/src/utils/stack/stack.js',
  ]),
  externs: [
    'build/externs/phaser.js',
  ],
  out: 'genfiles/core/frameworks/internal/phaser_framework.js',
});


/**
 * Python 2.x Framework
 */
closureBuilder.build({
  name: 'cwc.framework.Python2',
  compress: true,
  srcs: [
    'src/frameworks/python/python2.js',
  ],
  deps: glob([
    'src/utils/dialog/*',
    'src/utils/logger.js',
  ]),
  externs: [
    'build/externs/i18n.js',
    'build/externs/skulpt.js',
  ],
  out: 'genfiles/core/frameworks/internal/python2_framework.js',
});


/**
 * Python 3.x Framework
 */
closureBuilder.build({
  name: 'cwc.framework.Python3',
  compress: true,
  srcs: [
    'src/frameworks/python/python3.js',
  ],
  externs: [
    'build/externs/brython.js',
  ],
  out: 'genfiles/core/frameworks/internal/python3_framework.js',
});


/**
 * Raspberry Pi Framework
 */
closureBuilder.build({
  name: 'cwc.framework.RaspberryPi',
  compress: true,
  srcs: glob([
    'src/frameworks/raspberry_pi/*.js',
  ]),
  deps: glob([
    'src/frameworks/messenger/*.js',
    'third_party/coding-with-chrome-libraries/src/utils/stack/stack.js',
  ]),
  out: 'genfiles/core/frameworks/internal/raspberry_pi_framework.js',
});


/**
 * Simple Framework
 */
closureBuilder.build({
  name: 'cwc.framework.simple.Loader',
  compress: true,
  srcs: glob([
    'src/frameworks/simple/*.js',
  ]),
  deps: glob([
    'src/config/config.js',
    'src/utils/dialog/*',
    'src/utils/logger.js',
  ]),
  out: 'genfiles/core/frameworks/internal/simple_framework.js',
});


/**
 * Sphero 2.0 Framework
 */
closureBuilder.build({
  name: 'cwc.framework.sphero.Sphero2',
  compress: true,
  srcs: glob([
    'src/frameworks/sphero/sphero2/*.js',
  ]),
  deps: glob([
    'src/frameworks/messenger/*.js',
    'third_party/coding-with-chrome-libraries/src/utils/stack/stack.js',
  ]),
  out: 'genfiles/core/frameworks/internal/sphero2_framework.js',
});


/**
 * Sphero SPRK+ Framework
 */
closureBuilder.build({
  name: 'cwc.framework.sphero.SprkPlus',
  compress: true,
  srcs: glob([
    'src/frameworks/sphero/sprk_plus/*.js',
  ]),
  deps: glob([
    'src/frameworks/messenger/*.js',
    'third_party/coding-with-chrome-libraries/src/utils/stack/stack.js',
  ]),
  out: 'genfiles/core/frameworks/internal/sprk_plus_framework.js',
});


/**
 * jQuery Turtle Framework
 */
closureBuilder.build({
  name: 'cwc.framework.Turtle',
  compress: true,
  srcs: glob([
    'src/frameworks/turtle/*.js',
  ]),
  deps: [],
  externs: [
    'build/externs/jquery.js',
  ],
  out: 'genfiles/core/frameworks/internal/turtle_framework.js',
});
