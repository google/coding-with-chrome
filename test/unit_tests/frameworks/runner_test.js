/**
 * @fileoverview Framework Runner tests.
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
goog.require('cwc.framework.Runner');


describe('Framework: Runner', function() {
  let callback = function() {
    console.log('Runner ...');
  };
  let testFunction = function() {
    return 123;
  };
  let testAppWindow = {
    'postMessage': function() {},
  };

  it('constructor', function() {
    let framework = new cwc.framework.Runner();
    expect(typeof framework).toEqual('object');
    expect(framework.appOrigin).toEqual('');
    expect(framework.appWindow).toEqual(null);
    expect(typeof framework.commands['__handshake__']).toEqual('function');
    expect(typeof framework.commands['__ping__']).toEqual('function');
    expect(typeof framework.commands['__start__']).toEqual('function');
    expect(framework.callback_).toEqual(null);
    expect(framework.scope_).toEqual(null);
    expect(framework.monitor_).toEqual(null);
  });

  it('setCallback', function() {
    let framework = new cwc.framework.Runner();
    framework.setCallback(callback);
    expect(framework.callback_).toEqual(callback);
  });

  it('setScope', function() {
    let framework = new cwc.framework.Runner();
    framework.setScope(testFunction);
    expect(framework.scope_).toEqual(testFunction);
    framework.setCallback(callback);
    expect(function() {
      framework.setScope(testFunction);
    }).toThrow(new Error('Scope should be set before callback/monitor!'));
  });

  it('setMonitor', function() {
    let framework = new cwc.framework.Runner();
    framework.setMonitor(testFunction);
    expect(framework.monitor_).toEqual(testFunction);
  });

  it('addCommand', function() {
    let framework = new cwc.framework.Runner();
    framework.addCommand('test', testFunction);
    framework.addCommand('test2', testFunction);
    framework.addCommand('test3', null);
    framework.addCommand('', testFunction);
    expect(framework.commands['test']).toEqual(testFunction);
    expect(framework.commands['test2']).toEqual(testFunction);
    expect(typeof framework.commands['test3']).toEqual('undefined');
    expect(typeof framework.commands['']).toEqual('undefined');
  });

  it('enableMonitor', function() {
    let framework = new cwc.framework.Runner();
    framework.setAppOrigin('local');
    framework.setAppWindow(testAppWindow);
    expect(framework.enableMonitor('1\n2\n3\n', '1')).toEqual(true);
    expect(framework.enableMonitor('1\n2\n3\n', '2')).toEqual(true);
    expect(framework.enableMonitor('1\n2\n3\n', '3')).toEqual(true);
    expect(framework.enableMonitor('1\n2\n3\n', '4')).toEqual(false);
    expect(framework.enableMonitor('1\n2\n3\n', '1', 'test')).toEqual(true);
    expect(framework.enableMonitor('1\n2\n3\n', '2', 'test')).toEqual(true);
    expect(framework.enableMonitor('1\n2\n3\n', '3', 'test')).toEqual(true);
    expect(framework.enableMonitor('1\n2\n3\n', '4', 'test')).toEqual(false);
  });

  it('send', function() {
    let framework = new cwc.framework.Runner();
    expect(function() {
      framework.send('test', 'world');
    }).toThrow(
      new Error('Unable so send data!'));
    let messageCache = null;
    framework.setAppOrigin('local');
    framework.setAppWindow({
      'postMessage': function(data, origin) {
        messageCache = data;
        expect(origin).toEqual(framework.appOrigin);
      },
    });
    expect(framework.send('test', 'world'));
    expect(messageCache.command).toEqual('test');
    expect(messageCache.value).toEqual('world');
    expect(framework.send('test', 'world', 1));
  });

  it('handleMessage_', function() {
    let framework = new cwc.framework.Runner();
    let testEvent = {
      'source': 'appWindow',
      'origin': 'appOrigin',
      'data': {
        'command': 'hello',
        'value': 'world',
      },
    };
    expect(framework.handleMessage_).toThrow(
      new Error('Was not able to get browser event!'));
    expect(framework.appWindow).toEqual(null);
    expect(framework.appOrigin).toEqual('');
    expect(function() {
      framework.handleMessage_(testEvent);
    }).toThrow(new Error('Command hello is not defined!'));
    framework.addCommand('hello', function() {});
    expect(framework.handleMessage_(testEvent));
    expect(framework.appWindow).toEqual('appWindow');
    expect(framework.appOrigin).toEqual('appOrigin');
  });

  it('handleHandshake_', function() {
    let framework = new cwc.framework.Runner();
    framework.setAppOrigin('local');
    framework.setAppWindow(testAppWindow);
    let sendCache = null;
    framework.send = function(name, data) {
      sendCache = {
        'name': name,
        'data': data,
      };
    };
    expect(framework.handleHandshake_('123'));
    expect(sendCache.name).toEqual('__handshake__');
    expect(sendCache.data).toEqual('123');
  });

  it('handleStart_', function() {
    let framework = new cwc.framework.Runner();
    let callbackCache = null;
    framework.callback_ = function() {
      callbackCache = 1;
    };
    let monitorCache = null;
    framework.monitor_ = function() {
      monitorCache = 2;
    };
    expect(framework.handleStart_());
    expect(callbackCache).toEqual(1);
    expect(monitorCache).toEqual(2);
  });

  it('handlePing_', function() {
    let framework = new cwc.framework.Runner();
    framework.setAppOrigin('local');
    framework.setAppWindow(testAppWindow);
    let sendCache = null;
    framework.send = function(name, data) {
      sendCache = {
        'name': name,
        'data': data,
      };
    };
    expect(framework.handlePing_('123'));
    expect(sendCache.name).toEqual('__pong__');
    expect(sendCache.data.id).toEqual('123');
  });
});
