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
goog.provide('cwc.ui.gapi.Account');

goog.require('cwc.utils.Logger');

goog.require('goog.Uri');
goog.require('goog.events');
goog.require('goog.net.XhrIo');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 */
cwc.ui.gapi.Account = function(helper) {
  /** @type {string} */
  this.name = 'GAPI Account';

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

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * Prepares the account status.
 */
cwc.ui.gapi.Account.prototype.prepare = function() {
  this.log_.info('Preparing ...');
  goog.events.listen(window, 'offline', this.handleOnlineStatus_, false, this);
  goog.events.listen(window, 'online', this.handleOnlineStatus_, false, this);
  this.setOnlineStatus(window.navigator.onLine);
  this.setUnauthenticated();
};


/**
 * Handles the oAuth 2.0 authentication.
 * @param {function(?)=} callback
 */
cwc.ui.gapi.Account.prototype.authenticate = function(callback) {
  this.log_.info('Try to authenticated...');
  let authentificationEvent = (function(opt_access_token) {
    this.handleAuthentication_(opt_access_token);
    if (callback) {
      callback(this.authenticated);
    }
  }).bind(this);
  chrome.identity.getAuthToken({'interactive': true}, authentificationEvent);
};


/**
 * Deauthenticates the user.
 */
cwc.ui.gapi.Account.prototype.deauthenticate = function() {
  this.log_.info('De-authenticated token: ' + this.accessToken);
  let unauthenticationEvent = this.setUnauthenticated.bind(this);
  chrome.identity.removeCachedAuthToken({'token': this.accessToken},
      unauthenticationEvent);
};


/**
 * @return {boolean} Whether the user is authenticated.
 */
cwc.ui.gapi.Account.prototype.isAuthenticated = function() {
  let authentificationEvent = this.handleAuthentication_.bind(this);
  chrome.identity.getAuthToken({'interactive': false}, authentificationEvent);
  return this.authenticated;
};


/**
 * Requests user informations.
 */
cwc.ui.gapi.Account.prototype.requestUserInfo = function() {
  this.request({
    'path': '/userinfo/v2/me',
    'callback': this.setUserInfo.bind(this),
  });
};


/**
 * Sets user information to the given user_info.
 * @param {Object} user_info
 */
cwc.ui.gapi.Account.prototype.setUserInfo = function(user_info) {
  this.userName = user_info['name'] || '';
  this.userFamilyName = user_info['family_name'] || '';
  this.userGivenName = user_info['given_name'] || '';
  this.userPicture = user_info['picture'] || '';
  this.userLink = user_info['link'] || '';
  this.userLocal = user_info['local'] || 'en';
};


/**
 * @param {boolean} online
 */
cwc.ui.gapi.Account.prototype.setOnlineStatus = function(online) {
  this.online = online;
};


/**
 * Sets authentication to true.
 */
cwc.ui.gapi.Account.prototype.setAuthenticated = function() {
  this.setAuthentication(true);
};


/**
 * Sets authentication to false.
 */
cwc.ui.gapi.Account.prototype.setUnauthenticated = function() {
  this.setAuthentication(false);
};


/**
 * Sets the authentication.
 * @param {boolean} authenticated
 */
cwc.ui.gapi.Account.prototype.setAuthentication = function(authenticated) {
  let menuBarInstance = this.helper.getInstance('menuBar');
  if (menuBarInstance) {
    menuBarInstance.setAuthenticated(authenticated);
  }

  if (!authenticated) {
    this.accessToken = '';
  }
  this.authenticated = authenticated;

  let navigationInstance = this.helper.getInstance('navigation');
  if (navigationInstance) {
    navigationInstance.enableOpenGoogleDriveFile(authenticated);
    navigationInstance.enableSaveGoogleDriveFile(authenticated);
  }
  this.handleClassroomAuthentication_(authenticated);
};


/**
 * @param {Object} options Contains options for http request, listed below:
 *   - content: data to send with request.
 *   - header: Object of optional headers.
 *   - method: http method type (GET, POST, PUT, etc.)
 *   - param: GET or POST parameters.
 *   - path: endpoint to hit on googleapis.com (default domain).
 *   - subdomain: specifies googleapis.com subdomain.
 *   - token: Authorization bearer token.
 *   - raw: if true opts.path becomes the entire URI.
 * @param {function(?)=} callback Called when http request completes.
 * @return {Promise} to wait on the completion of the http request.
 */
cwc.ui.gapi.Account.prototype.request = function(options, callback) {
  let ignoreErrors = options.ignore_errors || false;
  let params = options.params || {};
  let subdomain = 'www';
  if (options.subdomain && typeof(options.subdomain) === 'string' &&
    options.subdomain.match(/^[0-9a-zA-Z]+$/)) {
    subdomain = options.subdomain;
  }

  let uri = subdomain + '.googleapis.com';
  let url = goog.Uri.create('https', null, uri, null, options.path);
  if (options.raw) {
    url = new goog.Uri(options.path);
  }
  let method = options.method || 'GET';
  let content = options.content;
  let token = options.token || this.accessToken || '';

  for (let i in params) {
    if (Object.prototype.hasOwnProperty.call(params, i)) {
      url.setParameterValue(i, params[i]);
    }
  }

  let headers = new Map(Object.entries(options.header || {}));
  headers.set('Authorization', 'Bearer ' + token);
  headers.set('X-JavaScript-User-Agent', 'Coding with Chrome');

  return new Promise((resolve, reject) => {
      let handleRequest = (function() {
          let xhrRepsonseEvent = (event) => {
              this.handleXhrResponse(event, (response) => {
                if (callback) {
                  callback(response);
                }
                resolve(response);
              });
          };

          let xhrErrorEvent = (event) => {
            if (!ignoreErrors) {
              this.handleXhrError(event);
            }
            reject(event);
          };

          let xhrTimeoutEvent = (event) => {
            if (!ignoreErrors) {
              this.handleXhrTimeout(event);
            }
            reject(event);
          };

          /** @type {goog.net.XhrIo} */
          let xhr = new goog.net.XhrIo();
          goog.events.listen(xhr, goog.net.EventType.COMPLETE, xhrRepsonseEvent,
              false, this);
          goog.events.listen(xhr, goog.net.EventType.ERROR, xhrErrorEvent,
              false, this);
          goog.events.listen(xhr, goog.net.EventType.TIMEOUT, xhrTimeoutEvent,
              false, this);

          this.log_.info('Request: ' + method + ' ' + url);
          xhr.send(url, method, content, headers);
      }).bind(this);

      if (!this.authenticated) {
          this.authenticate(handleRequest);
      } else {
          handleRequest();
      }
  });
};


/**
 * Handles the XHR response.
 * @param {Event} e
 * @param {function(?)=} callback
 */
cwc.ui.gapi.Account.prototype.handleXhrResponse = function(e, callback) {
  /** @type {EventTarget|goog.net.XhrIo} */
  let xhr = e.target;
  let response = '';

  if (xhr.isSuccess()) {
    let rawResponse = xhr.getResponseText();
    try {
      response = JSON.parse(rawResponse);
    } catch (error) {
      response = rawResponse;
    }
    this.log_.info('Handle XHR response:', response);
    if (goog.isFunction(callback)) {
      callback(response);
    }
  } else {
    this.log_.error('XHR response was not successful:', xhr);
  }
};


/**
 * Handles Xhr errors.
 * @param {Event} event
 */
cwc.ui.gapi.Account.prototype.handleXhrError = function(event) {
  this.helper.showError('Xhr request error!');
  this.log_.error(event);
};


/**
 * Handles Xhr timeout.
 * @param {Event} event
 */
cwc.ui.gapi.Account.prototype.handleXhrTimeout = function(event) {
  this.helper.showError('Xhr request timeout!');
  this.log_.error(event);
};


/**
 * Handles authentication and store access.
 * @param {string=} access_token
 * @private
 */
cwc.ui.gapi.Account.prototype.handleAuthentication_ = function(access_token) {
  if (access_token) {
    this.accessToken = access_token;
    this.setAuthenticated();
    this.log_.info('Access token: ' + this.accessToken);
    this.requestUserInfo();
    this.helper.showSuccess('Successful authenticated...');
  } else {
    this.setUnauthenticated();
    let errorMsg = chrome.runtime.lastError.message;
    this.helper.showError('Authentication failed: ' + errorMsg);
  }
};


/**
 * @param {boolean} authenticated
 */
cwc.ui.gapi.Account.prototype.handleClassroomAuthentication_ = function(
    authenticated) {
  let navigationInstance = this.helper.getInstance('navigation');
  if (!navigationInstance) {
    return;
  }
  if (authenticated) {
    this.request({
      ignore_errors: true,
      subdomain: 'classroom',
      path: '/v1/courses',
      params: {
        'studentId': 'me',
      },
    }).then((response) => {
      navigationInstance.enableOpenGoogleClassroom(
        Object.keys(response).length > 0);
    }, () => {
      navigationInstance.enableOpenGoogleClassroom(false);
    });
  } else {
    navigationInstance.enableOpenGoogleClassroom(false);
  }
};


/**
 * @private
 */
cwc.ui.gapi.Account.prototype.handleOnlineStatus_ = function() {
  this.setOnlineStatus(window.navigator.onLine);
};
