/**
 * @fileoverview Event Handler unit tests.
 *
 * @license Copyright 2020 The Coding with Chrome Authors.
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

import { EventHandler, ListenerEntry } from './EventHandler';

describe('EventHandler: ListenerEntry', function() {
  const target = document.createElement('div');
  const type = 'click';
  const listener = {
    test: () => {
      return 1;
    }
  };
  const options = { a: 1, b: 2 };
  const testListener = new ListenerEntry(target, type, listener.test, options);

  it('Is valid object type', function() {
    expect(typeof testListener).toEqual('object');
  });

  it('.target', function() {
    expect(testListener.target).toEqual(target);
  });

  it('.type', function() {
    expect(testListener.type).toEqual(type);
  });

  it('.listener', function() {
    expect(testListener.listener).toEqual(listener.test);
  });

  it('.options', function() {
    expect(testListener.options).toEqual(options);
  });
});

describe('EventHandler: listen()', function() {
  const name = 'Test EventHandler';
  const prefix = 'test-';
  const testEventHandler = new EventHandler(name, prefix);
  const target = document.createElement('div');
  const listener = {
    test: () => {
      return 1;
    }
  };

  it('constructor', function() {
    expect(typeof testEventHandler).toEqual('object');
  });

  it('.name', function() {
    expect(testEventHandler.name).toEqual(name);
  });

  it('.prefix', function() {
    expect(testEventHandler.prefix).toEqual(prefix);
  });

  it('.listen() : listenerKey', function() {
    const Key = testEventHandler.listen(target, 'click', listener.test);
    expect(Key).toEqual(testEventHandler.getLength());
    const Key2 = testEventHandler.listen(target, 'click', listener.test);
    expect(Key2).toEqual(testEventHandler.getLength());
  });

  it('.listen()', function() {
    spyOn(listener, 'test');
    testEventHandler.listen(target, 'click', listener.test);
    target.click();
    expect(listener.test).toHaveBeenCalled();
  });
});
