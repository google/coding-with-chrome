/**
 * @fileoverview Internal Server for the Coding with Chrome editor.
 *
 * Preloads all needed modules and shows a loading screen with the progress.
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

goog.provide('cwc.server.Server');

goog.require('cwc.protocol.tcp.HTTPServer');


/**
 * @constructor
 */
cwc.server.Server = function() {
  /** @type {cwc.protocol.tcp.HTTPServer} */
  this.httpServer = new cwc.protocol.tcp.HTTPServer();

  /** @type {!string} */
  this.httpServerPrefix = 'http://localhost:8090';

  /** @type {!string} */
  this.frameworkPrefix = '/framework/';
};


cwc.server.Server.prototype.prepare = function() {
  if (this.httpServer) {
    this.httpServer.listen();

    // Default files
    this.httpServer.addFile('test.html', '<h1>Hello World</h1>', 'text/html');
    this.httpServer.addFile(this.frameworkPrefix + '__init__.py', '#',
      'text/x-python');

    // Framework redirects
    this.addFrameworkRedirect('brython_turtle.py',
      '/framework/Lib/site-packages/turtle.py');
    this.addFrameworkRedirect('__init__.py',
      '/framework/Lib/site-packages/turtle/__init__.py');
  }
};


/**
 * @param {!string} name
 * @param {!string} content
 * @param {!string} type
 */
cwc.server.Server.prototype.addFrameworkFile = function(name, content) {
  if (this.httpServer) {
    let type = 'text/javascript';
    if (name.endsWith('.py')) {
      type = 'text/x-python';
    }
    this.httpServer.addFile(this.frameworkPrefix + name, content, type);
  }
};


/**
 * @param {!string} name
 * @param {!string} path
 */
cwc.server.Server.prototype.addFrameworkRedirect = function(name, path) {
  if (this.httpServer) {
    this.httpServer.addRedirect(path, this.frameworkPrefix + name);
  }
};


/**
 * @param {!string} name
 * @return {!string}
 */
cwc.server.Server.prototype.getFrameworkFileURL = function(name) {
  return this.httpServerPrefix + this.frameworkPrefix + name;
};

