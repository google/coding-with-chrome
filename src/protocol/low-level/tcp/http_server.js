 /**
 * @fileoverview Simple cached HTTP Server.
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
goog.provide('cwc.protocol.tcp.HTTPServer');

goog.require('cwc.utils.ByteTools');
goog.require('cwc.utils.Database');
goog.require('cwc.utils.Logger');

goog.require('goog.events.EventTarget');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.tcp.HTTPServer = function(helper) {
  /** @type {string} */
  this.name = 'HTTP Server';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {boolean} */
  this.enabled = false;

  /** @type {boolean} */
  this.prepared = false;

  /** @type {!string} */
  this.address = '127.0.0.1';

  /** @type {!number} */
  this.port = 8090;

  /** @type {!number} */
  this.backlog = 10;

  /** @private {!boolean} */
  this.isChromeApp_ = this.helper.checkChromeFeature('app');

  /** @private {number|null} */
  this.socket_ = null;

  /** @private {cwc.utils.Database} */
  this.files_ = new cwc.utils.Database(this.name);

  /** @private {!Object} */
  this.redirects_ = {};

  /** @private {!goog.events.EventTarget} */
  this.eventHandler_ = new goog.events.EventTarget();

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * Prepares the http server.
 */
cwc.protocol.tcp.HTTPServer.prototype.prepare = function() {
  if (!this.isChromeApp_ || !chrome.sockets) {
    console.warn('Sockets support is not available!');
    return;
  }
  if (this.prepared) {
    return;
  }

  this.log_.debug('Preparing cache file support...');
  this.files_.open();
  this.prepared = true;
};


/**
 * @param {number=} port
 * @param {string=} address
 */
cwc.protocol.tcp.HTTPServer.prototype.listen = function(port, address) {
  if (port) {
    this.port = port;
  }
  if (address) {
    this.address = address;
  }
  if (this.port && this.address) {
    this.createSocket_(this.listen_.bind(this));
  }
};


/**
 * @param {!number} socketId
 * @param {!string} content
 * @param {string=} type
 */
cwc.protocol.tcp.HTTPServer.prototype.send200Response = function(socketId,
    content, type='text/plain') {
  this.sendHTTPResponse(socketId, content, type, 200);
};


/**
 * @param {!number} socketId
 * @param {!string} redirect
 */
cwc.protocol.tcp.HTTPServer.prototype.send301Response = function(socketId,
    redirect) {
  this.sendHTTPResponse(socketId, redirect, undefined, 301);
};


/**
 * @param {!number} socketId
 * @param {!string} content
 * @param {string=} type
 */
cwc.protocol.tcp.HTTPServer.prototype.send404Response = function(socketId,
  content, type='text/plain') {
  this.sendHTTPResponse(socketId, content, type, 404);
};


/**
 * @param {!number} socketId
 * @param {!string} content
 * @param {string=} type
 * @param {number=} status
 */
cwc.protocol.tcp.HTTPServer.prototype.sendHTTPResponse = function(socketId,
    content, type='text/plain', status=200) {
  // Makes sure that the connection is still usable.
  chrome.sockets.tcp.getInfo(socketId, function(socketInfo) {
    if (!socketInfo['connected']) {
      this.log_.error('Socket is no longer connected', socketInfo);
      this.disconnectClientSocket_(socketId);
      return;
    }
    let output = [];
    if (status === 200) {
      output.push('HTTP/1.1 200 OK');
    } else if (status === 301) {
      output.push('HTTP/1.1 301 Moved Permanently');
      output.push('Location: ' + content);
    } else if (status === 404) {
      output.push('HTTP/1.1 404 Not found');
    }

    output.push('Access-Control-Allow-Origin: null');
    output.push('Server: Coding with Chrome - local');
    output.push('Content-type: ' + type);
    output.push('Content-length: ' + content.length);
    output.push('Connection: keep-alive');
    output.push('');
    output.push(content);
    output.push('\n');

    // Prepare ArrayBuffer with content.
    let response = cwc.utils.ByteTools.toUint8Array(output.join('\n'));
    let view = new Uint8Array(new ArrayBuffer(response.byteLength));
    view.set(response, 0);

    // Handling keep alive.
    chrome.sockets.tcp.setKeepAlive(socketId, true, 1, function() {
      chrome.sockets.tcp.send(socketId, view.buffer,
        this.handleSend_.bind(this));
    }.bind(this));
  }.bind(this));
};


/**
 * @param {!string} path
 * @param {!string} content
 */
cwc.protocol.tcp.HTTPServer.prototype.addFile = function(path, content) {
  if (!content) {
    this.log_.warn('Empty file', path);
    return;
  }
  if (!path.startsWith('/')) {
    path = '/' + path;
  }

  this.log_.info('Add', path, content.length);
  this.files_.putFile(path, content);
};


/**
 * @param {!string} path
 * @return {Promise}
 */
cwc.protocol.tcp.HTTPServer.prototype.getFile = function(path) {
  return this.files_.getFile(path);
};


/**
 * @param {!string} path
 * @param {!string} redirect
 */
