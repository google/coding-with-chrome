/**
 * @fileoverview Renderer helper tests.
 *
 * @license Copyright 2015 Google Inc. All Rights Reserved.
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
goog.require('cwc.renderer.Helper');


describe('Renderer Helper', function() {
  var helper = new cwc.renderer.Helper();

  it('prependText', function() {
    var test1 = helper.prependText('World!', 'Hello');
    var test2 = helper.prependText('Hello World!', 'Hello');
    var test3 = helper.prependText('Hello World!', 'World');
    expect(test1).toEqual('Hello\nWorld!');
    expect(test2).toEqual('Hello World!');
    expect(test3).toEqual('Hello World!');
  });

  describe('getHTML', function() {

    it('getHTML - raw', function() {
      var htmlCode = '<!DOCTYPE html>\n<html>\n<head>\n<style>* { margin:0; ' +
        'padding:0; }html, body { width:100%; height:100%; }canvas { ' +
        'display:block; }</style>undefined\n' +
        '</head>\n<body>\nundefined\n</body>\n</html>\n';
      expect(helper.getHTML().content).toEqual(htmlCode);
    });

  });

});
