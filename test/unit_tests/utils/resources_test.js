/**
 * @fileoverview Resources tests.
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
 * @author mbordihn@google.com (Markus Bordihn)
 */
goog.require('cwc.utils.Resources');


describe('Resources', function() {
  let urlPrefix = 'https://raw.githubusercontent.com/' +
    'google/coding-with-chrome/master/';

  it('getUriAsText', function(done) {
    let url = urlPrefix + 'README.md';
     cwc.utils.Resources.getUriAsText(url).then((content) => {
      expect(content.includes('Coding with Chrome')).toEqual(true);
      done();
    });
  });

  it('getUriAsBlob', function(done) {
    let url = urlPrefix + 'README.md';
    cwc.utils.Resources.getUriAsBlob(url).then((blob) => {
      let reader = new FileReader();
      reader.onload = function() {
        expect(reader.result.includes('Coding with Chrome')).toEqual(true);
        done();
      };
      reader.readAsText(blob);
    });
  });

  it('getUriAsBase64', function(done) {
    let url = urlPrefix + 'README.md';
    cwc.utils.Resources.getUriAsBase64(url).then((content) => {
      expect(content.includes('Q29kaW5nIHdpdGggQ2hyb21l')).toEqual(true);
      done();
    });
  });
});
