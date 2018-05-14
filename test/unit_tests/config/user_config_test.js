/**
 * @fileoverview User config tests.
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
goog.require('cwc.UserConfig');


describe('UserConfig', function() {
  it('constructor', function() {
    expect(typeof new cwc.UserConfig()).toEqual('object');
  });

  it('prepare', function(done) {
    let userConfig = new cwc.UserConfig();
    userConfig.prepare().then(() => {
      expect(true).toEqual(true);
      done();
    }, (error) => {
      expect(error).toEqual(null);
      done();
    });
  });

  it('set / get', function(done) {
    let userConfig = new cwc.UserConfig();
    userConfig.prepare().then(() => {
      userConfig.set('a', 'b', 'c');
      expect(userConfig.get('a', 'b')).toEqual('c');
      expect(userConfig.get('a', 'c')).toEqual(undefined);
      done();
    }, (error) => {
      expect(error).toEqual(null);
      done();
    });
    expect(typeof new cwc.UserConfig()).toEqual('object');
  });

  it('getAll', function(done) {
    let userConfig = new cwc.UserConfig();
    userConfig.prepare().then(() => {
      userConfig.set('a', '1', 'a1');
      userConfig.set('a', '2', 'a2');
      userConfig.set('a', '3', 'a3');
      userConfig.set('b', '1', 'b1');
      userConfig.set('b', '2', 'b2');
      userConfig.set('b', '3', 'b3');
      let result = userConfig.getAll('a');
      expect(result.get('1')).toEqual('a1');
      expect(result.get('2')).toEqual('a2');
      expect(result.get('3')).toEqual('a3');
      expect(result.get('4')).toEqual(undefined);
      done();
    }, (error) => {
      expect(error).toEqual(null);
      done();
    });
    expect(typeof new cwc.UserConfig()).toEqual('object');
  });
});
