/**
 * @fileoverview BUILD usage.
 *
 * @license Copyright 2017 The Coding with Chrome Authors.
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
const commandLineUsage = require('command-line-usage');

const sections = [{
    header: 'Coding with Chrome',
    content: 'An Educational Development Environment.',
  }, {
    header: 'Synopsis',
    content: '$ npm run <command>',
  }, {
    header: 'Basic commands',
    content: [{
        name: 'usage',
        summary: 'Display this usage.',
    }, {
        name: 'chrome-app',
        summary: 'Compiles and started the Chrome app version.',
    }, {
        name: 'nw-app',
        summary: 'Compiles and started the binary version.',
    }, {
        name: 'web-app',
        summary: 'Compiles and started the web app version.',
    }],
  }, {
    header: 'Debug commands',
    content: [{
        name: 'chrome-app-debug',
        summary: 'Compiles and started the Chrome app.',
    }, {
        name: 'nw-app-debug',
        summary: 'Compiles and started the binary version.',
    }, {
        name: 'web-app-debug',
        summary: 'Compiles and started the web app version.',
    }],
  }, {
    header: 'Developer commands',
    content: [{
        name: 'sync',
        summary: 'Updates source code and dependencies.',
    }, {
        name: 'clean',
        summary: 'Cleans all cached / pre-builded files.',
    }, {
        name: 'lint',
        summary: 'Performs lint check.',
    }, {
        name: 'test',
        summary: 'Performs automated tests.',
    }],
  }, {
    header: 'Deploy commands (binary)',
    content: [{
        name: 'publish-nw_app',
        summary: 'Builds all binary versions of the app.',
    }, {
        name: 'publish-nw_app-win',
        summary: 'Builds Windows (32bit/64bit) binary version of the app.',
    }, {
        name: 'publish-nw_app-mac',
        summary: 'Builds Mac (64bit) binary version of the app.',
    }, {
        name: 'publish-nw_app-linux',
        summary: 'Builds Linux (32bit/64bit) binary version of the app.',
    }],
  }, {
    header: 'Test commands',
    content: [{
        name: 'test',
        summary: 'Perform all tests.',
    }, {
        name: 'test-soy',
        summary: 'Test all soy files for compilation errors.',
    }, {
        name: 'test:units',
        summary: 'Perform general unit tests.',
    }, {
        name: 'test-core',
        summary: 'Perform core tests tests.',
    }, {
        name: 'test-mode',
        summary: 'Perform mode tests.',
    }],
  },
];

const usage = commandLineUsage(sections);
console.log(usage);
