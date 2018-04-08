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
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.server.Server = function(helper) {
  /** @type {string} */
  this.name = 'Server';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {cwc.protocol.tcp.HTTPServer} */
  this.httpServer = null;

  /** @type {!string} */
  this.httpServerPrefix = 'http://localhost:8090';

  /** @type {!string} */
  this.previewFile = '/preview.html';
};


cwc.server.Server.prototype.prepare = function() {
  this.httpServer = this.helper.getInstance('http-server');
  this.httpServer.addCustomHandler('/test/', (request, httpResponse) => {
    console.log('Custom Handler test', request);
    httpResponse('Hello World 123:' + request);
  });
  this.httpServer.addCustomHandler('/css/', function(request, httpResponse) {
    this.helper.getInstance('cache').getFile(request).then((content) => {
      if (content !== undefined) {
        httpResponse(content, {
          'content_type': cwc.utils.mime.getTypeByExtension(request),
        });
      } else {
        httpResponse(content, {'status_code': 404});
      }
    });
  }.bind(this));
  this.httpServer.addCustomHandler('/frameworks/', function(request,
      httpResponse) {
    this.helper.getInstance('cache').getFile(request).then((content) => {
      if (content !== undefined) {
        httpResponse(content, {
          'content_type': cwc.utils.mime.getTypeByExtension(request),
        });
      } else {
        httpResponse(content, {'status_code': 404});
      }
    });
  }.bind(this));
  this.httpServer.listen();
};


/**
 * @param {!string} name
 * @param {!string} content
 */
cwc.server.Server.prototype.addFile = function(name, content) {
  if (this.httpServer) {
    this.httpServer.addFile(name, content);
  }
};


/**
 * @param {!string} name
 * @param {!string} path
 */
cwc.server.Server.prototype.addRedirect = function(name, path) {
  if (this.httpServer) {
    this.httpServer.addRedirect(path, name);
  }
};


/**
 * @param {!string} content
 */
cwc.server.Server.prototype.setPreview = function(content) {
  if (this.httpServer) {
    this.httpServer.addFile(this.previewFile, content);
  }
};


/**
 * @param {!string} name
 * @return {!string}
 */
cwc.server.Server.prototype.getFrameworkFileURL = function(name) {
  return this.httpServerPrefix + name;
};


/**
 * @return {!string}
 */
cwc.server.Server.prototype.getRootURL = function() {
  return this.httpServer.getRootURL();
};


/**
 * @return {!string}
 */
cwc.server.Server.prototype.getPreviewURL = function() {
  return this.httpServerPrefix + this.previewFile + '?' +
    Math.floor(Math.random() * 100000000);
};
