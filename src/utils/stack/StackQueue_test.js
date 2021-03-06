/**
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
 */

/**
 * @author mbordihn@google.com (Markus Bordihn)
 *
 * @fileoverview Stack Queue unit tests.
 */

import { StackQueue } from './StackQueue';

describe('StackQueue', function () {
  let stackQueueTest = new StackQueue(false);
  let counter = 0;
  const counterFunc = function () {
    counter = counter + 1;
  };

  it('constructor', function () {
    expect(typeof stackQueueTest).toEqual('object');
  });

  it('clear()', function (done) {
    stackQueueTest = new StackQueue(false);
    expect(stackQueueTest.getSize()).toEqual(0);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addCommand(counterFunc);
    expect(stackQueueTest.getSize()).toEqual(5);
    stackQueueTest.clear();
    expect(stackQueueTest.getSize()).toEqual(0);
    done();
  });

  it('getNext()', function (done) {
    stackQueueTest = new StackQueue(false);
    expect(stackQueueTest.getNext()).toEqual(null);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addCommand(counterFunc);
    expect(stackQueueTest.getNext()).not.toEqual(null);
    expect(stackQueueTest.getNext()).not.toEqual(null);
    expect(stackQueueTest.getNext()).not.toEqual(null);
    expect(stackQueueTest.getNext()).toEqual(null);
    done();
  });

  it('getSize()', function (done) {
    stackQueueTest = new StackQueue(false);
    expect(stackQueueTest.getSize()).toEqual(0);
    stackQueueTest.addCommand(counterFunc);
    expect(stackQueueTest.getSize()).toEqual(1);
    stackQueueTest.addCommand(counterFunc);
    expect(stackQueueTest.getSize()).toEqual(2);
    stackQueueTest.addCommand(counterFunc);
    expect(stackQueueTest.getSize()).toEqual(3);
    stackQueueTest.addCommand(counterFunc);
    expect(stackQueueTest.getSize()).toEqual(4);
    stackQueueTest.addCommand(counterFunc);
    expect(stackQueueTest.getSize()).toEqual(5);
    stackQueueTest.clear();
    expect(stackQueueTest.getSize()).toEqual(0);
    done();
  });

  it('handleQueue_()', function (done) {
    stackQueueTest = new StackQueue(false);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.handleQueue_();
    stackQueueTest.handleQueue_();
    done();
  });
});

