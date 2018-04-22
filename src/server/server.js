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
goog.require('cwc.utils.Logger');


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
  this.previewFile = '/preview.html';

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


cwc.server.Server.prototype.prepare = function() {
  this.httpServer = this.helper.getInstance('http-server');
  if (!this.httpServer) {
    this.log_.error('Unable to found http-server');
    return;
  }

  this.httpServer.addCustomHandler('/test/', (request, httpResponse) => {
    httpResponse('Hello World 123:' + request);
  });

  // Handle framework /css/ files ...
  this.httpServer.addCustomHandler('/css/', function(request, httpResponse) {
    this.helper.getInstance('cache').getFile(request).then((content) => {
      httpResponse(content, {
        'content_type': cwc.utils.mime.getTypeByExtension(request),
      });
    });
  }.bind(this));

  // Handle framework files ...
  this.httpServer.addCustomHandler('/frameworks/', function(request,
      httpResponse) {
    this.helper.getInstance('cache').getFile(request).then((content) => {
      httpResponse(content, {
        'content_type': cwc.utils.mime.getTypeByExtension(request),
      });
    });
  }.bind(this));

  // Handle library files ...
  this.httpServer.addCustomHandler('/library/', function(request,
      httpResponse) {
    this.helper.getInstance('cache').getLibraryFile(request).then((content) => {
      httpResponse(content, {
          'content_type': cwc.utils.mime.getTypeByExtension(request),
      });
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
    let fileInstance = this.helper.getInstance('file');
    if (fileInstance) {
      let filename = fileInstance.getSafeFileTitle();
      if (filename) {
        if (!filename.endsWith('.html') && !filename.endsWith('.htm')) {
          filename = filename + '.html';
        }
        this.previewFile = '/preview/' + filename.replace('_cwc', '');
      } else {
        this.previewFile = '/preview/';
      }
    }
    this.httpServer.addFile(this.previewFile, content);
  }
};


/**
 * @param {!string} name
 * @return {!string}
 */
cwc.server.Server.prototype.getFrameworkFileURL = function(name) {
  return this.getRootURL() + name;
};


/**
 * @return {!string}
 */
cwc.server.Server.prototype.getRootURL = function() {
  return this.httpServer ? this.httpServer.getRootURL() : '/';
};


/**
 * @return {!string}
 */
cwc.server.Server.prototype.getPreviewURL = function() {
  return this.getRootURL() + this.previewFile + '?' +
    Math.floor(Math.random() * 100000000);
};
