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
 * @fileoverview Files tests.
 */

import { Files, ContentType } from './Files';

describe('Files', function () {
  it('constructor', function () {
    const files = new Files();
    expect(typeof files).toBe('object');
  });

  it('.addFolder', function () {
    const files = new Files();
    files.addFolder('/etc');
    files.addFolder('/home');
    files.addFolder('/home/user1');
    files.addFolder('/home/user1/a');
    files.addFolder('/home/user1/b');
    files.addFolder('/home/user2');
    files.addFolder('/home/user2/a');
    files.addFolder('/home/user2/b');
    expect(files.exist('/etc')).toBeTrue();
    expect(files.existFile('/etc')).toBeFalse();
    expect(files.existFolder('/etc')).toBeTrue();
    expect(files.existFolder('/home')).toBeTrue();
    expect(files.existFolder('/home/user1')).toBeTrue();
    expect(files.existFolder('/home/user1/a')).toBeTrue();
    expect(files.existFolder('/home/user1/b')).toBeTrue();
    expect(files.existFolder('/home/user2')).toBeTrue();
    expect(files.existFolder('/home/user2/a')).toBeTrue();
    expect(files.existFolder('/home/user2/b')).toBeTrue();
  });

  it('.addFolder (expected errors)', function () {
    const files = new Files();
    expect(function () {
      files.addFolder('etc');
    }).toThrow();
    expect(function () {
      files.addFolder('/');
    }).toThrow();
    expect(function () {
      files.addFolder('/home/user1');
    }).toThrow();
    expect(function () {
      files.addFolder('/___files___');
    }).toThrow();
    expect(function () {
      files.addFolder('/home');
      files.addFolder('/home');
    }).toThrow();
  });

  it('.writeFile', function () {
    const files = new Files();
    files.writeFile('/test');
    expect(files.exist('/test')).toBeTrue();
    expect(files.existFolder('/test')).toBeFalse();
    expect(files.existFile('/test')).toBeTrue();
  });

  it('.writeFile (/subfolder)', function () {
    const files = new Files();
    files.addFolder('/subfolder');
    files.writeFile('/subfolder/test');
    expect(files.exist('/subfolder/test')).toBeTrue();
    expect(files.existFolder('/subfolder/test')).toBeFalse();
    expect(files.existFile('/subfolder/test')).toBeTrue();
  });

  it('.writeFile (expect errors)', function () {
    const files = new Files();
    files.addFolder('/subfolder');
    expect(function () {
      files.writeFile('test');
    }).toThrow();
    expect(function () {
      files.writeFile('/');
    }).toThrow();
    expect(function () {
      files.writeFile('/subfolder');
    }).toThrow();
    expect(function () {
      files.writeFile('/subfolder2/test');
    }).toThrow();
    expect(function () {
      files.writeFile('/subfolder/test', '1', { overwrite: false });
      files.writeFile('/subfolder/test', '2', { overwrite: false });
    }).toThrow();
  });

  it('.writeFile (overwrite)', function (done) {
    const files = new Files();
    files.writeFile('/test', '1');
    files.writeFile('/test', '2');
    files.readFile('/test').then((result) => {
      expect(result).toBe('2');
      done();
    });
  });

  it('.writeFile (function)', function (done) {
    const files = new Files();
    const testFunction = function (text) {
      return text;
    };
    files.writeFile('/test', testFunction);
    files.readFile('/test', { type: ContentType.EXECUTABLE }).then((result) => {
      expect(result).toBe(testFunction);
      done();
    });
  });

  it('.getFile', function () {
    const files = new Files();
    const newFile = files.writeFile('/test');
    expect(files.exist('/test')).toBeTrue();
    expect(files.existFolder('/test')).toBeFalse();
    expect(files.existFile('/test')).toBeTrue();
    expect(files.getFile('/test')).toBe(newFile);
  });

  it('.getFile (/subfolder)', function () {
    const files = new Files();
    files.addFolder('/subfolder');
    const newFile = files.writeFile('/subfolder/test');
    expect(files.exist('/subfolder/test')).toBeTrue();
    expect(files.existFolder('/subfolder/test')).toBeFalse();
    expect(files.existFile('/subfolder/test')).toBeTrue();
    expect(files.getFile('/subfolder/test')).toBe(newFile);
  });

  it('.getFile (function)', function () {
    const files = new Files();
    const testFunction = function (text) {
      return text;
    };
    const newFile = files.writeFile('/test', testFunction);
    expect(files.exist('/test')).toBeTrue();
    expect(files.existFolder('/test')).toBeFalse();
    expect(files.existFile('/test')).toBeTrue();
    expect(files.getFile('/test')).toBe(newFile);
  });

  it('.readFile', function (done) {
    const files = new Files();
    const fileContent = 'Hello World!';
    const newFile = files.writeFile('/test', fileContent);
    expect(files.exist('/test')).toBeTrue();
    expect(files.existFolder('/test')).toBeFalse();
    expect(files.existFile('/test')).toBeTrue();
    expect(files.getFile('/test')).toBe(newFile);
    files.readFile('/test').then((result) => {
      expect(result).toBe(fileContent);
      done();
    });
  });
});
