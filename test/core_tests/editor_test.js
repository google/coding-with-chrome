/**
 * @fileoverview Editor tests.
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


describe('Prepare Editor', function() {
  document.body.insertAdjacentHTML('afterbegin', '' +
    '<div id="cwc-loading-screen">' +
    '  <div id="cwc-loading-screen-content">' +
    '    <div id="cwc-loading-screen-logo">' +
    '      <img src="images/cwc_logo.png">' +
    '    </div>' +
    '    <div id="cwc-loading-screen-progress">' +
    '      <div id="cwc-loading-screen-progress-bar" ' +
    'class="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>' +
    '      <div id="cwc-loading-screen-progress-text">' +
    '       Loading Coding with Chrome</div>' +
    '    </div>' +
    '  </div>' +
    '</div>' +
    '<div id="cwc-editor"></div>'
  );

  it('export', function() {
    let builder = new cwc.ui.Builder();
    expect(typeof builder).toEqual('object');
  });

  it('decorate', function(done) {
    let builder = new cwc.ui.Builder();
    builder.decorate().then(() => {
      expect(builder.isPrepared()).toEqual(true, 'Builder not prepared');
      expect(builder.isLoaded()).toEqual(true, 'Builder not loaded');
      expect(builder.isReady()).toEqual(true, 'Builder not ready');
      done();
    }).catch((error) => {
      expect(true).toBe(false, `Decorate failed, error was [${error}]`);
      done();
    });
  });
});
