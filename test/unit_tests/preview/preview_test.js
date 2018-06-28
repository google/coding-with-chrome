/**
 * @fileoverview Preview tests.
 *
 * @license Copyright 2018 The Coding with Chrome Authors.
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
 * @author carheden@google.com (Adam Carheden)
 */
goog.require('cwc.ui.Preview');
goog.require('cwc.utils.Helper');
goog.require('cwc.renderer.Helper');
goog.require('cwc.framework.Internal');
goog.require('cwc.Cache');

describe('Preview', function() {
  let helper = new cwc.utils.Helper();
  let rendererHelper = new cwc.renderer.Helper();
  let frameworks = [cwc.framework.Internal.MESSENGER];
  let cache = new cwc.Cache(new cwc.utils.Helper());

  beforeAll(async function() {
    await cache.prepare();
    await cache.preloadFiles(frameworks);
  });
  let node;
  let preview;
  beforeEach(async function() {
    node = document.createElement('div');
    document.body.appendChild(node);
    preview = new cwc.ui.Preview(helper);
    preview.decorate(node);
    let header = rendererHelper.getCacheFilesHeader(frameworks, cache);
    let body = '<script>(' + (function() {
      new cwc.framework.Messenger(true, 'exec script test');
    } ).toString() + ')()</script>';
    let html = rendererHelper.getRawHTML(body, header);
    let content = preview.getContent();
    expect(content).not.toBeNull();
    await new Promise((resolve) => {
      content.addEventListener('load', () => {
        resolve();
      });
      let url = rendererHelper.getDataURL(html);
      preview.setContentUrl(url);
    });
  });

  it('constructor', function() {
    expect(typeof preview).toEqual('object');
  });

  it('executeScript should return result', function(done) {
    let a = 7;
    let b = 9;
    let answer = a + b;
    let func = function(x1, x2) {
      return x1 + x2;
    };
    let code = `{
        let add = ${func.toString()};
        return add(${a}, ${b});
      }`;
    preview.executeScript(code, function(result) {
      expect(result).toEqual(answer);
      done();
    });
  });

  afterEach(function() {
    node.remove();
  });
});
