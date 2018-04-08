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
goog.require('cwc.utils.mime.getTypeByExtension');

goog.require('goog.events.EventTarget');


/**
 * @param {string=} address
 * @param {number=} port
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.tcp.HTTPServer = function(address, port) {
  /** @type {string} */
  this.name = 'HTTP Server';

  /** @type {!string} */
  this.address = address || '127.0.0.1';

  /** @type {!number} */
  this.port = port || 8090;

  /** @type {!number} */
  this.backlog = 10;

  /** @private {!boolean} */
  this.isChromeApp_ = typeof chrome.app !== 'undefined' &&
      typeof chrome.app.window !== 'undefined';

  /** @private {cwc.utils.Database} */
  this.database_ = new cwc.utils.Database(this.name);

  /** @private {!Object} */
  this.redirects_ = {};

  /** @private {!Object} */
  this.customHandlers_ = {};

  /** @private {!goog.events.EventTarget} */
  this.eventHandler_ = new goog.events.EventTarget();

  /** @private {number|null} */
  this.socketId_ = null;

  /** @private {boolean} */
  this.isConnected_ = false;

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * @param {number=} port
 * @param {string=} address
 */
cwc.protocol.tcp.HTTPServer.prototype.listen = function(port, address) {
  if (!this.isChromeApp_ || !chrome.sockets) {
    this.log_.error('Chrome sockets support is not available!');
    return;
  }

  if (port) {
    this.port = port;
  }
  if (address) {
    this.address = address;
  }
  if (this.port && this.address) {
    this.database_.open();
    chrome.sockets.tcpServer.create({}, this.handleCreate_.bind(this));
  }
};


cwc.protocol.tcp.HTTPServer.prototype.unlisten = function() {
  chrome.sockets.tcpServer.onAccept.removeListener(
    this.handleAccept_.bind(this));
  chrome.sockets.tcpServer.onAcceptError.removeListener(
    this.handleAcceptError_.bind(this));
  chrome.sockets.tcp.onReceive.removeListener(
    this.handleRecieve_.bind(this));
  chrome.sockets.tcp.onReceiveError.removeListener(
    this.handleRecieveError_.bind(this));
  this.socketId_ = null;
  this.isConnected_ = false;
};


/**
 * @param {!string} path
 * @param {!function} handler
 */