describe('StackQueue (autostart)', function () {
  let stackQueueTest = new StackQueue();
  let counter = 0;
  let timestamp;
  const counterFunc = function () {
    counter = counter + 1;
  };
  const counterFuncPromise = function () {
    return new Promise((resolve) => {
      counter = counter + 1;
      resolve();
    });
  };

  it('constructor', function () {
    expect(typeof stackQueueTest).toEqual('object');
  });

  it('start()', function () {
    stackQueueTest = new StackQueue();
    counter = 0;
    expect(counter).toEqual(0);
    stackQueueTest.start();
    expect(counter).toEqual(0);
  });

  it('addCommand()', function (done) {
    stackQueueTest = new StackQueue();
    stackQueueTest.start();
    counter = 0;
    expect(counter).toEqual(0);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addCommand(function () {
      expect(counter).toEqual(5);
      done();
    });
  });

  it('addPromise()', function (done) {
    stackQueueTest = new StackQueue();
    stackQueueTest.start();
    counter = 0;
    expect(counter).toEqual(0);
    stackQueueTest.addPromise(counterFuncPromise);
    stackQueueTest.addPromise(counterFuncPromise);
    stackQueueTest.addPromise(counterFuncPromise);
    stackQueueTest.addPromise(counterFuncPromise);
    stackQueueTest.addPromise(counterFuncPromise);
    stackQueueTest.addCommand(function () {
      expect(counter).toEqual(5);
      done();
    });
  });

  it('addPromiseRaiseError()', function (done) {
    stackQueueTest = new StackQueue();
    stackQueueTest.start();
    counter = 0;
    expect(counter).toEqual(0);
    stackQueueTest.addPromiseRaiseError(counterFuncPromise);
    stackQueueTest.addPromiseRaiseError(counterFuncPromise);
    stackQueueTest.addPromiseRaiseError(counterFuncPromise);
    stackQueueTest.addPromiseRaiseError(counterFuncPromise);
    stackQueueTest.addPromiseRaiseError(counterFuncPromise);
    stackQueueTest.addCommand(function () {
      expect(counter).toEqual(5);
      done();
    });
  });

  it('addDelay()', function (done) {
    stackQueueTest = new StackQueue();
    counter = 0;
    timestamp = Date.now();
    expect(counter).toEqual(0);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addCommand(function () {
      expect(counter).toEqual(1);
    });
    stackQueueTest.addDelay(50);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addCommand(function () {
      expect(counter).toEqual(2);
    });
    stackQueueTest.addDelay(50);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addCommand(function () {
      expect(counter).toEqual(3);
    });
    stackQueueTest.addDelay(50);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addCommand(function () {
      expect(counter).toEqual(4);
    });
    stackQueueTest.addCommand(function () {
      expect(counter).toEqual(4);
      expect(Date.now() - timestamp >= 150).toBe(true);
      done();
    });
    expect(counter).toEqual(1);
  });

  it('stop()', function (done) {
    stackQueueTest = new StackQueue();
    counter = 4;
    timestamp = Date.now();
    expect(counter).toEqual(4);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addCommand(function () {
      expect(counter).toEqual(5);
    });
    stackQueueTest.addDelay(100);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addCommand(function () {
      expect(counter).toEqual(6);
    });
    stackQueueTest.addDelay(100);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addCommand(function () {
      expect(false);
    });
    stackQueueTest.addDelay(100);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addCommand(function () {
      expect(false);
    });
    stackQueueTest.stop(function () {
      expect(counter).toEqual(5);
      done();
    });
  });
});

describe('StackQueue (no autostart)', function () {
  let stackQueueTest = new StackQueue(false);
  let counter = 0;
  let timestamp = 0;
  const counterFunc = function () {
    counter = counter + 1;
  };

  it('constructor', function () {
    expect(typeof stackQueueTest).toEqual('object');
  });

  it('addCommand()', function (done) {
    stackQueueTest = new StackQueue(false);
    counter = 0;
    expect(counter).toEqual(0);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addCommand(counterFunc);
    expect(counter).toEqual(0);
    done();
  });

  it('start()', function (done) {
    stackQueueTest = new StackQueue(false);
    counter = 0;
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addCommand(counterFunc);
    expect(counter).toEqual(0);
    stackQueueTest.start();
    stackQueueTest.addCommand(function () {
      expect(counter).toEqual(5);
      done();
    });
  });

  it('addDelay()', function (done) {
    stackQueueTest = new StackQueue(false);
    counter = 0;
    timestamp = Date.now();
    expect(counter).toEqual(0);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addCommand(function () {
      expect(counter).toEqual(1);
    });
    stackQueueTest.addDelay(50);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addCommand(function () {
      expect(counter).toEqual(2);
    });
    stackQueueTest.addDelay(100);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addCommand(function () {
      expect(counter).toEqual(3);
    });
    stackQueueTest.addDelay(50);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addCommand(function () {
      expect(counter).toEqual(4);
    });
    stackQueueTest.addCommand(function () {
      expect(counter).toEqual(4);
      expect(Date.now() - timestamp >= 200).toBe(true);
      done();
    });
    stackQueueTest.start();
  });

  it('stop()', function (done) {
    stackQueueTest = new StackQueue(false);
    counter = 4;
    expect(counter).toEqual(4);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addDelay(100);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addDelay(100);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.addDelay(100);
    stackQueueTest.addCommand(counterFunc);
    stackQueueTest.start();
    stackQueueTest.stop(function () {
      expect(counter).toEqual(5);
      done();
    });
    expect(counter).toEqual(5);
  });
});
