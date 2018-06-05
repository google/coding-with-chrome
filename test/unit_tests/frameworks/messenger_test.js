/**
 * @fileoverview Framework Messenger tests.
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
goog.require('cwc.framework.Messenger');


describe('Framework: Messenger', function() {
  let testFunction = function() {
    return 123;
  };
  let testAppWindow = {
    'postMessage': function() {},
  };

  it('constructor', function() {
    let framework = new cwc.framework.Messenger();
    expect(typeof framework).toEqual('object');
    expect(framework.appOrigin).toEqual('');
    expect(framework.appWindow).toEqual(null);
    expect(typeof framework.listener_['__exec__']).toEqual('function');
    expect(typeof framework.listener_['__gamepad__']).toEqual('function');
    expect(typeof framework.listener_['__handshake__']).toEqual('function');
    expect(typeof framework.listener_['__start__']).toEqual('function');
  });

  it('setListenerScope', function() {
    let framework = new cwc.framework.Messenger()
      .setListenerScope(testFunction);
    expect(framework.listenerScope_).toEqual(testFunction);
  });

  it('addListener', function() {
    let framework = new cwc.framework.Messenger();
    framework.addListener('test', testFunction, null);
    framework.addListener('test2', testFunction, null);
    framework.addListener('test3', null, null);
    framework.addListener('', testFunction, null);
    expect(framework.listener_['test']).toEqual(testFunction);
    expect(framework.listener_['test2']).toEqual(testFunction);
    expect(typeof framework.listener_['test3']).toEqual('undefined');
    expect(typeof framework.listener_['']).toEqual('undefined');
  });

  it('postMessage', function() {
    let framework = new cwc.framework.Messenger();
    let messageCache = null;
    framework.setAppOrigin('local');
    framework.setAppWindow({
      'postMessage': function(data, origin) {
        messageCache = data;
        expect(origin).toEqual(framework.appOrigin);
      },
    });
    expect(framework.postMessage('test', 'world'));
    expect(messageCache.name).toEqual('test');
    expect(messageCache.value).toEqual('world');
    expect(framework.postMessage('test', 'world', 1));
  });

  it('handleMessage_', function() {
    let framework = new cwc.framework.Messenger();
    let testEvent = {
      'source': {
        'postMessage': function() {},
      },
      'origin': 'appOrigin',
      'data': {
        'name': '__handshake__',
        'value': {
          'token': 'Hello World.',
        },
      },
    };
    expect(framework.handleMessage_).toThrow(
      new Error('Was not able to get browser event!'));
    expect(framework.appWindow).toEqual(null);
    expect(framework.appOrigin).toEqual('');
    framework.handleMessage_(testEvent);
    framework.addListener('hello', function() {});
    expect(framework.handleMessage_(testEvent));
    expect(framework.appWindow).toEqual(testEvent.source);
    expect(framework.appOrigin).toEqual('appOrigin');
  });

  it('handleHandshake_', function() {
    let framework = new cwc.framework.Messenger();
    framework.setAppOrigin('local');
    framework.setAppWindow(testAppWindow);
    let sendCache = null;
    framework.send = function(name, data) {
      sendCache = {
        'name': name,
        'data': data,
      };
    };
    expect(framework.handleHandshake_({'token': '123'}));
    expect(sendCache.name).toEqual('__handshake__');
    expect(sendCache.data.token).toEqual('123');
  });
});