cwc.protocol.tcp.HTTPServer.prototype.addCustomHandler = function(path,
  handler) {
  this.log_.info('Add custom Handler for', path);
  this.customHandlers_[path] = handler;
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

  this.log_.info('Add file', path, content.length);
  this.database_.putFile(path, content);
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
 * @return {!string}
 */
cwc.protocol.tcp.HTTPServer.prototype.getRootURL = function() {
  return 'http://' + this.address + ':' + this.port;
};


/**
 * HTTP response handler
 * @param {!string} content
 * @param {Object=} options
 * @param {number=} clientSocketId
 * @param {string=} requestPath
 * @private
 */
cwc.protocol.tcp.HTTPServer.prototype.httpResponse_ = function(content,
    options = {}, clientSocketId, requestPath = '') {
  let contentType = options['content_type'] || 'text/plain';
  let statusCode = options['status_code'] || 200;
  let httpVersion = (options['http_version'] || 'HTTP/1.1') + ' ';
  chrome.sockets.tcp.getInfo(clientSocketId, function(socketInfo) {
    if (!socketInfo['connected']) {
      this.log_.error('Socket is no longer connected', socketInfo);
      this.disconnectClientSocket_(clientSocketId);
      return;
    }
    let output = [];
    if (statusCode === 200) {
      this.log_.info('200', requestPath);
      output.push(httpVersion + '200 OK');
    } else if (statusCode === 301) {
      this.log_.info('301', requestPath, '>', this.redirects_[requestPath]);
      output.push(httpVersion + '301 Moved Permanently');
      output.push('Location: ' + content);
    } else if (statusCode === 404) {
      this.log_.info('404', requestPath);
      output.push(httpVersion + '404 Not found');
    } else if (Number.isInteger(statusCode)) {
      this.log_.info(statusCode, requestPath);
      output.push(httpVersion + statusCode);
    } else {
      this.log_.warn('Unknown status code', statusCode);
      output.push(httpVersion + '501 Not Implemented');
    }

    output.push('Access-Control-Allow-Origin: null');
    output.push('Server: Coding with Chrome - local');
    output.push('Content-type: ' + contentType);
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
    chrome.sockets.tcp.setKeepAlive(clientSocketId, true, 1, function() {
      chrome.sockets.tcp.send(clientSocketId, view.buffer,
        this.handleSend_.bind(this));
    }.bind(this));
  }.bind(this));
};


/**
 * @param {Object} acceptInfo
 * @private
 */
cwc.protocol.tcp.HTTPServer.prototype.handleAccept_ = function(acceptInfo) {
  if (acceptInfo['socketId'] !== this.socketId_) {
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
 * @param {Object} createInfo
 * @private
 */
cwc.protocol.tcp.HTTPServer.prototype.handleCreate_ = function(createInfo) {
  if (chrome.runtime.lastError) {
    this.log_.error('Unable to create socket: ',
      chrome.runtime.lastError.message);
    return;
  }
  if (!createInfo['socketId']) {
    this.log_.error('Unable to get socket id', createInfo);
    return;
  }
  this.socketId_ = createInfo['socketId'];
  this.isConnected_ = true;
  chrome.sockets.tcpServer.listen(this.socketId_, this.address, this.port,
    this.backlog, this.handleListen_.bind(this));
};


/**
 * @param {number} result
 * @private
 */
cwc.protocol.tcp.HTTPServer.prototype.handleListen_ = function(result) {
  if (result < 0) {
    this.log_.error('Unable to connect to server', result);
    return;
  }
  this.log_.info('Listening on', this.getRootURL(), result);
  chrome.sockets.tcpServer.onAccept.addListener(
    this.handleAccept_.bind(this));
  chrome.sockets.tcpServer.onAcceptError.addListener(
    this.handleAcceptError_.bind(this));
  chrome.sockets.tcp.onReceive.addListener(
    this.handleRecieve_.bind(this));
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
  let data = cwc.utils.ByteTools.toUTF8(receiveInfo['data']);
  if (!data) {
    this.log_.error('Text decoding failed for', receiveInfo['data']);
    return;
  }
  if (data.startsWith('GET ') && data.includes('HTTP')) {
    let result = true;
    let requestPath = data.substring(4, data.indexOf(' ', 4));
    let requestParameter = '';
    if (requestPath.includes('?')) {
      let requestFragments = requestPath.split('?');
      requestPath = requestFragments[0];
      requestParameter = requestFragments[1];
    }
    let httpResponse = function(content = '', options = {}) {
      this.httpResponse_(
        content, options, receiveInfo['socketId'], requestPath);
    }.bind(this);
    this.log_.info('GET', requestPath, requestParameter);
    if (requestPath === '/') {
      // Index page
      httpResponse('CwC HTTPServer\n' + new Date());
    } else if (typeof this.redirects_[requestPath] !== 'undefined') {
      // Handle redirect
      httpResponse(this.redirects_[requestPath], {'status_code': 301});
    } else if (Object.keys(this.customHandlers_).length) {
      // Handle custom handler
      let foundCustomHandler = false;
      for (let customHandler in this.customHandlers_) {
        if (this.customHandlers_.hasOwnProperty(customHandler)) {
          if (requestPath.startsWith(customHandler)) {
            this.log_.info('CUSTOM', requestPath);
            this.customHandlers_[customHandler](requestPath, httpResponse);
            foundCustomHandler = true;
          }
        }
      }
      result = foundCustomHandler;
    }

    if (!result) {
      this.database_.getFile(requestPath).then((content) => {
        if (content !== undefined) {
          // File found handling
          httpResponse(content, {
            'content_type': cwc.utils.mime.getTypeByExtension(requestPath),
          });
        } else {
          // File not found handling
          httpResponse(content, {'status_code': 404});
        }
      });
    }
  } else {
    this.log_.info('Unsupported request', data);
    this.disconnectClientSocket_(receiveInfo['socketId']);
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
