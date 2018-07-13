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


let i18t = function(message) {
  return message;
};
let i18soy = i18t;


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
      new cwc.framework.Messenger(true);
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
  let slowFunc = function(runtime) {
    let start = new Date().getTime();
    let end;
    for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
      end = new Date().getTime();
      if (end - start > runtime) {
        break;
      }
    }
    return end - start;
  };


  it('constructor', function() {
    expect(typeof preview).toEqual('object');
  });

  it('executeScript should return result', async function(done) {
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
    preview.executeScript(code)
      .then(function(result) {
        expect(result).toEqual(answer);
        done();
      })
      .catch(function(error) {
        expect(false).toBe(true, error);
        done();
      });
  });

  it('executeScript should timeout for slow functions', async function(done) {
    let timeout = 10;
    let code = `{
      let slow = ${slowFunc.toString()};
      return slow(1000);
    }`;
    preview.executeScript(code, timeout)
      .then(function(result) {
        expect(false).toBe(true, 'executeScript promise resolved when it '+
          `should have rejected due to time out. Result was '${result}'`);
        done();
      })
      .catch(function(error) {
        expect(error).toBe(`Preview script timed out after ${timeout}ms`);
        done();
      });
  });

  it('executeScript should wait for slow functions if a timeout is specified',
    async function(done) {
    let timeout = 2000;
    let code = `{
      let slow = ${slowFunc.toString()};
      return slow(750);
    }`;
    preview.executeScript(code, timeout)
      .then(function(result) {
        expect(result).toBeLessThan(1000,
          'slowfunc returned, but took unexpectedly long');
        done();
      })
      .catch(function(error) {
        expect(true).toBe(false, `Failed to wait for slow function: ${error}`);
        done();
      });
  });

  it('executeScript should support concurrent calls', async function(done) {
    let code1 = `{
      (${slowFunc.toString()})(500);
      return 'code1';
    }`;
    let code2 = `{
      (${slowFunc.toString()})(50);
      return 'code2';
    }`;
    try {
      let result = await preview.executeScript(code1, 600);
      expect(result).toEqual('code1');
    } catch (error) {
      expect(true).toBe(false, `code1 failed: ${error}`);
    }
    try {
      let result = await preview.executeScript(code2, 100);
      expect(result).toEqual('code2');
    } catch (error) {
      expect(true).toBe(false, `code1 failed: ${error}`);
    }
    done();
  });

  afterEach(function() {
    node.remove();
  });
});
