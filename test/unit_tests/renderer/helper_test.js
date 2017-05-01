/**
 * @fileoverview Renderer helper tests.
 *
 * @license Copyright 2015 The Coding with Chrome Authors.
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
  let helper = new cwc.renderer.Helper();

  it('prependText', function() {
    let test1 = helper.prependText('World!', 'Hello');
    let test2 = helper.prependText('Hello World!', 'Hello');
    let test3 = helper.prependText('Hello World!', 'World');
    expect(test1).toEqual('Hello\nWorld!');
    expect(test2).toEqual('Hello World!');
    expect(test3).toEqual('Hello World!');
  });

  describe('getHTML', function() {
    it('getHTML - raw', function() {
      let htmlCode = '<!DOCTYPE html>\n<html>\n<head>\n<style>* { margin:0; ' +
        'padding:0; }html, body { width:100%; height:100%; }canvas { ' +
        'display:block; }</style>\n' +
        '</head>\n<body>\n</body>\n</html>\n';
      expect(helper.getHTML().content).toEqual(htmlCode);
    });

    it('getHTML - html', function() {
      let htmlCode = '<!DOCTYPE html>\n<html>\n<head>\n<style>* { margin:0; ' +
        'padding:0; }html, body { width:100%; height:100%; }canvas { ' +
        'display:block; }</style>\n' +
        '</head>\n<body>\n<h1>test</h1>\n</body>\n</html>\n';
      expect(helper.getHTML('<h1>test</h1>').content).toEqual(htmlCode);
    });

    it('getHTML - head', function() {
      let htmlCode = '<!DOCTYPE html>\n<html>\n<head>\n<style>* { margin:0; ' +
        'padding:0; }html, body { width:100%; height:100%; }canvas { ' +
        'display:block; }</style>\n' +
        '<script src="http://example.org"></script>\n' +
        '</head>\n<body>\n</body>\n</html>\n';
      expect(helper.getHTML(
        '', '<script src="http://example.org"></script>'
      ).content).toEqual(htmlCode);
    });

    it('getHTML - css', function() {
      let htmlCode = '<!DOCTYPE html>\n<html>\n<head>\n<style>* { margin:0; ' +
        'padding:0; }html, body { width:100%; height:100%; }canvas { ' +
        'display:block; }</style>\n' +
        '<style>\nbody { background: #f00;}\n</style>\n' +
        '</head>\n<body>\n</body>\n</html>\n';
      expect(helper.getHTML('', '', 'body { background: #f00;}').content)
        .toEqual(htmlCode);
    });

    it('getHTML - javascript', function() {
      let htmlCode = '<!DOCTYPE html>\n<html>\n<head>\n<style>* { margin:0; ' +
        'padding:0; }html, body { width:100%; height:100%; }canvas { ' +
        'display:block; }</style>\n' +
        '</head>\n<body>\n<script>\nlet 123;\n' +
        'function test(a) {return a+1;};\n</script>\n</body>\n</html>\n';
      expect(helper.getHTML('', '', '',
        'let 123;\nfunction test(a) {return a+1;};').content).toEqual(htmlCode);
    });

    it('getHTML', function() {
      let htmlCode = '<!DOCTYPE html>\n<html>\n<head>\n' +
        '<style>* { margin:0; padding:0; }html, body { ' +
        'width:100%; height:100%; }canvas { display:block; }</style>\n' +
        '<style>\nbody { background: #f00;}\n</style>\n' +
        '<script src="http://example.org"></script>\n</head>\n<body>\n' +
        '<h1>test</h1>\n<script>\nlet 123;\nfunction test(a) {return a+1;};\n' +
        '</script>\n</body>\n</html>\n';
      expect(helper.getHTML(
        '<h1>test</h1>',
        '<script src="http://example.org"></script>',
        'body { background: #f00;}',
        'let 123;\nfunction test(a) {return a+1;};').content).toEqual(htmlCode);
    });
  });

  it('getHTMLGrid', function() {
    let htmlCode = '<!DOCTYPE html>\n<html>\n<head>\n' +
      '<style>* { margin:0; padding:0; }html, body { ' +
      'width:100%; height:100%; }canvas { display:block; }' +
      'body {background-size: 25px 25px; background-image: linear-gradient' +
      '(to right, #eee 1px, transparent 1px), linear-gradient(to bottom, #eee' +
      ' 1px, transparent 1px);}\n</style>\n' +
      '<style>\nbody { background: #f00;}\n</style>\n' +
      '<script src="http://example.org"></script>\n</head>\n<body>\n' +
      '<h1>test</h1>\n<script>\nlet 123;\nfunction test(a) {return a+1;};\n' +
      '</script>\n</body>\n</html>\n';
    expect(helper.getHTMLGrid(
      '<h1>test</h1>',
      '<script src="http://example.org"></script>',
      'body { background: #f00;}',
      'let 123;\nfunction test(a) {return a+1;};').content).toEqual(htmlCode);
  });

  it('getHTMLCanvas', function() {
    let htmlCode = '<!DOCTYPE html>\n<html>\n<head>\n' +
      '<style>* { margin:0; padding:0; }html, body { ' +
      'width:100%; height:100%; }canvas { display:block; }</style>\n' +
      '<style>\nbody { background: #f00;}\n</style>\n' +
      '<script src="http://example.org"></script>\n</head>\n<body>\n' +
      '<canvas id="canvas-chrome"></canvas>\n' +
      '<h1>test</h1>\n<script>\nlet 123;\nfunction test(a) {return a+1;};\n' +
      '</script>\n</body>\n</html>\n';
    expect(helper.getHTMLCanvas(
      '<h1>test</h1>',
      '<script src="http://example.org"></script>',
      'body { background: #f00;}',
      'let 123;\nfunction test(a) {return a+1;};').content).toEqual(htmlCode);
  });

  it('getDataUrl ', function() {
    let js1 = helper.getDataUrl('Hello World');
    let js2 = helper.getDataUrl('Hello World', 'text/javascript');
    let js3 = helper.getDataUrl('data:text/javascript;base64,SGVsbG9Xb3JsZA==');
    expect(js1).toEqual('data:text/html;base64,SGVsbG8gV29ybGQ=');
    expect(js2).toEqual('data:text/javascript;base64,SGVsbG8gV29ybGQ=');
    expect(js3).toEqual('data:text/javascript;base64,SGVsbG9Xb3JsZA==');
  });

  it('getObjectTag ', function() {
    let url = 'data:text/javascript;base64,SGVsbG9Xb3JsZA==';
    let objectTag1 = helper.getObjectTag(url).content;
    let objectTag2 = helper.getObjectTag(url, 100, 200).content;
    let objectTag3 = helper.getObjectTag(url, 200, 100).content;
    expect(objectTag1).toEqual('<object data="data:text/javascript;base64,' +
      'SGVsbG9Xb3JsZA==" type="text/html" width="400" height="400"></object>');
    expect(objectTag2).toEqual('<object data="data:text/javascript;base64,' +
      'SGVsbG9Xb3JsZA==" type="text/html" width="100" height="200"></object>');
    expect(objectTag3).toEqual('<object data="data:text/javascript;base64,' +
      'SGVsbG9Xb3JsZA==" type="text/html" width="200" height="100"></object>');
  });

  it('getRawHTML ', function() {
    let html1 = helper.getRawHTML('Hello World');
    let html2 = helper.getRawHTML('<html></html>', '<test>');
    let html3 = helper.getRawHTML('<head></head>', '<test>');
    let html4 = helper.getRawHTML('<body></body>', '<test>');
    expect(html1).toEqual('Hello World');
    expect(html2).toEqual('<html>\n<head>\n<test>\n</head>\n</html>');
    expect(html3).toEqual('<head><test>\n</head>');
    expect(html4).toEqual('<head>\n<test>\n</head>\n<body></body>');
  });

  it('getJavaScriptDataUrl ', function() {
    let js1 = helper.getJavaScriptDataUrl('SGVsbG9Xb3JsZA==').content;
    let js2 = helper.getJavaScriptDataUrl('SGVsbG9Xb3JsZA==', null,
      'test-file').content;
    expect(js1).toEqual('\n<script src="data:text/javascript;base64,' +
      'SGVsbG9Xb3JsZA=="></script>\n');
    expect(js2).toEqual('\n<script src="data:text/javascript;base64,' +
      'SGVsbG9Xb3JsZA==" data-filename="test-file"></script>\n');
  });

  it('getJavaScript ', function() {
    let js1 = helper.getJavaScriptContent('test();').content;
    let js2 = helper.getJavaScriptContent('let 123;\n' +
      'function test(a) {return a+1;};').content;
    expect(js1).toEqual('<script>\ntest();\n</script>\n');
    expect(js2).toEqual('<script>\nlet 123;\n' +
      'function test(a) {return a+1;};\n</script>\n');
  });
});
