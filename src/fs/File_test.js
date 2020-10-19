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
 * @fileoverview File tests.
 */
import { File } from './File';

describe('File', function () {
  it('constructor', function () {
    const file = new File('test123');
    expect(typeof file).toEqual('object');
  });

  it('.type', function () {
    const jpegFile = new File('data:image/jpeg;base64,Li4uLi4=', 'test.jpg');
    const pngFile = new File('data:image/png;base64,Li4uLi4=', 'test.png');
    expect(jpegFile.type).toEqual('image/jpeg');
    expect(pngFile.type).toEqual('image/png');
  });

  it('.getId', function () {
    const file = new File('test123');
    const file1 = new File('test123');
    const file2 = new File('test123');
    const file3 = new File('test123');
    const file4 = new File('test123');
    expect(file.getId() !== file.getId()).toBeFalse();
    expect(file.getId() !== file1.getId()).toBeTrue();
    expect(file.getId() !== file2.getId()).toBeTrue();
    expect(file.getId() !== file3.getId()).toBeTrue();
    expect(file.getId() !== file4.getId()).toBeTrue();
  });

  it('.setName', function () {
    const file = new File('', 'test123');
    expect(file.getName()).toEqual('test123');
    file.setName('123test');
    expect(file.getName()).toEqual('123test');
  });

  it('.getName', function () {
    const file = new File('', 'test123');
    expect(file.name).toEqual(file.getName());
  });

  it('.setData', function () {
    const file = new File('test123');
    const data = Math.random();
    file.setData(data);
    expect(file.getData()).toEqual(file.data);
  });

  it('.getAsText', function (done) {
    const file = new File('test123');
    const data = Math.random() + 'test';
    file.setData(data);
    file.getAsText().then((result) => {
      expect(result).toBe(data);
      done();
    });
    expect(file.getData()).toEqual(file.data);
  });

  it('.getJSON', function (done) {
    const file = new File('', 'test123');
    file.setData('Hello World');
    file.id = 'b742ae95-e24e049b-f8b48d12-71655fad';
    file.getJSON().then((result) => {
      expect(result).toEqual(`{
  "data": "Hello World",
  "id": "b742ae95-e24e049b-f8b48d12-71655fad",
  "name": "test123",
  "size": 11,
  "type": "text/plain",
  "version": 1
}`);
      done();
    });
  });
});
