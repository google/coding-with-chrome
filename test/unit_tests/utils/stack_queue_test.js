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

  var type = cwc.utils.StackType.CMD;
  var func = function(data) {return data['a'] + data['b'];};
  var value = {a: 11, b: 12};
  var name = 'Test';
  var stackEntry = new cwc.utils.StackEntry(type, func, value, name);

  it('constructor', function() {
    expect(typeof stackEntry).toEqual('object');
  });

  it('getType', function() {
    expect(stackEntry.getType()).toEqual(type);
  });

  it('getFunc', function() {
    expect(stackEntry.getFunc()).toEqual(func);
  });

  it('getValue', function() {
    expect(stackEntry.getValue()).toEqual(value);
  });

  it('getName', function() {
    expect(stackEntry.getName()).toEqual(name);
  });

});


describe('StackQueue (autostart)', function() {

  var stackQueue = new cwc.utils.StackQueue();
  var counter = 0;
  var counterFunc = function() {
    counter = counter + 1;
  }.bind(this);

  it('constructor', function() {
    expect(typeof stackQueue).toEqual('object');
  });

  it('start', function() {
    expect(counter).toEqual(0);
    stackQueue.start();
    expect(counter).toEqual(0);
  });

  it('addCommand', function(done) {
    expect(counter).toEqual(0);
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(counterFunc);
    window.setTimeout(function() {
      expect(counter).toEqual(5);
      done();
    }, 50);
  });

  it('addDelay', function(done) {
    var timeTests = function() {
      window.setTimeout(function() {
        expect(counter).toEqual(1);
      }, 50);
      window.setTimeout(function() {
        expect(counter).toEqual(2);
      }, 150);
      window.setTimeout(function() {
        if (counter == 3) {
          expect(counter).toEqual(3);
        } else {
          window.setTimeout(function() {
            expect(counter).toEqual(3);
          }, 50);
        }
      }, 250);
      window.setTimeout(function() {
        if (counter == 4) {
          expect(counter).toEqual(4);
          done();
        } else {
          window.setTimeout(function() {
            expect(counter).toEqual(4);
            done();
          }, 75);
        }
      }, 350);
    }.bind(this);

    counter = 0;
    expect(counter).toEqual(0);
    stackQueue.addCommand(timeTests);
    stackQueue.addCommand(counterFunc);
    stackQueue.addDelay(100);
    stackQueue.addCommand(counterFunc);
    stackQueue.addDelay(100);
    stackQueue.addCommand(counterFunc);
    stackQueue.addDelay(100);
    stackQueue.addCommand(counterFunc);
    expect(counter).toEqual(1);
  });

  it('stop', function(done) {
    expect(counter).toEqual(4);
    stackQueue.addCommand(counterFunc);
    stackQueue.addDelay(100);
    stackQueue.addCommand(counterFunc);
    stackQueue.addDelay(100);
    stackQueue.addCommand(counterFunc);
    stackQueue.addDelay(100);
    stackQueue.addCommand(counterFunc);
    stackQueue.stop();
    expect(counter).toEqual(5);
    window.setTimeout(function() {
      expect(counter).toEqual(5);
      done();
    }, 75);
  });

});



describe('StackQueue (no autostart)', function() {
  var stackQueue = new cwc.utils.StackQueue(true);
  var counter = 0;
  var counterFunc = function() {
    counter = counter + 1;
  }.bind(this);

  it('constructor', function() {
    expect(typeof stackQueue).toEqual('object');
  });

  it('addCommand', function(done) {
    expect(counter).toEqual(0);
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(counterFunc);
    stackQueue.addCommand(counterFunc);
    window.setTimeout(function() {
      expect(counter).toEqual(0);
      done();
    }, 100);
  });

  it('start', function(done) {
    expect(counter).toEqual(0);
    stackQueue.start();
    window.setTimeout(function() {
      expect(counter).toEqual(5);
      done();
    }, 100);
  });

  it('addDelay', function(done) {
    var timeTests = function() {
      window.setTimeout(function() {
        expect(counter).toEqual(1);
      }, 50);
      window.setTimeout(function() {
        expect(counter).toEqual(1);
        stackQueue.start();
      }, 100);
      window.setTimeout(function() {
        expect(counter).toEqual(2);
        stackQueue.start();
      }, 150);
      window.setTimeout(function() {
        if (counter == 3) {
          expect(counter).toEqual(3);
        } else {
          window.setTimeout(function() {
            expect(counter).toEqual(3);
          }, 25);
        }
      }, 250);
      window.setTimeout(function() {
        if (counter == 4) {
          expect(counter).toEqual(4);
        } else {
          window.setTimeout(function() {
            expect(counter).toEqual(4);
          }, 25);
        }
      }, 350);
      window.setTimeout(function() {
        expect(counter).toEqual(4);
        done();
      }, 450);
    }.bind(this);

    counter = 0;
    expect(counter).toEqual(0);
    stackQueue.addCommand(timeTests);
    stackQueue.addCommand(counterFunc);
    stackQueue.addDelay(100);
    stackQueue.addCommand(counterFunc);
    stackQueue.addDelay(100);
    stackQueue.addCommand(counterFunc);
    stackQueue.addDelay(100);
    stackQueue.addCommand(counterFunc);
    stackQueue.start();
  });

  it('stop', function(done) {
    expect(counter).toEqual(4);
    stackQueue.addCommand(counterFunc);
    stackQueue.addDelay(100);
    stackQueue.addCommand(counterFunc);
    stackQueue.addDelay(100);
    stackQueue.addCommand(counterFunc);
    stackQueue.addDelay(100);
    stackQueue.addCommand(counterFunc);
    stackQueue.start();
    stackQueue.stop();
    expect(counter).toEqual(5);
    window.setTimeout(function() {
      expect(counter).toEqual(5);
      done();
    }, 75);
  });

});
