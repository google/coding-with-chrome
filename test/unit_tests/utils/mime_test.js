/**
 * @fileoverview MIME tests.
 *
 * @license Copyright 2018 The Coding with Chrome Authors.
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
goog.require('cwc.utils.mime.Type');
goog.require('cwc.utils.mime.getByType');
goog.require('cwc.utils.mime.getTypeByContent');
goog.require('cwc.utils.mime.getTypeByExtension');


describe('File Mime Type', function() {
  let cwcData = '{ "format": "Coding with Chrome File Format x.0" }';
  let htmlData = '<!DOCTYPE html><title>Title</title><h1>Hello World</h1>';
  let javascriptData = 'var test = "Hello World";';
  let jsonData = '{"test":1}';
  let xhtmlData = '<?xml version="1.0" encoding="UTF-8" ?>//W3C//DTD XHTML';
  let xmlData = '<?xml version="1.0" encoding="UTF-8"?><example></example>';
  let blocklyData = '<xml><block type= x= y=><field name="test"></field>' +
    '</block></xml>';

  it('getTypeByExtension', function() {
    expect(cwc.utils.mime.getTypeByExtension('image.png'))
      .toEqual('image/png');
    expect(cwc.utils.mime.getTypeByExtension('image.jpg'))
      .toEqual('image/jpeg');
    expect(cwc.utils.mime.getTypeByExtension('image.jpeg'))
      .toEqual('image/jpeg');
  });

  it('getTypeByContent', function() {
    expect(cwc.utils.mime.getTypeByContent(cwcData))
      .toEqual('application/cwc+json');
    expect(cwc.utils.mime.getTypeByContent(htmlData))
      .toEqual('text/html');
    expect(cwc.utils.mime.getTypeByContent(javascriptData))
      .toEqual('application/javascript');
    expect(cwc.utils.mime.getTypeByContent(jsonData))
      .toEqual('application/json');
    expect(cwc.utils.mime.getTypeByContent(xmlData))
      .toEqual('application/xml');
    expect(cwc.utils.mime.getTypeByContent(blocklyData))
      .toEqual('application/blockly+xml');
    expect(cwc.utils.mime.getTypeByContent(xhtmlData))
      .toEqual('application/xhtml+xml');
  });

  it('getTypeByName', function() {
    expect(cwc.utils.mime.getTypeByName('blockly'))
      .toEqual('application/blockly+xml');
    expect(cwc.utils.mime.getTypeByName('javascript'))
      .toEqual('application/javascript');
    expect(cwc.utils.mime.getTypeByName('__javascript__'))
      .toEqual('application/javascript');
    expect(cwc.utils.mime.getTypeByName('html'))
      .toEqual('text/html');
    expect(cwc.utils.mime.getTypeByName('__html__'))
      .toEqual('text/html');
    expect(cwc.utils.mime.getTypeByName('python'))
      .toEqual('text/x-python');
    expect(cwc.utils.mime.getTypeByName('__python__'))
      .toEqual('text/x-python');
  });

  it('getByType', function() {
    expect(cwc.utils.mime.getByType('application/cwc+json'))
      .toEqual(cwc.utils.mime.Type.CWC);
    expect(cwc.utils.mime.getByType('application/javascript'))
      .toEqual(cwc.utils.mime.Type.JAVASCRIPT);
    expect(cwc.utils.mime.getByType('text/x-python'))
      .toEqual(cwc.utils.mime.Type.PYTHON);
    expect(cwc.utils.mime.getByType('none')).toEqual('');
  });

  it('isXMLContent', function() {
    expect(cwc.utils.mime.isXMLContent(xmlData))
      .toEqual(cwc.utils.mime.Type.XML.type);
    expect(cwc.utils.mime.isXMLContent(blocklyData))
      .toEqual(cwc.utils.mime.Type.BLOCKLY.type);
  });
});
