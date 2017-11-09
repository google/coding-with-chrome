/**
 * @fileoverview Google Account Integration for the Coding with Chrome editor.
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
goog.provide('cwc.ui.Account');

goog.require('cwc.utils.Helper');
goog.require('goog.Uri');
goog.require('goog.events');
goog.require('goog.net.XhrIo');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 */
cwc.ui.Account = function(helper) {
  /** @type {string} */
  this.name = 'Account';

  /** @type {boolean} */
  this.online = false;

  /** @type {string} */
  this.prefix = 'account-';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.accessToken = '';

  /** @type {boolean} */
  this.authenticated = false;

  /** @type {string} */
  this.userName = '';

  /** @type {string} */
  this.userFamilyName = '';

  /** @type {string} */
  this.userGivenName = '';

  /** @type {string} */
  this.userPicture = '';

  /** @type {string} */
  this.userLink = '';
};


/**
 * Prepares the account status.
 */
cwc.ui.Account.prototype.prepare = function() {
  goog.events.listen(window, 'offline', this.handleOnlineStatus_, false, this);
  goog.events.listen(window, 'online', this.handleOnlineStatus_, false, this);
  this.setOnlineStatus(window.navigator.onLine);
  this.setUnauthenticated();
};


/**
 * Handles the oAuth 2.0 authentication.
 */
cwc.ui.Account.prototype.authenticate = function(callback) {
  console.log('Try to authenticated...');
  let authentificationEvent = (function(opt_access_token) {
    this.handleAuthentication_(opt_access_token);
    if(callback) {
      callback(this.authenticated);
    }
  }).bind(this);
  chrome.identity.getAuthToken({'interactive': true}, authentificationEvent);
};


/**
 * Deauthenticates the user.
 */
cwc.ui.Account.prototype.deauthenticate = function() {
  console.log('De-authenticated token: ' + this.accessToken);
  let unauthenticationEvent = this.setUnauthenticated.bind(this);
  chrome.identity.removeCachedAuthToken({'token': this.accessToken},
      unauthenticationEvent);
};


/**
 * @return {boolean} Whether the user is authenticated.
 */
cwc.ui.Account.prototype.isAuthenticated = function() {
  let authentificationEvent = this.handleAuthentication_.bind(this);
  chrome.identity.getAuthToken({'interactive': false}, authentificationEvent);
  return this.authenticated;
};


/**
 * Requests user informations.
 */
cwc.ui.Account.prototype.requestUserInfo = function() {
  this.request({
    'path': '/oauth2/v1/userinfo',
    'callback': this.setUserInfo.bind(this),
  });
};


/**
 * Sets user information to the given user_info.
 * @param {Object} user_info
 */
cwc.ui.Account.prototype.setUserInfo = function(user_info) {
  this.userName = user_info['name'] || '';
  this.userFamilyName = user_info['family_name'] || '';
  this.userGivenName = user_info['given_name'] || '';
  this.userPicture = user_info['picture'] || '';
  this.userLink = user_info['link'] || '';
};


/**
 * @param {boolean} online
 */
cwc.ui.Account.prototype.setOnlineStatus = function(online) {
  this.online = online;
};


/**
 * Sets authentication to true.
 */
cwc.ui.Account.prototype.setAuthenticated = function() {
  this.setAuthentication(true);
};


/**
 * Sets authentication to false.
 */
cwc.ui.Account.prototype.setUnauthenticated = function() {
  this.setAuthentication(false);
};


/**
 * Sets the authentication.
 * @param {!boolean} authenticated
 */
cwc.ui.Account.prototype.setAuthentication = function(authenticated) {
  let menubarInstance = this.helper.getInstance('menubar');
  if (menubarInstance) {
    menubarInstance.setAuthenticated(authenticated);
  }

  let navigationInstance = this.helper.getInstance('navigation');
  if (navigationInstance) {
    navigationInstance.enableOpenGoogleDriveFile(authenticated);
    navigationInstance.enableSaveGoogleDriveFile(authenticated);
  }

  if (!authenticated) {
    this.accessToken = '';
  }
  this.authenticated = authenticated;
};


