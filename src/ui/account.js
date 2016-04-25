/**
 * @fileoverview Google Account Integration for the Coding with Chrome editor.
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
goog.provide('cwc.ui.Account');

goog.require('cwc.utils.Helper');
goog.require('goog.Uri');
goog.require('goog.events');
goog.require('goog.net.XhrIo');
goog.require('goog.structs.Map');



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

};


/**
 * Prepares the account status.
 */
cwc.ui.Account.prototype.prepare = function() {
  goog.events.listen(window, 'offline', this.handleOnlineStatus, false, this);
  goog.events.listen(window, 'online', this.handleOnlineStatus, false, this);
  this.setOnlineStatus(window.navigator.onLine);
  this.setUnauthenticated();
};


/**
 * Handles the oAuth 2.0 authentication.
 */
cwc.ui.Account.prototype.authenticate = function() {
  console.log('Try to authenticated …');
  this.helper.setStatus('Authentication …');
  var authentificationEvent = this.handleAuthentication.bind(this);
  chrome.identity.getAuthToken({ 'interactive': true }, authentificationEvent);
};


/**
 * Deauthenticates the user.
 */
cwc.ui.Account.prototype.deauthenticate = function() {
  console.log('De-authenticated token: ' + this.accessToken);
  var unauthenticationEvent = this.setUnauthenticated.bind(this);
  chrome.identity.removeCachedAuthToken({ 'token': this.accessToken },
      unauthenticationEvent);
};


/**
 * @return {boolean} Whether the user is authenticated.
 */
cwc.ui.Account.prototype.isAuthenticated = function() {
  var authentificationEvent = this.handleAuthentication.bind(this);
  chrome.identity.getAuthToken({ 'interactive': false }, authentificationEvent);
  return this.authenticated;
};


/**
 * Handles authentication and store access.
 * @param {string=} opt_access_token
 */
cwc.ui.Account.prototype.handleAuthentication = function(
    opt_access_token) {
  if (opt_access_token) {
    this.accessToken = opt_access_token;
    this.setAuthenticated();
    console.log('Access token: ' + this.accessToken);
    this.requestUserInfo();
    this.helper.showSuccess('Successful authenticated …');
  } else {
    this.setUnauthenticated();
    var errorMsg = chrome.runtime.lastError.message;
    this.helper.showError('Authentication failed: ' + errorMsg);
  }
};


/**
 * Requests user informations.
 */
cwc.ui.Account.prototype.requestUserInfo = function() {
  this.request({
    'path': '/oauth2/v1/userinfo',
    'callback':  this.setUserInfo.bind(this)
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
  if (this.buttonLogin) {
    this.buttonLogin.setEnabled(online);
  }
  this.online = online;
};


/**
 * @param {Event=} opt_event
 */
cwc.ui.Account.prototype.handleOnlineStatus = function(opt_event) {
  this.setOnlineStatus(window.navigator.onLine);
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
 * @param {boolean} authenticated
 */
cwc.ui.Account.prototype.setAuthentication = function(authenticated) {
  var menubarInstance = this.helper.getInstance('menubar');
  if (menubarInstance) {
    menubarInstance.setAuthenticated(authenticated);
  }
  if (!authenticated) {
    this.accessToken = '';
  }
  this.authenticated = authenticated;
};


/**
 * @param {Object} args The args object supports the following properties:
 *   - callback
 *   - content
 *   - header
 *   - method
 *   - param
 *   - path
 *   - token
 */
cwc.ui.Account.prototype.request = function(args) {
  if (!this.authenticated) {
    this.authenticate();
  }

  var url = new goog.Uri('https://www.googleapis.com' + args.path);
  if (args.raw) {
    url = new goog.Uri(args.path);
  }
  var callback = args.callback;
  var method = args.method || 'GET';
  var content = args.content;
  var token = args.token || this.accessToken || '';
  this.helper.setStatus('Send request …');

  var params = args.params || '';
  if (typeof params == 'object') {
    for (var i in params) {
      url.setParameterValue(i, params[i]);
    }
  }

  var headers = new goog.structs.Map(args.header);
  headers.set('Authorization', 'Bearer ' + token);
  headers.set('X-JavaScript-User-Agent', 'Coding with Chrome');

  var xhrRepsonseEvent = function(event) {
    this.handleXhrResponse(event, callback);
  };

  /** @type {goog.net.XhrIo} */
  var xhr = new goog.net.XhrIo();
  goog.events.listen(xhr, goog.net.EventType.COMPLETE, xhrRepsonseEvent,
      false, this);
  goog.events.listen(xhr, goog.net.EventType.ERROR, this.handleXhrError,
      false, this);
  goog.events.listen(xhr, goog.net.EventType.TIMEOUT, this.handleXhrTimeout,
      false, this);

  console.log('Request: ' + method + ' ' + url);
  xhr.send(url, method, content, headers);
};


/**
 * Handles the Xhr repsonse.
 * @param {Event} e
 * @param {function(?)=} opt_callback
 */
cwc.ui.Account.prototype.handleXhrResponse = function(e,
    opt_callback) {
  this.helper.setStatus('Handle Xhr response …');

  /** @type {EventTarget|goog.net.XhrIo} */
  var xhr = e.target;
  var response = '';
  console.log('Handle Xhr response:', xhr);

  if (xhr.isSuccess()) {
    var rawResponse = xhr.getResponseText();
    try {
      response = JSON.parse(rawResponse);
    } catch (error) {
      response = rawResponse;
    }
    if (goog.isFunction(opt_callback)) {
      opt_callback(response);
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
  this.helper.setStatus('Request timeout !');
  this.helper.showError('Xhr request timeout!');
  console.error(event);
};
