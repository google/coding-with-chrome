/**
 * @fileoverview Globals for tests.
 *
 * @license Copyright 2017 The Coding with Chrome Authors.
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

/* eslint no-unused-vars: 0 */
goog.require('cwc.utils.ByteTools');

Locales = {};

let prepareEditor = function() {
  let cwcEditor = document.getElementById('cwc-editor');
  if (!cwcEditor) {
    document.body.insertAdjacentHTML(
      'afterbegin', '<div id="cwc-editor"></div>');
  }
};

let getTestBlockCode = function(block) {
  let blocklyDiv = document.getElementById('test-workspace');
  let workspace = Blockly.inject(blocklyDiv);
  let xmlCode = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
    '<block type="' + block + '"></block>\n</xml>';
  let xmlDom = Blockly.Xml.textToDom(xmlCode);
  Blockly.Xml.domToWorkspace(xmlDom, workspace);
  let code = Blockly.JavaScript.workspaceToCode(workspace);
  return code;
};

let getTestBuffer = function(data) {
  return cwc.utils.ByteTools.getUint8Data(data).data;
};

let loadExampleFile = function(file, it) {
  return it('Example:' + file, function(done) {
    let builder = new cwc.ui.Builder();
    builder.decorate().then(() => {
      builder.loadFile('../resources/examples/' + file).then(() => {
        expect(true).toEqual(true);
        done();
      }, (error) => {
        expect(error).toEqual(null);
        if (error) {
          throw error;
        }
        done();
      });
    });
  });
};

let loadTemplateFile = function(file, it) {
  return it('Template:' + file, function(done) {
    let builder = new cwc.ui.Builder();
    builder.decorate().then(() => {
      builder.loadFile('../resources/templates/' + file).then(() => {
        expect(true).toEqual(true);
        done();
      }, (error) => {
        expect(error).toEqual(null);
        if (error) {
          throw error;
        }
        done();
      });
    });
  });
};

let loadTourFile = function(file, it) {
  return it('Tour:' + file, function(done) {
    let builder = new cwc.ui.Builder();
    builder.decorate().then(() => {
      builder.loadFile('../resources/tour/' + file).then(() => {
        expect(true).toEqual(true);
        done();
      }, (error) => {
        expect(error).toEqual(null);
        if (error) {
          throw error;
        }
        done();
      });
    });
  });
};

let loadTutorialFile = function(file, it) {
  return it('Tutorial:' + file, function(done) {
    let builder = new cwc.ui.Builder();
    builder.decorate().then(() => {
      builder.loadFile('../resources/tutorials/' + file).then(() => {
        expect(true).toEqual(true);
        done();
      }, (error) => {
        expect(error).toEqual(null);
        if (error) {
          throw error;
        }
        done();
      });
    });
  });
};
