/**
 * @fileoverview Mode Basic - Advanced
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


describe('[Mode Basic - Advanced]', function() {
  document.body.insertAdjacentHTML('afterbegin', '<div id="cwc-editor"></div>');
  let builder = new cwc.ui.Builder();

  describe('Prepare Mode', function() {
    beforeAll(function(done) {
      builder.decorate(null, function() {
        done();
      });
    });

    loadTemplateFile('basic/blank.cwc', builder, it);
    loadExampleFile('basic/script/Draw-Portal-Turret.cwc', builder, it);
    loadExampleFile('basic/script/Hello-World.cwc', builder, it);
    loadExampleFile('basic/script/Line-Loop.cwc', builder, it);
    loadExampleFile('basic/script/Point-Loop.cwc', builder, it);
    loadExampleFile('basic/script/Text-Loop.cwc', builder, it);
  });
});
