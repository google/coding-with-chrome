/**
 * @fileoverview Stack Entry unit tests.
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

import { StackType } from './StackType';
import { StackEntry } from './StackEntry';

describe('StackEntry: CMD', function() {
  const type = StackType.CMD;
  const func = function(data) {
    return data['a'] + data['b'];
  };
  const stackEntry = new StackEntry(type, func);

  it('Is valid object type', function() {
    expect(typeof stackEntry).toEqual('object');
  });

  it('.getCallback()', function() {
    expect(stackEntry.getCallback()).toEqual(undefined);
  });

  it('.getFunc()', function() {
    expect(stackEntry.getFunc()).toEqual(func);
  });

  it('.getType()', function() {
    expect(stackEntry.getType()).toEqual(type);
  });

  it('.getValue()', function() {
    expect(stackEntry.getValue()).toEqual('');
  });
});

describe('StackEntry: DELAY', function() {
  const type = StackType.DELAY;
  const value = Math.random();
  const stackEntry = new StackEntry(type, null, value);

  it('Is valid object type', function() {
    expect(typeof stackEntry).toEqual('object');
  });

  it('.getCallback()', function() {
    expect(stackEntry.getCallback()).toEqual(undefined);
  });

  it('.getFunc()', function() {
    expect(stackEntry.getFunc()).toEqual(null);
  });

  it('.getType()', function() {
    expect(stackEntry.getType()).toEqual(type);
  });

  it('.getValue()', function() {
    expect(stackEntry.getValue()).toEqual(value);
  });
});

describe('StackEntry: PROMISE', function() {
  const type = StackType.PROMISE;
  const func = function(data) {
    return data['a'] + data['b'];
  };
  const value = Math.random();
  const callback = function(test) {
    return test;
  };
  const stackEntry = new StackEntry(type, func, value, callback);

  it('Is valid object type', function() {
    expect(typeof stackEntry).toEqual('object');
  });

  it('.getCallback()', function() {
    expect(stackEntry.getCallback()).toEqual(callback);
  });

  it('.getFunc()', function() {
    expect(stackEntry.getFunc()).toEqual(func);
  });

  it('.getType()', function() {
    expect(stackEntry.getType()).toEqual(type);
  });

  it('.getValue()', function() {
    expect(stackEntry.getValue()).toEqual(value);
  });
});

describe('StackEntry: Unknown', function() {
  const type = '';
  const stackEntry = new StackEntry(type);

  it('Is valid object type', function() {
    expect(typeof stackEntry).toEqual('object');
  });

  it('.getCallback()', function() {
    expect(stackEntry.getCallback()).toEqual(undefined);
  });

  it('.getFunc()', function() {
    expect(stackEntry.getFunc()).toEqual(undefined);
  });

  it('.getType()', function() {
    expect(stackEntry.getType()).toEqual(type);
  });

  it('.getValue()', function() {
    expect(stackEntry.getValue()).toEqual('');
  });
});
