/**
 * @fileoverview AIY framework for the runner instance. Used to communicate with
 * the AIY WebSocket server.
 *
 * @license Copyright 2018 The Coding with Chrome Authors.
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
 * @author fstanis@google.com (Filip Stanis)
 */
goog.provide('cwc.framework.AIY');

goog.require('cwc.framework.Runner');


/**
 * @constructor
 * @param {!cwc.framework.Runner} runner
 * @struct
 * @final
 */
cwc.framework.AIY = function(runner) {
  /** @type {string} */
  this.name = 'AIY Framework';

  /** @type {!cwc.framework.Runner} */
  this.runner = runner;

  if (this.runner) {
    this.init();
  } else {
    console.error('Was unable to get runner:', runner);
  }
};


/**
 * Initial AIY framework.
 */
cwc.framework.AIY.prototype.init = function() {
};


/**
 * Adds the AIY framework to the runner listener.
 * @param {Function} callback
 * @export
 */
cwc.framework.AIY.prototype.listen = function(callback) {
  console.log(callback);
};
