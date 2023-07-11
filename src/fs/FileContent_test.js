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

import { FileContent } from './FileContent';

describe('FileContent', function () {
  it('arrayBufferToText', function () {
    const dataText = 'abc';
    const dataBuffer = new ArrayBuffer(dataText.length);
    const dataView = new Uint8Array(dataBuffer);
    dataView[0] = dataText.charCodeAt(0);
    dataView[1] = dataText.charCodeAt(1);
    dataView[2] = dataText.charCodeAt(2);
    expect(FileContent.arrayBufferToText(dataBuffer)).toBe(dataText);
  });

  it('.blobToText', function (done) {
    const dataText = 'abc';
    const dataBuffer = new ArrayBuffer(dataText.length);
    const dataView = new Uint8Array(dataBuffer);
    dataView[0] = dataText.charCodeAt(0);
    dataView[1] = dataText.charCodeAt(1);
    dataView[2] = dataText.charCodeAt(2);
    const blobObject = new Blob([dataBuffer], { type: 'text/plain' });
    expect(blobObject.type).toBe('text/plain');
    FileContent.blobToText(blobObject).then((text) => {
      expect(text).toBe('abc');
      done();
    });
  });

  it('.toBlob', function (done) {
    const blobText = FileContent.toBlob(null);
    FileContent.blobToText(blobText).then((text) => {
      expect(text).toBe('');
      done();
    });
  });

  it('.toBlob (text)', function (done) {
    const blobText = FileContent.toBlob('test');
    expect(blobText.type).toBe('text/plain');
    expect(blobText.size).toBe(4);
    FileContent.blobToText(blobText).then((text) => {
      expect(text).toBe('test');
      done();
    });
  });

  it('.toBlob (blob)', function () {
    const blobNative = FileContent.toBlob(new Blob([], { type: 'text/plain' }));
    expect(blobNative.type).toBe('text/plain');
  });

  it('.toBlob (data url)', function (done) {
    const blobBase64 = FileContent.toBlob(
      'data:text/plain;base64,SGVsbG8gV29ybGQ=',
    );
    expect(blobBase64.type).toBe('text/plain');
    FileContent.blobToText(blobBase64).then((text) => {
      expect(text).toBe('Hello World');
      done();
    });
  });

  it('.base64ToBlob (error)', function (done) {
    const blobBase64 = FileContent.base64ToBlob(
      'SGVsbG8gV29ybGQ2=',
      'text/plain',
    );
    expect(blobBase64.type).toBe('text/plain');
    FileContent.blobToText(blobBase64).then((text) => {
      expect(text).toBe('SGVsbG8gV29ybGQ2=');
      done();
    });
  });

  it('.base64ToBlob', function (done) {
    const blobBase64 = FileContent.base64ToBlob(
      'SGVsbG8gV29ybGQ=',
      'text/plain',
    );
    expect(blobBase64.type).toBe('text/plain');
    FileContent.blobToText(blobBase64).then((text) => {
      expect(text).toBe('Hello World');
      done();
    });
  });

  it('dataURLToBlob (base64)', function (done) {
    const blobBase64 = FileContent.dataURLToBlob(
      'data:text/plain;base64,SGVsbG8gV29ybGQ=',
    );
    expect(blobBase64.type).toBe('text/plain');
    FileContent.blobToText(blobBase64).then((text) => {
      expect(text).toBe('Hello World');
      done();
    });
  });

  it('dataURLToBlob (url encode)', function (done) {
    const blobURLEncode = FileContent.dataURLToBlob(
      'data:text/plain,Hello%20World!',
    );
    expect(blobURLEncode.type).toBe('text/plain');
    FileContent.blobToText(blobURLEncode).then((text) => {
      expect(text).toBe('Hello World!');
      done();
    });
  });

  it('urlEncodedToBlob', function () {
    const blobURLEncode = FileContent.urlEncodedToBlob(
      'Hello%20World!',
      'text/plain',
    );
    expect(blobURLEncode.type).toBe('text/plain');
  });

  it('textToArrayBuffer', function () {
    const dataText = 'Hello World';
    const dataBuffer = FileContent.textToArrayBuffer(dataText);
    expect(FileContent.arrayBufferToText(dataBuffer)).toBe(dataText);
  });
});
