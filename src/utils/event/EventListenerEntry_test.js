/**
 * @fileoverview Event Listener Entry unit tests.
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

import { EventListenerEntry } from './EventListenerEntry';

describe('ListenerEntry', function() {
  const target = document.createElement('div');
  const type = 'click';
  const listener = {
    test: () => {
      return 1;
    }
  };
  const options = { a: 1, b: 2 };
  const testListener = new EventListenerEntry(
    target,
    type,
    listener.test,
    options
  );

  it('Is valid object type', function() {
    expect(typeof testListener).toEqual('object');
  });

  it('.target by Id', function() {
    document.body.insertAdjacentHTML(
      'afterbegin',
      '<div id="test-listener-entry"></div>'
    );
    const testListenerTarget = new EventListenerEntry(
      'listener-entry',
      type,
      listener.test,
      options,
      'test-'
    );
    expect(testListenerTarget.target).toEqual(
      document.getElementById('test-listener-entry')
    );
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

  it('Invalid event target', function() {
    expect(() => {
      new EventListenerEntry(null, type, listener.test, options);
    }).toThrowError(/Undefined event target/);
  });

  it('Invalid element', function() {
    expect(() => {
      new EventListenerEntry('undefined', type, listener.test, options);
    }).toThrowError(/Unable to find element/);
  });

  it('Invalid function', function() {
    expect(() => {
      new EventListenerEntry(target, type, null, options);
    }).toThrowError(/Listener is not a function/);
  });
});
