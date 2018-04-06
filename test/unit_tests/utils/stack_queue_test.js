/**
 * @fileoverview StackQueue tests.
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
goog.require('cwc.utils.StackEntry');
goog.require('cwc.utils.StackQueue');
goog.require('cwc.utils.StackType');


describe('StackType', function() {
  it('enum', function() {
    expect(typeof cwc.utils.StackType).toEqual('object');
  });


  it('CMD', function() {
    expect(cwc.utils.StackType.CMD).toEqual('cmd');
  });

  it('DELAY', function() {
    expect(cwc.utils.StackType.DELAY).toEqual('delay');
  });
});


describe('StackEntry', function() {
  let type = cwc.utils.StackType.CMD;
  let func = function(data) {
    return data['a'] + data['b'];
  };
  let value = {a: 11, b: 12};
  let callback = function(test) {
    return test;
  };
  let stackEntry = new cwc.utils.StackEntry(type, func, value, callback);

  it('constructor', function() {
    expect(typeof stackEntry).toEqual('object');
  });

  it('getCallback', function() {
    expect(stackEntry.getCallback()).toEqual(callback);
  });

  it('getFunc', function() {
    expect(stackEntry.getFunc()).toEqual(func);
  });

  it('getType', function() {
    expect(stackEntry.getType()).toEqual(type);
  });

  it('getValue', function() {
    expect(stackEntry.getValue()).toEqual(value);
  });
});


describe('StackQueue (autostart)', function() {
  let stackQueue = new cwc.utils.StackQueue();
  let counter = 0;
  let timestamp;
  let counterFunc = function() {
    counter = counter + 1;
  };

  it('constructor', function() {
    expect(typeof stackQueue).toEqual('object');
  });

  it('start', function() {
    stackQueue = new cwc.utils.StackQueue();
    counter = 0;
    expect(counter).toEqual(0);
    stackQueue.start();
    expect(counter).toEqual(0);
  });

  it('addCommand', function(done) {
    stackQueue = new cwc.utils.StackQueue();
    stackQueue.start();
    counter = 0;
    expect(counter).toEqual(0);
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(function() {
      expect(counter).toEqual(5);
      done();
    });
  });

  it('addDelay', function(done) {
    stackQueue = new cwc.utils.StackQueue();
    counter = 0;
    timestamp = Date.now();
    expect(counter).toEqual(0);
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(function() {
      expect(counter).toEqual(1);
    });
    stackQueue.addDelay(50);
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(function() {
      expect(counter).toEqual(2);
    });
    stackQueue.addDelay(50);
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(function() {
      expect(counter).toEqual(3);
    });
    stackQueue.addDelay(50);
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(function() {
      expect(counter).toEqual(4);
    });
    stackQueue.addCommand(function() {
      expect(counter).toEqual(4);
      expect(Date.now() - timestamp >= 150).toBe(true);
      done();
    });
    expect(counter).toEqual(1);
  });

  it('stop', function(done) {
    stackQueue = new cwc.utils.StackQueue();
    counter = 4;
    timestamp = Date.now();
    expect(counter).toEqual(4);
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(function() {
      expect(counter).toEqual(5);
    });
    stackQueue.addDelay(100);
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(function() {
      expect(counter).toEqual(6);
    });
    stackQueue.addDelay(100);
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(function() {
      expect(false);
    });
    stackQueue.addDelay(100);
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(function() {
      expect(false);
    });
    stackQueue.stop(function() {
      expect(counter).toEqual(5);
      done();
    });
  });
});


describe('StackQueue (no autostart)', function() {
  let stackQueue = new cwc.utils.StackQueue(false);
  let counter = 0;
  let timestamp = 0;
  let counterFunc = function() {
    counter = counter + 1;
  };

  it('constructor', function() {
    expect(typeof stackQueue).toEqual('object');
  });

  it('addCommand', function(done) {
    stackQueue = new cwc.utils.StackQueue(false);
    counter = 0;
    expect(counter).toEqual(0);
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(counterFunc);
    expect(counter).toEqual(0);
    done();
  });

  it('start', function(done) {
    stackQueue = new cwc.utils.StackQueue(false);
    counter = 0;
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(counterFunc);
    expect(counter).toEqual(0);
    stackQueue.start();
    stackQueue.addCommand(function() {
      expect(counter).toEqual(5);
      done();
    });
  });

  it('addDelay', function(done) {
    stackQueue = new cwc.utils.StackQueue(false);
    counter = 0;
    timestamp = Date.now();
    expect(counter).toEqual(0);
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(function() {
      expect(counter).toEqual(1);
    });
    stackQueue.addDelay(50);
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(function() {
      expect(counter).toEqual(2);
    });
    stackQueue.addDelay(100);
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(function() {
      expect(counter).toEqual(3);
    });
    stackQueue.addDelay(50);
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(function() {
      expect(counter).toEqual(4);
    });
    stackQueue.addCommand(function() {
      expect(counter).toEqual(4);
      expect(Date.now() - timestamp >= 200).toBe(true);
      done();
    });
    stackQueue.start();
  });

  it('stop', function(done) {
    stackQueue = new cwc.utils.StackQueue(false);
    counter = 4;
    expect(counter).toEqual(4);
    stackQueue.addCommand(counterFunc);
    stackQueue.addDelay(100);
    stackQueue.addCommand(counterFunc);
    stackQueue.addDelay(100);
    stackQueue.addCommand(counterFunc);
    stackQueue.addDelay(100);
    stackQueue.addCommand(counterFunc);
    stackQueue.start();
    stackQueue.stop(function() {
      expect(counter).toEqual(5);
      done();
    });
    expect(counter).toEqual(5);
  });
});
