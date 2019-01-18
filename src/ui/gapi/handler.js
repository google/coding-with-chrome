/**
 * @fileoverview Google API Integration for the Coding with Chrome editor.
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
goog.provide('cwc.ui.gapi.Handler');

goog.require('cwc.ui.gapi.Account');
goog.require('cwc.ui.gapi.Classroom');
goog.require('cwc.ui.gapi.Cloud');
goog.require('cwc.ui.gapi.Drive');
goog.require('cwc.utils.Logger');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 */
cwc.ui.gapi.Handler = function(helper) {
  /** @type {string} */
  this.name = 'GAPI Handler';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {?cwc.ui.gapi.Account} */
  this.accountInstance = null;

  /** @type {?cwc.ui.gapi.Classroom} */
  this.classroomInstance = null;

  /** @type {?cwc.ui.gapi.Cloud} */
  this.cloudInstance = null;

  /** @type {?cwc.ui.gapi.Drive} */
  this.driveInstance = null;

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * @export
 */
cwc.ui.gapi.Handler.prototype.prepare = function() {
  this.log_.info('Preparing GAPI ...');
  this.accountInstance = new cwc.ui.gapi.Account(this.helper);
  this.accountInstance.prepare();
  this.classroomInstance = new cwc.ui.gapi.Classroom(this.helper);
  this.cloudInstance = new cwc.ui.gapi.Cloud(this.helper);
  this.driveInstance = new cwc.ui.gapi.Drive(this.helper);
};


/**
 * @export
 */
cwc.ui.gapi.Handler.prototype.authenticate = function() {
  if (this.accountInstance) {
    this.accountInstance.authenticate();
  }
};


/**
 * @export
 */
cwc.ui.gapi.Handler.prototype.deauthenticate = function() {
  if (this.accountInstance) {
    this.accountInstance.deauthenticate();
  }
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
cwc.ui.gapi.Handler.prototype.request = function(options, callback) {
  if (this.accountInstance) {
    return this.accountInstance.request(options, callback);
  }
};


/** @return {?cwc.ui.gapi.Account} */
cwc.ui.gapi.Handler.prototype.getAccount = function() {
  return this.accountInstance;
};


/** @return {?cwc.ui.gapi.Classroom} */
cwc.ui.gapi.Handler.prototype.getClassroom = function() {
  return this.classroomInstance;
};


/** @return {?cwc.ui.gapi.Cloud} */
cwc.ui.gapi.Handler.prototype.getCloud = function() {
  return this.cloudInstance;
};


/** @return {?cwc.ui.gapi.Drive} */
cwc.ui.gapi.Handler.prototype.getDrive = function() {
  return this.driveInstance;
};
