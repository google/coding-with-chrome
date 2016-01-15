/**
 * @fileoverview Karma config file.
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



module.exports = function(config) {
  config.set({
    colors: true,
    logLevel: config.LOG_WARN,
    frameworks: ['jasmine', 'closure'],
    files: [
      {pattern: 'node_modules/google-closure-library/closure/goog/base.js'},
      {pattern: 'test/**/*_test.js'},
      {pattern: 'app/js/*.js', included: false},
      {pattern: 'src/**/*.js', included: false},
      {pattern: 'test/genfiles/**/*.js', included: false},
      {pattern: 'node_modules/closure-templates/soyutils_usegoog.js', included: false},
      {pattern: 'node_modules/google-closure-library/closure/goog/**/*.js', included: false},
      {pattern: 'node_modules/google-closure-library/third_party/closure/goog/**/*.js', included: false}
    ],

    singleRun: true,

    preprocessors: {
      'test/**/*_test.js': ['closure', 'closure-iit'],
      'app/js/*.js': ['closure'],
      'src/**/*.js': ['closure'],
      'test/genfiles/**/*.js': ['closure'],
      'node_modules/closure-templates/soyutils_usegoog.js': ['closure'],
      'node_modules/google-closure-library/closure/goog/**/*.js': ['closure'],
      'node_modules/google-closure-library/third_party/closure/goog/**/*.js': ['closure']
    },

    browsers: ['Chrome'],
    autoWatch: false
  });
};
