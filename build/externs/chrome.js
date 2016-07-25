/**
 * @fileoverview Chrome externs.
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
chrome.system.memory = function() {};

/** @type {Function} */
chrome.storage.local = function() {};

/** @type {Function} */
chrome.storage.local.get = function() {};

/** @type {Function} */
chrome.runtime.getManifest = function() {};

/** @type {Function} */
chrome.app.window.get = function() {};

/** @type {Function} */
chrome.bluetooth = function() {};

/** @type {Function} */
chrome.bluetooth.getDevices = function() {};

/** @type {Function} */
chrome.bluetooth.onAdapterStateChanged.addListener = function() {};

/** @type {Function} */
chrome.bluetooth.getAdapterState = function() {};

/** @type {Function} */
chrome.bluetooth.onDeviceAdded.addListener = function() {};

/** @type {Function} */
chrome.bluetooth.onDeviceChanged.addListener = function() {};

/** @type {Function} */
chrome.bluetooth.onDeviceRemoved.addListener = function() {};

/** @type {Function} */
chrome.bluetoothSocket = function() {};

/** @type {Function} */
chrome.bluetoothSocket.close = function() {};

/** @type {Function} */
chrome.bluetoothSocket.connect = function() {};

/** @type {Function} */
chrome.bluetoothSocket.create = function() {};

/** @type {Function} */
chrome.bluetoothSocket.disconnect = function() {};

/** @type {Function} */
chrome.bluetoothSocket.getInfo = function() {};

/** @type {Function} */
chrome.bluetoothSocket.getSockets = function() {};

/** @type {Function} */
chrome.bluetoothSocket.onReceive.addListener = function() {};

/** @type {Function} */
chrome.bluetoothSocket.onReceiveError.addListener = function() {};

/** @type {Function} */
chrome.serial = function() {};

/** @type {Function} */
chrome.getDevices = function() {};

/** @type {Function} */
chrome.serial.onReceive.addListener= function() {};

/** @type {Function} */
chrome.serial.onReceiveError.addListener= function() {};

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

/** @type {Function} */
chrome.fileSystem.chooseEntry = function() {};
