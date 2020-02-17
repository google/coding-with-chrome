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

import { EventHandler } from './EventHandler';
import { EventType } from './EventType';

describe('EventHandler', function() {
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

  it('constructor (default)', function() {
    expect(typeof new EventHandler()).toEqual('object');
    expect(typeof new EventHandler(null)).toEqual('object');
  });

  it('.name', function() {
    expect(testEventHandler.name).toEqual(name);
  });

  it('.prefix', function() {
    expect(testEventHandler.prefix).toEqual(prefix);
  });

  it('.listen() : listenerKey', function() {
    const Key = testEventHandler.listen(target, EventType.CLICK, listener.test);
    expect(Key).toEqual(testEventHandler.getLength());
    const Key2 = testEventHandler.listen(
      target,
      EventType.CLICK,
      listener.test
    );
    expect(Key2).toEqual(testEventHandler.getLength());
  });

  it('.listen()', function() {
    spyOn(listener, 'test').calls.reset();
    testEventHandler.listen(target, EventType.CLICK, listener.test);
    target.click();
    expect(listener.test).toHaveBeenCalled();
  });

  it('.listenOnce()', function() {
    spyOn(listener, 'test').calls.reset();
    testEventHandler.listenOnce(target, EventType.CLICK, listener.test);
    target.click();
    target.click();
    expect(listener.test).toHaveBeenCalledTimes(1);
  });

  it('.unlisten()', function() {
    spyOn(listener, 'test').calls.reset();
    const testEvent = testEventHandler.listen(
      target,
      EventType.CLICK,
      listener.test
    );
    target.click();
    testEventHandler.unlisten(testEvent);
    target.click();
    expect(listener.test).toHaveBeenCalledTimes(1);
  });

  it('.unlisten() - Error', function() {
    expect(() => {
      testEventHandler.unlisten(Math.random());
    }).toThrowError(/Unknown listener key/);
  });
});

describe('EventHandler with scope', function() {
  const name = 'Test EventHandler';
  const prefix = 'test-';
  const testEventHandler = new EventHandler(name, prefix, self);
  const target = document.createElement('div');
  const listener = {
    test: () => {
      return 1;
    }
  };

  it('.listen() : listenerKey', function() {
    const Key = testEventHandler.listen(target, EventType.CLICK, listener.test);
    expect(Key).toEqual(testEventHandler.getLength());
    const Key2 = testEventHandler.listen(
      target,
      EventType.CLICK,
      listener.test
    );
    expect(Key2).toEqual(testEventHandler.getLength());
  });

  it('.listen()', function() {
    spyOn(listener, 'test').calls.reset();
    testEventHandler.listen(target, EventType.CLICK, listener.test);
    target.click();
    expect(listener.test).toHaveBeenCalled();
  });

  it('.listenOnce()', function() {
    spyOn(listener, 'test').calls.reset();
    testEventHandler.listenOnce(target, EventType.CLICK, listener.test);
    target.click();
    target.click();
    expect(listener.test).toHaveBeenCalledTimes(1);
  });

  it('.unlisten()', function() {
    spyOn(listener, 'test').calls.reset();
    const testEvent = testEventHandler.listen(
      target,
      EventType.CLICK,
      listener.test
    );
    target.click();
    testEventHandler.unlisten(testEvent);
    target.click();
    expect(listener.test).toHaveBeenCalledTimes(1);
  });

  it('.unlisten() - Error', function() {
    expect(() => {
      testEventHandler.unlisten(Math.random());
    }).toThrowError(/Unknown listener key/);
  });
});
