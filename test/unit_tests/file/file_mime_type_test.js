/**
 * @fileoverview File mime tests.
 *
 * @license Copyright 2017 The Coding with Chrome Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author mbordihn@google.com (Markus Bordihn)
 */
goog.require('cwc.file.MimeType');
goog.require('cwc.file.getMimeTypeByExtension');


describe('File Mime Type', function() {
  let cwcData = '{ "format": "Coding with Chrome File Format x.0" }';
  let htmlData = '<!DOCTYPE html><title>Title</title><h1>Hello World</h1>';
  let javascriptData = 'var test = "Hello World";';
  let jsonData = '{"test":1}';
  let xmlData = '<?xml version="1.0" encoding="UTF-8"?><example></example>';

  it('getMimeTypeByExtension', function() {
    expect(cwc.file.getMimeTypeByExtension('image.png')).toEqual('image/png');
    expect(cwc.file.getMimeTypeByExtension('image.jpg')).toEqual('image/jpeg');
    expect(cwc.file.getMimeTypeByExtension('image.jpeg')).toEqual('image/jpeg');
  });

  it('getMimeTypeByContent', function() {
    expect(cwc.file.getMimeTypeByContent(cwcData)).toEqual(
      'application/cwc+json');
    expect(cwc.file.getMimeTypeByContent(htmlData)).toEqual('text/html');
    expect(cwc.file.getMimeTypeByContent(javascriptData)).toEqual(
      'application/javascript');

    expect(cwc.file.getMimeTypeByContent(jsonData)).toEqual('application/json');
    expect(cwc.file.getMimeTypeByContent(xmlData)).toEqual('application/xml');
  });
});