/**
 * @param {Object} opts Contains options for http request, listed below:
 *   - content: data to send with request.
 *   - header: Object of optional headers.
 *   - method: http method type (GET, POST, PUT, etc.)
 *   - param: GET or POST parameters.
 *   - path: endpoint to hit on googleapis.com (default domain).
 *   - subdomain: specifies googleapis.com subdomain.
 *   - token: Authorization bearer token.
 *   - raw: if true opts.path becomes the entire URI.
 * @param {function(?)=} callback Called when http request completes.
 */
cwc.ui.Account.prototype.request = function(opts, callback) {
  let params = opts.params || {};

  let handleRequest = (function() {
    let subdomain = 'www';
    if (opts.subdomain && typeof(opts.subdomain) === 'string' &&
      opts.subdomain.match(/^[0-9a-zA-Z]+$/)) {
      subdomain = opts.subdomain;
    }

    let uri = subdomain + '.googleapis.com';
    let url = goog.Uri.create('https', null, uri, null, opts.path);
    if (opts.raw) {
      url = new goog.Uri(opts.path);
    }
    let method = opts.method || 'GET';
    let content = opts.content;
    let token = opts.token || this.accessToken || '';

    for (let i in params) {
      if (Object.prototype.hasOwnProperty.call(params, i)) {
        url.setParameterValue(i, params[i]);
      }
    }

    let headers = new Map(Object.entries(opts.header || {}));
    headers.set('Authorization', 'Bearer ' + token);
    headers.set('X-JavaScript-User-Agent', 'Coding with Chrome');

    let xhrRepsonseEvent = function (event) {
      this.handleXhrResponse(event, callback);
    };

    /** @type {goog.net.XhrIo} */
    let xhr = new goog.net.XhrIo();
    goog.events.listen(xhr, goog.net.EventType.COMPLETE, xhrRepsonseEvent,
      false, this);
    goog.events.listen(xhr, goog.net.EventType.ERROR, this.handleXhrError,
      false, this);
    goog.events.listen(xhr, goog.net.EventType.TIMEOUT, this.handleXhrTimeout,
      false, this);

    console.log('Request: ' + method + ' ' + url);
    xhr.send(url, method, content, headers);
  }).bind(this);

  if (!this.authenticated) {
    this.authenticate(handleRequest);
  } else {
    handleRequest();
  }
};


/**
 * Handles the Xhr repsonse.
 * @param {Event} e
 * @param {function(?)=} optCallback
 */
cwc.ui.Account.prototype.handleXhrResponse = function(e, optCallback) {
  /** @type {EventTarget|goog.net.XhrIo} */
  let xhr = e.target;
  let response = '';
  console.log('Handle Xhr response:', xhr);

  if (xhr.isSuccess()) {
    let rawResponse = xhr.getResponseText();
    try {
      response = JSON.parse(rawResponse);
    } catch (error) {
      response = rawResponse;
    }
    if (goog.isFunction(optCallback)) {
      optCallback(response);
    }
  }
};


/**
 * Handles Xhr errors.
 * @param {Event} event
 */
cwc.ui.Account.prototype.handleXhrError = function(event) {
  this.helper.showError('Xhr request error!');
  console.error(event);
};


/**
 * Handles Xhr timeout.
 * @param {Event} event
 */
cwc.ui.Account.prototype.handleXhrTimeout = function(event) {
  this.helper.showError('Xhr request timeout!');
  console.error(event);
};


/**
 * Handles authentication and store access.
 * @param {string=} opt_access_token
 * @private
 */
cwc.ui.Account.prototype.handleAuthentication_ = function(opt_access_token) {
  if (opt_access_token) {
    this.accessToken = opt_access_token;
    this.setAuthenticated();
    console.log('Access token: ' + this.accessToken);
    this.requestUserInfo();
    this.helper.showSuccess('Successful authenticated...');
  } else {
    this.setUnauthenticated();
    let errorMsg = chrome.runtime.lastError.message;
    this.helper.showError('Authentication failed: ' + errorMsg);
  }
};


/**
 * @param {Event=} opt_event
 * @private
 */
cwc.ui.Account.prototype.handleOnlineStatus_ = function(opt_event) {
  this.setOnlineStatus(window.navigator.onLine);
};
