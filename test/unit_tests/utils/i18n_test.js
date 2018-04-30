/**
 * @fileoverview i18n tests.
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
goog.require('cwc.utils.I18n');


describe('i18n - Constructor', function() {
  describe('Constructor', function() {
    let i18nUtils = new cwc.utils.I18n();

    it('translate - fallback', function() {
      let randomString = Math.random().toString(36);
      expect(i18nUtils.translate(randomString)).toEqual(randomString);
      expect(
        i18nUtils.translate(randomString + '!')).toEqual(randomString + '!');
      expect(i18nUtils.translate(randomString.toLowerCase()))
        .toEqual(randomString.toLowerCase());
      expect(i18nUtils.translate(randomString.toUpperCase()))
        .toEqual(randomString.toUpperCase());
    });

    it('translate', function() {
      let testString = 'Hello, World';
      expect(i18nUtils.translate(testString)).toEqual('Hello, World');
    });
  });

  describe('Functions', function() {
    it('getISO639_1', function() {
      expect(cwc.utils.I18n.getISO639_1('en')).toEqual('en');
      expect(cwc.utils.I18n.getISO639_1('ja')).toEqual('ja');
      expect(cwc.utils.I18n.getISO639_1('eng')).toEqual('en');
      expect(cwc.utils.I18n.getISO639_1('deu')).toEqual('de');
      expect(cwc.utils.I18n.getISO639_1('jpn')).toEqual('ja');
      expect(cwc.utils.I18n.getISO639_1('kor')).toEqual('ko');
      expect(cwc.utils.I18n.getISO639_1('123')).toEqual('');
    });

    it('bcp47ToISO639_3', function() {
      expect(cwc.utils.I18n.bcp47ToISO639_3('de')).toEqual('deu');
      expect(cwc.utils.I18n.bcp47ToISO639_3('de-DE')).toEqual('deu');
      expect(cwc.utils.I18n.bcp47ToISO639_3('en')).toEqual('eng');
      expect(cwc.utils.I18n.bcp47ToISO639_3('en-US')).toEqual('eng');
      expect(cwc.utils.I18n.bcp47ToISO639_3('123')).toEqual('');
    });
  });
});
