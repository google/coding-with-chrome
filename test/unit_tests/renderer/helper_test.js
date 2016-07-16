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
'use strict';
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
        'display:block; }</style>\n' +
        '</head>\n<body>\n</body>\n</html>\n';
      expect(helper.getHTML().content).toEqual(htmlCode);
    });

    it('getHTML - html', function() {
      var htmlCode = '<!DOCTYPE html>\n<html>\n<head>\n<style>* { margin:0; ' +
        'padding:0; }html, body { width:100%; height:100%; }canvas { ' +
        'display:block; }</style>\n' +
        '</head>\n<body>\n<h1>test</h1>\n</body>\n</html>\n';
      expect(helper.getHTML('<h1>test</h1>').content).toEqual(htmlCode);
    });

    it('getHTML - head', function() {
      var htmlCode = '<!DOCTYPE html>\n<html>\n<head>\n<style>* { margin:0; ' +
        'padding:0; }html, body { width:100%; height:100%; }canvas { ' +
        'display:block; }</style>\n' +
        '<script src="http://example.org"></script>\n' +
        '</head>\n<body>\n</body>\n</html>\n';
      expect(helper.getHTML(
        '', '<script src="http://example.org"></script>'
      ).content).toEqual(htmlCode);
    });

    it('getHTML - css', function() {
      var htmlCode = '<!DOCTYPE html>\n<html>\n<head>\n<style>* { margin:0; ' +
        'padding:0; }html, body { width:100%; height:100%; }canvas { ' +
        'display:block; }</style>\n' +
        '<style>\nbody { background: #f00;}\n</style>\n' +
        '</head>\n<body>\n</body>\n</html>\n';
      expect(helper.getHTML('', '', 'body { background: #f00;}').content)
        .toEqual(htmlCode);
    });

    it('getHTML - javascript', function() {
      var htmlCode = '<!DOCTYPE html>\n<html>\n<head>\n<style>* { margin:0; ' +
        'padding:0; }html, body { width:100%; height:100%; }canvas { ' +
        'display:block; }</style>\n' +
        '</head>\n<body>\n<script>\nvar 123;\n' +
        'function test(a) {return a+1;};\n</script>\n</body>\n</html>\n';
      expect(helper.getHTML('', '', '',
        'var 123;\nfunction test(a) {return a+1;};').content).toEqual(htmlCode);
    });

    it('getHTML', function() {
      var htmlCode = '<!DOCTYPE html>\n<html>\n<head>\n' +
        '<style>* { margin:0; padding:0; }html, body { ' +
        'width:100%; height:100%; }canvas { display:block; }</style>\n' +
        '<style>\nbody { background: #f00;}\n</style>\n' +
        '<script src="http://example.org"></script>\n</head>\n<body>\n' +
        '<h1>test</h1>\n<script>\nvar 123;\nfunction test(a) {return a+1;};\n' +
        '</script>\n</body>\n</html>\n';
      expect(helper.getHTML(
        '<h1>test</h1>',
        '<script src="http://example.org"></script>',
        'body { background: #f00;}',
        'var 123;\nfunction test(a) {return a+1;};').content).toEqual(htmlCode);
    });

  });

  it('getHTMLGrid', function() {
    var htmlCode = '<!DOCTYPE html>\n<html>\n<head>\n' +
      '<style>* { margin:0; padding:0; }html, body { ' +
      'width:100%; height:100%; }canvas { display:block; }' +
      'body {background-size: 25px 25px; background-image: linear-gradient' +
      '(to right, #eee 1px, transparent 1px), linear-gradient(to bottom, #eee' +
      ' 1px, transparent 1px);}\n</style>\n' +
      '<style>\nbody { background: #f00;}\n</style>\n' +
      '<script src="http://example.org"></script>\n</head>\n<body>\n' +
      '<h1>test</h1>\n<script>\nvar 123;\nfunction test(a) {return a+1;};\n' +
      '</script>\n</body>\n</html>\n';
    expect(helper.getHTMLGrid(
      '<h1>test</h1>',
      '<script src="http://example.org"></script>',
      'body { background: #f00;}',
      'var 123;\nfunction test(a) {return a+1;};').content).toEqual(htmlCode);
  });

  it('getDataUrl ', function() {
    var js1 = helper.getDataUrl('Hello World');
    var js2 = helper.getDataUrl('Hello World', 'text/javascript');
    var js3 = helper.getDataUrl('data:text/javascript;base64,SGVsbG9Xb3JsZA==');
    expect(js1).toEqual('data:text/html;base64,SGVsbG8gV29ybGQ=');
    expect(js2).toEqual('data:text/javascript;base64,SGVsbG8gV29ybGQ=');
    expect(js3).toEqual('data:text/javascript;base64,SGVsbG9Xb3JsZA==');
  });

  it('getObjectTag ', function() {
    var url = 'data:text/javascript;base64,SGVsbG9Xb3JsZA==';
    var objectTag1 = helper.getObjectTag(url).content;
    var objectTag2 = helper.getObjectTag(url, 100, 200).content;
    var objectTag3 = helper.getObjectTag(url, 200, 100).content;
    expect(objectTag1).toEqual('<object data="data:text/javascript;base64,' +
      'SGVsbG9Xb3JsZA==" type="text/html" width="400" height="400"></object>');
    expect(objectTag2).toEqual('<object data="data:text/javascript;base64,' +
      'SGVsbG9Xb3JsZA==" type="text/html" width="100" height="200"></object>');
    expect(objectTag3).toEqual('<object data="data:text/javascript;base64,' +
      'SGVsbG9Xb3JsZA==" type="text/html" width="200" height="100"></object>');
  });

  it('getRawHTML ', function() {
    var html1 = helper.getRawHTML('Hello World');
    var html2 = helper.getRawHTML('<html></html>', '<test>');
    var html3 = helper.getRawHTML('<head></head>', '<test>');
    var html4 = helper.getRawHTML('<body></body>', '<test>');
    expect(html1).toEqual('Hello World');
    expect(html2).toEqual('<html>\n<head>\n<test>\n</head>\n</html>');
    expect(html3).toEqual('<head><test>\n</head>');
    expect(html4).toEqual('<head>\n<test>\n</head>\n<body></body>');
  });

  it('getJavaScriptDataUrl ', function() {
    var js1 = helper.getJavaScriptDataUrl('SGVsbG9Xb3JsZA==').content;
    var js2 = helper.getJavaScriptDataUrl('SGVsbG9Xb3JsZA==', null,
      'test-file').content;
    expect(js1).toEqual('\n<script src="data:text/javascript;base64,' +
      'SGVsbG9Xb3JsZA=="></script>\n');
    expect(js2).toEqual('\n<script src="data:text/javascript;base64,' +
      'SGVsbG9Xb3JsZA==" data-filename="test-file"></script>\n');
  });

  it('getJavaScript ', function() {
    var js1 = helper.getJavaScriptContent('test();').content;
    var js2 = helper.getJavaScriptContent('var 123;\n' +
      'function test(a) {return a+1;};').content;
    expect(js1).toEqual('<script>\ntest();\n</script>\n');
    expect(js2).toEqual('<script>\nvar 123;\n' +
      'function test(a) {return a+1;};\n</script>\n');
  });


});
