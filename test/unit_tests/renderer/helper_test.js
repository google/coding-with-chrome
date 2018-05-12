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
  let defaultCss = '* { margin:0; padding:0; }html, body { width:100%; ' +
    'height:100%; overflow: hidden;}';
  let defaultJavaScript = '<script>if (typeof cwc.framework.Message !== ' +
    '\'undefined\') {new cwc.framework.Message();}</script>\n';

  it('constructor', function() {
    expect(typeof helper).toEqual('object');
  });

  describe('getHTML', function() {
    it('getHTML - raw', function() {
      let htmlCode = '<!DOCTYPE html>\n<html>\n<head>\n<style>' + defaultCss +
        'canvas { display:block; }</style>\n' +
        '</head>\n<body>\n' + defaultJavaScript + '</body>\n</html>\n';
      expect(helper.getHTML()).toEqual(htmlCode);
    });

    it('getHTML - html', function() {
      let htmlCode = '<!DOCTYPE html>\n<html>\n<head>\n<style>' + defaultCss +
        'canvas { display:block; }</style>\n' +
        '</head>\n<body>\n<h1>test</h1>\n' + defaultJavaScript +
        '</body>\n</html>\n';
      expect(helper.getHTML('<h1>test</h1>')).toEqual(htmlCode);
    });

    it('getHTML - head', function() {
      let htmlCode = '<!DOCTYPE html>\n<html>\n<head>\n<style>' + defaultCss +
        'canvas { display:block; }</style>\n' +
        '<script src="http://example.org"></script>\n' +
        '</head>\n<body>\n' + defaultJavaScript + '</body>\n</html>\n';
      expect(helper.getHTML(
        '', '<script src="http://example.org"></script>'
      )).toEqual(htmlCode);
    });

    it('getHTML - css', function() {
      let htmlCode = '<!DOCTYPE html>\n<html>\n<head>\n<style>' + defaultCss +
        'canvas { display:block; }</style>\n' +
        '<style>\nbody { background: #f00;}\n</style>\n' +
        '</head>\n<body>\n' + defaultJavaScript + '</body>\n</html>\n';
      expect(helper.getHTML('', '', 'body { background: #f00;}'))
        .toEqual(htmlCode);
    });

    it('getHTML - javascript', function() {
      let htmlCode = '<!DOCTYPE html>\n<html>\n<head>\n<style>' + defaultCss +
        'canvas { display:block; }</style>\n' +
        '</head>\n<body>\n' + defaultJavaScript +
        '<script>\nlet 123;\n' +
        'function test(a) {return a+1;};\n</script>\n</body>\n</html>\n';
      expect(helper.getHTML('', '', '',
        'let 123;\nfunction test(a) {return a+1;};')).toEqual(htmlCode);
    });

    it('getHTML', function() {
      let htmlCode = '<!DOCTYPE html>\n<html>\n<head>\n<style>' + defaultCss +
        'canvas { display:block; }</style>\n' +
        '<style>\nbody { background: #f00;}\n</style>\n' +
        '<script src="http://example.org"></script>\n</head>\n<body>\n' +
        '<h1>test</h1>\n' + defaultJavaScript +
        '<script>\nlet 123;\nfunction test(a) {return a+1;};\n' +
        '</script>\n</body>\n</html>\n';
      expect(helper.getHTML(
        '<h1>test</h1>',
        '<script src="http://example.org"></script>',
        'body { background: #f00;}',
        'let 123;\nfunction test(a) {return a+1;};')).toEqual(htmlCode);
    });
  });

  it('getHTMLGrid', function() {
    let htmlCode = '<!DOCTYPE html>\n<html>\n<head>\n<style>' + defaultCss +
      'canvas { display:block; }' +
      'body {background-size: 25px 25px; background-image: linear-gradient' +
      '(to right, #eee 1px, transparent 1px), linear-gradient(to bottom, #eee' +
      ' 1px, transparent 1px);}\n</style>\n' +
      '<style>\nbody { background: #f00;}\n</style>\n' +
      '<script src="http://example.org"></script>\n</head>\n<body>\n' +
      '<h1>test</h1>\n' + defaultJavaScript +
      '<script>\nlet 123;\nfunction test(a) {return a+1;};\n' +
      '</script>\n</body>\n</html>\n';
    expect(helper.getHTMLGrid(
      '<h1>test</h1>',
      '<script src="http://example.org"></script>',
      'body { background: #f00;}',
      'let 123;\nfunction test(a) {return a+1;};')).toEqual(htmlCode);
  });

  it('getHTMLCanvas', function() {
    let htmlCode = '<!DOCTYPE html>\n<html>\n<head>\n<style>' + defaultCss +
      'canvas { display:block; }</style>\n' +
      '<style>\nbody { background: #f00;}\n</style>\n' +
      '<script src="http://example.org"></script>\n</head>\n<body>\n' +
      '<canvas id="canvas-chrome"></canvas>\n' +
      '<h1>test</h1>\n' + defaultJavaScript +
      '<script>\nlet 123;\nfunction test(a) {return a+1;};\n' +
      '</script>\n</body>\n</html>\n';
    expect(helper.getHTMLCanvas(
      '<h1>test</h1>',
      '<script src="http://example.org"></script>',
      'body { background: #f00;}',
      'let 123;\nfunction test(a) {return a+1;};')).toEqual(htmlCode);
  });

  it('getRawHTML', function() {
    let html1 = helper.getRawHTML('Hello World');
    let html2 = helper.getRawHTML('<html></html>', '<test>');
    let html3 = helper.getRawHTML('<head></head>', '<test>');
    let html4 = helper.getRawHTML('<body></body>', '<test>');
    let html5 = helper.getRawHTML(false);
    expect(html1).toEqual('Hello World');
    expect(html2).toEqual('<html>\n<head>\n<test>\n</head>\n</html>');
    expect(html3).toEqual('<head><test>\n</head>');
    expect(html4).toEqual('<head>\n<test>\n</head>\n<body></body>');
    expect(html5).toEqual('');
  });

  it('getJavaScript', function() {
    let js1 = helper.getJavaScript('test();');
    let js2 = helper.getJavaScript('let 123;\n' +
      'function test(a) {return a+1;};');
    expect(js1).toEqual('<!DOCTYPE html>\n<html>\n<head>\n' +
      '<style>* { margin:0; padding:0; }html, body { width:100%; height:100%;' +
      ' overflow: hidden;}canvas { display:block; }</style>\n' +
      '</head>\n<body>\n' + defaultJavaScript +
      '<script>\n' +
      'test();' +
      '\n</script>\n</body>\n</html>\n');
    expect(js2).toEqual('<!DOCTYPE html>\n<html>\n<head>\n' +
      '<style>* { margin:0; padding:0; }html, body { width:100%; height:100%;' +
      ' overflow: hidden;}canvas { display:block; }</style>\n' +
      '</head>\n<body>\n' + defaultJavaScript +
      '<script>\n' +
      'let 123;\nfunction test(a) {return a+1;};' +
      '\n</script>\n</body>\n</html>\n');
  });

  it('getDataUrl', function() {
    let js1 = helper.getDataURL('Hello World');
    let js2 = helper.getDataURL('Hello World', 'text/javascript');
    let js3 = helper.getDataURL('data:text/javascript;base64,SGVsbG9Xb3JsZA==');
    expect(js1).toEqual('data:text/html;base64,SGVsbG8gV29ybGQ=');
    expect(js2).toEqual('data:text/javascript;base64,SGVsbG8gV29ybGQ=');
    expect(js3).toEqual('data:text/javascript;base64,SGVsbG9Xb3JsZA==');
  });

  it('getJavaScriptDataURL', function() {
    let js1 = helper.getJavaScriptDataURL('SGVsbG9Xb3JsZA==');
    let js2 = helper.getJavaScriptDataURL('SGVsbG9Xb3JsZA==', undefined,
      'test-file');
    let js3 = helper.getJavaScriptDataURL('data:text/javascript;base64,' +
      'SGVsbG9Xb3JsZA==');
    expect(js1).toEqual('<script src="data:text/javascript;base64,' +
      'SGVsbG9Xb3JsZA=="></script>\n');
    expect(js2).toEqual('<script src="data:text/javascript;base64,' +
      'SGVsbG9Xb3JsZA==" data-filename="test-file"></script>\n');
    expect(js3).toEqual('<script src="data:text/javascript;base64,' +
      'SGVsbG9Xb3JsZA=="></script>\n');
  });

  it('getJavaScriptContent', function() {
    let js1 = helper.getJavaScriptContent('test();');
    let js2 = helper.getJavaScriptContent('let 123;\n' +
      'function test(a) {return a+1;};');
    expect(js1).toEqual('<script>\ntest();\n</script>\n');
    expect(js2).toEqual('<script>\nlet 123;\n' +
      'function test(a) {return a+1;};\n</script>\n');
  });

  it('getStyleSheetDataUrl', function() {
    let js1 = helper.getStyleSheetDataURL('SGVsbG9Xb3JsZA==');
    let js2 = helper.getStyleSheetDataURL('SGVsbG9Xb3JsZA==', undefined,
      'test-file');
    let js3 = helper.getStyleSheetDataURL('data:text/css;base64,' +
      'SGVsbG9Xb3JsZA==');
    expect(js1).toEqual('<link rel="stylesheet" type="text/css" ' +
      'href="data:text/css;base64,SGVsbG9Xb3JsZA==">\n');
    expect(js2).toEqual('<link rel="stylesheet" type="text/css" ' +
      'href="data:text/css;base64,SGVsbG9Xb3JsZA==" ' +
      'data-filename="test-file">\n');
    expect(js3).toEqual('<link rel="stylesheet" type="text/css" ' +
      'href="data:text/css;base64,SGVsbG9Xb3JsZA==">\n');
  });
});
