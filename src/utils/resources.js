/**
 * @fileoverview Resources handler.
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
 * @author mbordihn@google.com (Markus Bordihn)
 */
goog.provide('cwc.utils.Resources');

goog.require('goog.net.XhrIo');


/**
 * Async unit tests that download files from github sometimes fail with
 * a message that Jasmine's timeout was exceeded before done() was called.
 * The root cause is that the request simply didn't complete quickly enough,
 * but the error message doesn't indicate that. This function sets the timeout
 * on network requests used in this module so that they timeout before
 * Jasmine's timeout is exceeded causing unit tests to display useful error
 * messages.
 *
 * @param {number} timeout
 * @return {!goog.net.XhrIo}
 */
cwc.utils.Resources.getXhrIo = function(timeout = 10000) { // 10 seconds
    let xhr = new goog.net.XhrIo();
    xhr.setTimeoutInterval(timeout);
    return xhr;
};

/**
 * @param {string} uri
 * @return {Promise}
 */
cwc.utils.Resources.getUriAsText = function(uri) {
  return new Promise((resolve, reject) => {
    let xhr = cwc.utils.Resources.getXhrIo();
    goog.events.listen(xhr, goog.net.EventType.SUCCESS, function(e) {
      let xhrResponse = /** @type {!goog.net.XhrIo} */ (e.target);
    resolve(xhrResponse.getResponseText() || '');
    });
    cwc.utils.Resources.addXhrErrorEvents_(xhr, reject, uri);
    xhr.send(uri);
  });
};


/**
 * @param {string} uri
 * @return {Promise}
 */
cwc.utils.Resources.getUriAsBlob = function(uri) {
  return new Promise((resolve, reject) => {
    let xhr = cwc.utils.Resources.getXhrIo();
    xhr.setResponseType(goog.net.XhrIo.ResponseType.BLOB);
    goog.events.listen(xhr, goog.net.EventType.SUCCESS, function(e) {
      let xhrResponse = /** @type {!goog.net.XhrIo} */ (e.target);
    resolve(xhrResponse.getResponse());
    });
    cwc.utils.Resources.addXhrErrorEvents_(xhr, reject, uri);
    xhr.send(uri);
  });
};


/**
 * @param {string} uri
 * @return {Promise}
 */
cwc.utils.Resources.getUriAsBase64 = function(uri) {
  return new Promise((resolve, reject) => {
    let xhr = cwc.utils.Resources.getXhrIo();
    xhr.setResponseType(goog.net.XhrIo.ResponseType.BLOB);
    goog.events.listen(xhr, goog.net.EventType.SUCCESS, function(e) {
      let xhrResponse = /** @type {!goog.net.XhrIo} */ (e.target);
      let content = /** @type {!Blob} */ (xhrResponse.getResponse());
      let contentReader = new FileReader();
      contentReader.onload = (e) => {
        resolve(e.target.result);
      };
      contentReader.readAsDataURL(content);
    });
    cwc.utils.Resources.addXhrErrorEvents_(xhr, reject, uri);
    xhr.send(uri);
  });
};


/**
 * @param {string} uri
 * @param {string} nodeId
 * @return {Promise}
 */
cwc.utils.Resources.getUriAsJavaScriptTag = function(uri, nodeId) {
  return new Promise((resolve, reject) => {
    let headNode = document.head || document.getElementsByTagName('head')[0];
    let existingScriptNode = document.getElementById(nodeId);
    if (existingScriptNode) {
      if (existingScriptNode.src === uri) {
        return;
      }
      existingScriptNode.parentNode.removeChild(existingScriptNode);
    }
    let scriptNode = document.createElement('script');
    scriptNode.id = nodeId;
    scriptNode.onload = resolve;
    scriptNode.onerror = reject;
    headNode.appendChild(scriptNode);
    scriptNode.src = uri;
  });
};


/**
 * @param {string} uri
 * @return {Promise}
 */
cwc.utils.Resources.getUriAsJson = function(uri) {
  return new Promise((resolve, reject) => {
    let xhr = cwc.utils.Resources.getXhrIo();
    goog.events.listen(xhr, goog.net.EventType.SUCCESS, function(e) {
      let xhrResponse = /** @type {!goog.net.XhrIo} */ (e.target);
      resolve(xhrResponse.getResponseJson() || {});
    });
    cwc.utils.Resources.addXhrErrorEvents_(xhr, reject, uri);
    xhr.send(uri);
  });
};


/**
 * @param {!goog.net.XhrIo} xhr
 * @param {!Function} reject
 * @param {string=} uri
 * @private
 */
cwc.utils.Resources.addXhrErrorEvents_ = function(xhr, reject,
    uri = 'unknown') {
  goog.events.listen(xhr, goog.net.EventType.ERROR, function(e) {
    reject(new Error(
        'Unable to open uri ' + uri + ':' + e.target.getLastError()));
  });
  goog.events.listen(xhr, goog.net.EventType.TIMEOUT, function() {
    reject(new Error('Timeout for uri ' + uri));
  });
};
