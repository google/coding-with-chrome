/**
 * @fileoverview Chrome externs.
 * @externs
 *
 * @license Copyright 2016 The Coding with Chrome Authors.
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


/** @type {Function} */
chrome.storage = function() {};

/** @type {Function} */
chrome.storage.local = function() {};

/** @type {Function} */
chrome.storage.local.get = function() {};

/** @type {Function} */
chrome.storage.local.set = function() {};

/** @type {Function} */
chrome.runtime.getManifest = function() {};

/** @type {Object} */
chrome.app.window = {};

/** @type {Function} */
chrome.app.window.get = function() {};

/** @type {Function} */
chrome.app.window.AppWindow = function() {};

/** @type {Function} */
chrome.browser = function() {};

/** @type {Function} */
chrome.browser.openTab = function() {};


/** @const */
chrome.bluetooth = {};

/** @type {Function} */
chrome.bluetooth.getDevices = function() {};

/** @type {Object} */
chrome.bluetooth.onAdapterStateChanged = {};

/** @type {Function} */
chrome.bluetooth.onAdapterStateChanged.addListener = function() {};

/** @type {Function} */
chrome.bluetooth.getAdapterState = function() {};

/** @type {Object} */
chrome.bluetooth.onDeviceAdded = {};

/** @type {Function} */
chrome.bluetooth.onDeviceAdded.addListener = function() {};

/** @type {Object} */
chrome.bluetooth.onDeviceChanged = {};

/** @type {Function} */
chrome.bluetooth.onDeviceChanged.addListener = function() {};

/** @type {Object} */
chrome.bluetooth.onDeviceRemoved = {};

/** @type {Function} */
chrome.bluetooth.onDeviceRemoved.addListener = function() {};


/** @const */
chrome.bluetoothSocket = {};

/** @type {Function} */
chrome.bluetoothSocket.close = function() {};

/** @type {Function} */
chrome.bluetoothSocket.connect = function() {};

/** @type {Function} */
chrome.bluetoothSocket.create = function() {};

/** @type {Function} */
chrome.bluetoothSocket.disconnect = function() {};

/** @type {Function} */
chrome.bluetoothSocket.setPaused = function() {};

/** @type {Function} */
chrome.bluetoothSocket.getInfo = function() {};

/** @type {Function} */
chrome.bluetoothSocket.getSockets = function() {};

/** @type {Function} */
chrome.bluetoothSocket.onReceive = function() {};

/** @type {Function} */
chrome.bluetoothSocket.onReceiveError = function() {};

/** @type {Function} */
chrome.bluetoothSocket.onReceive.addListener = function() {};

/** @type {Function} */
chrome.bluetoothSocket.onReceiveError.addListener = function() {};


/** @const */
chrome.contextMenus = {};

/** @type {Function} */
chrome.contextMenus.create = function() {};


/** @const */
chrome.serial = {};

/** @type {Function} */
chrome.serial.connect = function() {};

/** @type {Function} */
chrome.serial.disconnect = function() {};

/** @type {Function} */
chrome.serial.send = function() {};

/** @type {Function} */
chrome.serial.flush = function() {};

/** @type {Function} */
chrome.serial.getDevices = function() {};

/** @type {Function} */
chrome.serial.onReceive = function() {};

/** @type {Function} */
chrome.serial.onReceiveError = function() {};

/** @type {Function} */
chrome.serial.onReceive.addListener= function() {};

/** @type {Function} */
chrome.serial.onReceiveError.addListener= function() {};


/** @type {Function} */
chrome.system = function() {};

/** @type {Function} */
chrome.system.memory = function() {};

/** @type {Function} */
chrome.tts = function() {};

/** @type {Function} */
chrome.usb = function() {};

/** @type {Function} */
chrome.sockets = function() {};

/** @type {Function} */
chrome.tcp = function() {};

/** @type {Function} */
chrome.udp = function() {};

/** @type {Function} */
chrome.tcpServer = function() {};

/** @type {Function} */
chrome.manifest = function() {};

/** @type {Function} */
chrome.oauth2 = function() {};

/** @type {Function} */
chrome.key = function() {};

/** @type {Object} */
chrome.fileSystem = {};

/** @type {Function} */
chrome.fileSystem.chooseEntry = function() {};

/** @type {Object} */
chrome.identity = {};

/** @type {Function} */
chrome.identity.getAuthToken = function() {};

/** @type {Function} */
chrome.identity.removeCachedAuthToken = function() {};


/**
 * @constructor
 * @extends {Element}
 */
let Webview = function() {};

/** @type {Function} */
Webview.prototype.stop = function() {};

/** @type {Function} */
Webview.prototype.reload = function() {};

/** @type {Function} */
Webview.prototype.terminate = function() {};


/**
 * @constructor
 */
let AppWindow = function() {};
