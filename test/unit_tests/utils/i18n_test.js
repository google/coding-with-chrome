/**
 * @fileoverview i18n tests.
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
goog.require('cwc.utils.I18n');


describe('i18n', function() {
  var i18nUtils = new cwc.utils.I18n();

  it ('prepare', function(done) {
    i18nUtils.prepare(function() {
      expect(true);
      done();
    });
  });

  it ('translate - fallback', function() {
    var randomString = Math.random().toString(36);
    expect(i18nUtils.translate(randomString)).toEqual(randomString);
    expect(i18nUtils.translate(randomString + '!')).toEqual(randomString + '!');
    expect(i18nUtils.translate(randomString.toLowerCase()))
      .toEqual(randomString.toLowerCase());
    expect(i18nUtils.translate(randomString.toUpperCase()))
      .toEqual(randomString.toUpperCase());
  });

  it ('translate', function() {
    var testString = 'hello world';
    expect(i18nUtils.translate(testString, {lng: 'de'}))
      .toEqual('Hallo Welt');
    expect(i18nUtils.translate(testString, {lng: 'en'}))
      .toEqual('hello world');
    expect(i18nUtils.translate(testString, {lng: 'ko'}))
      .toEqual('안녕하세요 세계');
  });

});
