/**
 * @fileoverview Mode Javascript - Advanced
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


describe('[Mode AIY - Advanced]', function() {
  prepareEditor();
  describe('Prepare Mode', function() {
    loadExampleFile('aiy/vision/face_camera_trigger.cwc', it);
    loadExampleFile('aiy/voice/assistant_grpc_demo.cwc', it);
    loadExampleFile('aiy/voice/voice_recorder.cwc', it);
    loadExampleFile('aiy/leds_example.cwc', it);
  });
});
