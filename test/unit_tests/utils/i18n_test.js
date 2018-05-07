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


describe('i18n', function() {
  it('constructor', function() {
    expect(typeof new cwc.utils.I18n()).toEqual('object');
  });

  it('translate - fallback', function() {
    let i18nUtils = new cwc.utils.I18n();
    let randomString = Math.random().toString(36);
    expect(i18nUtils.translate(randomString)).toEqual(randomString);
    expect(
      i18nUtils.translate(randomString + '!')).toEqual(randomString + '!');
    expect(i18nUtils.translate(randomString.toLowerCase()))
      .toEqual(randomString.toLowerCase());
    expect(i18nUtils.translate(randomString.toUpperCase()))
      .toEqual(randomString.toUpperCase());
  });

  it('translate - old', function() {
    let i18nUtils = new cwc.utils.I18n();
    let testString = 'Hello, World';
    expect(i18nUtils.translate(testString)).toEqual('Hello, World');
  });

  it('translate', function() {
    window['Locales'] = Locales || {};
    window['Locales']['deu'] = Locales['deu'] || {};
    window['Locales']['deu']['TEST'] = {
      'HELLO_WORLD': 'Hallo Welt',
      'WORLD_HELLO': 'Welt hallo',
      'HELLO_NAME': 'Hallo {$name}.',
    };
    let i18nUtils = new cwc.utils.I18n();
    i18nUtils.setLanguage('deu');
    expect(i18nUtils.translate('@@TEST__HELLO_WORLD')).toEqual('Hallo Welt');
    expect(i18nUtils.translate('@@TEST__WORLD_HELLO')).toEqual('Welt hallo');
    expect(i18nUtils.translate('@@TEST__NONE')).toEqual('@@TEST__NONE');
    expect(i18nUtils.translate('@@NONE__WORLD_HELLO')).toEqual(
      '@@NONE__WORLD_HELLO');
    expect(i18nUtils.translate('@@TEST__HELLO_NAME')).toEqual('Hallo {$name}.');
    expect(i18nUtils.translate('{$name}', {
      'name': {
        'content': '@@TEST__HELLO_WORLD',
      },
    })).toEqual('Hallo Welt');
    expect(i18nUtils.translate('@@TEST__HELLO_NAME', {'name': 'Welt'}))
      .toEqual('Hallo Welt.');
    i18nUtils.setLanguage('test');
    expect(i18nUtils.translate('@@TEST__HELLO_WORLD')).toEqual(
      '@@TEST__HELLO_WORLD');
  });

  it('setLanguage', function() {
    let i18nUtils = new cwc.utils.I18n();
    window['Locales'] = null;
    expect(i18nUtils.setLanguage('eng')).toEqual('eng');
    expect(i18nUtils.setLanguage('deu')).toEqual('deu');
    expect(i18nUtils.setLanguage()).toEqual('deu');
    window['Locales'] = {};
    expect(i18nUtils.setLanguage()).toEqual('deu');
  });

  it('setSupportedLanguages', function() {
    let i18nUtils = new cwc.utils.I18n();
    i18nUtils.setSupportedLanguages(['deu', 'eng']);
    expect(i18nUtils.supportedLanguages).toEqual(['deu', 'eng']);
  });

  it('getSupportedLanguages', function() {
    let i18nUtils = new cwc.utils.I18n();
    i18nUtils.supportedLanguages = ['deu', 'eng'];
    expect(i18nUtils.getSupportedLanguages()).toEqual(['deu', 'eng']);
  });

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