cwc.protocol.tcp.HTTPServer.prototype.addRedirect = function(path, redirect) {
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  if (!redirect.startsWith('/')) {
    redirect = '/' + redirect;
  }
  if (path === redirect) {
    this.log_.error('Redirect Loop', redirect);
    return;
  }
  this.log_.info('Add redirect', path, 'to', redirect);
  this.redirects_[path] = redirect;
};


/**
 * @param {Function=} callback
 * @private
 */
cwc.protocol.tcp.HTTPServer.prototype.createSocket_ = function(callback) {
  chrome.sockets.tcpServer.create({}, callback);
};


/**
 * @param {Object} socketInfo
 * @private
 */
cwc.protocol.tcp.HTTPServer.prototype.listen_ = function(socketInfo) {
  this.socket_ = socketInfo['socketId'];
  if (!this.socket_) {
    this.log_.error('Unable to get socket', socketInfo);
  }
  chrome.sockets.tcpServer.listen(this.socket_, this.address, this.port,
    this.backlog, this.handleListen_.bind(this));
};


/**
 * @param {Object} acceptInfo
 * @private
 */
cwc.protocol.tcp.HTTPServer.prototype.handleAccept_ = function(acceptInfo) {
  if (acceptInfo['socketId'] !== this.socket_) {
    this.log_.error('Socket mismatch!', acceptInfo);
    return;
  }
  chrome.sockets.tcp.setPaused(acceptInfo['clientSocketId'], false);
};


/**
 * @param {Object} error
 * @private
 */
cwc.protocol.tcp.HTTPServer.prototype.handleAcceptError_ = function(error) {
  this.log_.error('Accept Error Handler', error);
};


/**
 * @param {number} result
 * @private
 */
cwc.protocol.tcp.HTTPServer.prototype.handleListen_ = function(result) {
  this.log_.info('Listening on', this.address, ':', this.port, result);
  chrome.sockets.tcpServer.onAccept.addListener(this.handleAccept_.bind(this));
  chrome.sockets.tcpServer.onAcceptError.addListener(
    this.handleAcceptError_.bind(this));
  chrome.sockets.tcp.onReceive.addListener(this.handleRecieve_.bind(this));
  chrome.sockets.tcp.onReceiveError.addListener(
    this.handleRecieveError_.bind(this));
};


/**
 * @param {Object} sendInfo
 * @private
 */
cwc.protocol.tcp.HTTPServer.prototype.handleSend_ = function(sendInfo) {
  if (chrome.runtime.lastError) {
    this.log_.error('Send Handler Error', chrome.runtime.lastError, sendInfo);
  }
};


/**
 * @param {Object} receiveInfo
 * @private
 */
cwc.protocol.tcp.HTTPServer.prototype.handleRecieve_ = function(receiveInfo) {
  if (!receiveInfo['data']) {
    return;
  }
  let socketId = receiveInfo['socketId'];
  let data = cwc.utils.ByteTools.toString(receiveInfo['data']);
  if (!data) {
    return;
  }
  if (data.startsWith('GET ') && data.includes('HTTP')) {
    let requestPath = data.substring(4, data.indexOf(' ', 4));
    let requestParameter = '';
    if (requestPath.includes('?')) {
      let requestFragments = requestPath.split('?');
      requestPath = requestFragments[0];
      requestParameter = requestFragments[1];
    }
    this.log_.info('GET', requestPath, requestParameter);

    if (requestPath === '/') {
      // Index page
      this.send200Response(socketId, 'CwC HTTPServer\n' + new Date());
    } else if (typeof this.redirects_[requestPath] !== 'undefined') {
      // Handle redirect
      this.log_.info('301', requestPath, '>', this.redirects_[requestPath]);
      this.send301Response(socketId, this.redirects_[requestPath]);
    } else {
      this.getFile(requestPath).then((content) => {
        if (content !== undefined) {
          // File found handling
          let contentType = cwc.file.getMimeTypeByExtension(requestPath);
          this.send200Response(socketId, content, contentType);
        } else {
          // File not found handling
          this.log_.info('404', requestPath);
          this.send404Response(socketId, 'File not found!');
        }
      });
    }
  } else {
    this.log_.info('Unsupported request', data);
    this.disconnectClientSocket_(socketId);
  }
};


/**
 * @param {Object} error
 * @private
 */
cwc.protocol.tcp.HTTPServer.prototype.handleRecieveError_ = function(error) {
  if (error['resultCode'] === -100) {
    this.closeClientSocket_(error['socketId']);
  } else {
    this.log_.error('Receive Error Handler', error);
  }
};


/**
 * @param {!number} socketId
 */
cwc.protocol.tcp.HTTPServer.prototype.closeClientSocket_ = function(socketId) {
  chrome.sockets.tcp.close(socketId);
};


/**
 * @param {!number} socketId
 */
cwc.protocol.tcp.HTTPServer.prototype.disconnectClientSocket_ = function(
    socketId) {
  chrome.sockets.tcp.disconnect(socketId, function() {
    this.closeClientSocket_(socketId);
  }.bind(this));
};
