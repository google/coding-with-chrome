/**
 * @fileoverview Storage tests.
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
goog.require('cwc.utils.Storage');
goog.require('cwc.utils.StorageCustom');


describe('Storage', function() {
  it('constructor', function() {
    expect(typeof cwc.utils.Storage).toEqual('function');
  });

  it('getStorageType', function() {
    expect(cwc.utils.Storage.getStorageType() !== '').toBe(true);
  });
});


describe('Storage - Default', function() {
  let storage = new cwc.utils.Storage();
  let testItem = '__cwc__test__' + Math.floor(Math.random() * 1000000);
  let testValue = Math.floor(Math.random() * 1000000);
  let testGroup = 'group_12345';

  it('constructor', function() {
    expect(typeof storage).toEqual('object');
  });

  it('prepare', function() {
    let callback = function(storageObject) {
      expect(typeof storageObject).toEqual('object');
    };
    storage.prepare(callback);
  });

  it('set', function() {
    storage.set(testItem, testValue);
    storage.set(testItem, testValue + 1, testGroup);
  });

  it('get', function() {
    storage.set(testItem, testValue);
    storage.set(testItem, testValue + 1, testGroup);
    expect(storage.get(testItem)).toEqual(String(testValue));
    expect(storage.get(testItem, testGroup)).toEqual(String(testValue + 1));
  });

  it('remove', function() {
    storage.set(testItem, testValue);
    storage.set(testItem, testValue + 1, testGroup);
    storage.remove(testItem);
    expect(storage.get(testItem)).toEqual(null);
    expect(storage.get(testItem, testGroup)).toEqual(String(testValue + 1));
    storage.remove(testItem, testGroup);
    expect(storage.get(testItem, testGroup)).toEqual(null);
  });
});


describe('Storage - Custom', function() {
  let testValue = Math.floor(Math.random() * 1000000);
  let customStorage = new cwc.utils.StorageCustom();

  it('constructor', function() {
    expect(typeof customStorage).toEqual('object');
  });

  it('set', function() {
    customStorage.set({'123': testValue});
    customStorage.set({'321': testValue + 1});
  });

  it('get', function() {
    customStorage.set({'123': testValue});
    customStorage.set({'321': testValue + 1});
    expect(customStorage.get('123')['123']).toEqual(testValue);
    expect(customStorage.get('321')['321']).toEqual(testValue + 1);
  });

  it('clear', function() {
    customStorage.set({'123': testValue});
    expect(customStorage.get('123')['123']).toEqual(testValue);
    customStorage.clear();
    expect(customStorage.get('123')['123']).toBe(undefined);
  });
});


describe('Storage - Chrome Mode', function() {
  // Emulate Chrome storage
  let customStorage = new cwc.utils.StorageCustom();
  chrome = chrome || {};
  chrome.storage = {};
  chrome.storage.local = {};
  chrome.storage.local.get = customStorage.get.bind(customStorage);
  chrome.storage.local.set = customStorage.set.bind(customStorage);

  // Storage
  let storage = new cwc.utils.Storage();
  let testItem = '__cwc__test__' + Math.floor(Math.random() * 1000000);
  let testValue = Math.floor(Math.random() * 1000000);
  let testGroup = 'group_12345';

  it('constructor', function() {
    expect(typeof storage).toEqual('object');
  });

  it('prepare', function() {
    let callback = function(storageObject) {
      expect(typeof storageObject).toEqual('object');
    };
    storage.prepare(callback);
  });

  it('set', function() {
    storage.set(testItem, testValue);
    storage.set(testItem, testValue + 1, testGroup);
  });

  it('get', function() {
    storage.set(testItem, testValue);
    storage.set(testItem, testValue + 1, testGroup);
    expect(storage.get(testItem)).toEqual(String(testValue));
    expect(storage.get(testItem, testGroup)).toEqual(String(testValue + 1));
  });

  it('remove', function() {
    storage.set(testItem, testValue);
    storage.set(testItem, testValue + 1, testGroup);
    storage.remove(testItem);
    expect(storage.get(testItem)).toEqual(null);
    expect(storage.get(testItem, testGroup)).toEqual(String(testValue + 1));
    storage.remove(testItem, testGroup);
    expect(storage.get(testItem, testGroup)).toEqual(null);
  });

  it('loadChromeStorage', function() {
    customStorage.clear();
    customStorage.set({
      cwc__storage____default______cwc__test__213809: testValue},
      function() {
        storage.loadChromeStorage(null, function() {
          expect(storage.get('__cwc__test__213809')).toEqual(String(testValue));
        });
      });
  });
});
