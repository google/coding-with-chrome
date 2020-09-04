/**
 * @fileoverview Executable tests.
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
import { Executable } from './Executable';

describe('Executable', function() {
  it('constructor', function() {
    const executable = new Executable(function() {
      return 1;
    });
    expect(typeof executable).toEqual('object');
  });

  it('.type', function() {
    const executable = new Executable(function() {
      return 1;
    });
    expect(executable.type).toEqual('application/x-binary');
  });

  it('.getId', function() {
    const testFunction = function() {
      return 1;
    };
    const executable = new Executable(testFunction);
    const executable1 = new Executable(testFunction);
    const executable2 = new Executable(testFunction);
    const executable3 = new Executable(testFunction);
    const executable4 = new Executable(testFunction);
    expect(executable.getId() !== executable.getId()).toBeFalse();
    expect(executable.getId() !== executable1.getId()).toBeTrue();
    expect(executable.getId() !== executable2.getId()).toBeTrue();
    expect(executable.getId() !== executable3.getId()).toBeTrue();
    expect(executable.getId() !== executable4.getId()).toBeTrue();
  });

  it('.setName', function() {
    const file = new Executable('', 'test123');
    expect(file.getName()).toEqual('test123');
    file.setName('123test');
    expect(file.getName()).toEqual('123test');
  });

  it('.getName', function() {
    const file = new Executable('', 'test123');
    expect(file.name).toEqual(file.getName());
  });

  it('.setData', function() {
    const testFunction = function() {
      return 1;
    };
    const executable = new Executable(null);
    executable.setData(testFunction);
    expect(executable.getData()).toEqual(executable.executable);
    expect(executable.getData() == testFunction).toBeTrue();
  });

  it('.getAsText', function(done) {
    const executable = new Executable('test123');
    executable.setData('123');
    executable.getAsText().then(result => {
      expect(result).toBe(executable.binaryPlaceholder);
      done();
    });
    expect(executable.getData()).toEqual(executable.executable);
  });

  it('.getJSON', function(done) {
    const executable = new Executable('', 'test123');
    executable.setData('');
    executable.id = 'b742ae95-e24e049b-f8b48d12-71655fad';
    executable.getJSON().then(result => {
      expect(result).toEqual(`{
  "data": "[binary data]",
  "id": "b742ae95-e24e049b-f8b48d12-71655fad",
  "name": "test123",
  "size": 0,
  "type": "application/x-binary",
  "version": 1
}`);
      done();
    });
  });
});
