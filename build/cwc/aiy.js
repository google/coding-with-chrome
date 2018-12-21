/**
 * @fileoverview BUILD configuration for Coding with Chrome AIY examples.
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
 * @deprecated This script is a temporary method for creating tutorial files
 *             until we develop support for editing them.
 */
let fs = require('fs');
let path = require('path');
let makeDir = require('make-dir');
let inDir = path.join(__dirname,
  '../../third_party/aiyprojects-raspbian/src/examples');
let outDir = path.join(__dirname,
  './../../genfiles/core/resources/examples/aiy');

let examples = [
  'voice/voice_recorder.py',
  'voice/assistant_grpc_demo.py',
  'vision/joy/joy_detection_demo.py',
  'vision/image_classification_camera.py',
  'button_led.py',
  'leds_example.py',

  // TODO(carheden): These don't work with my voice kit, possibly
  // due to hardware options
  // 'gpiozero/bonnet_button.py',
  // 'gpiozero/button_example.py',
  // 'gpiozero/led_chaser.py',
  // 'gpiozero/led_example.py',
  // 'gpiozero/servo_example.py',
  // 'gpiozero/simple_button_example.py',

  // TODO(carheden): These require API keys, which we can't set up from CwC yet.
  // 'buzzer/buzzer_demo.py',
  // 'voice/assistant_library_demo.py',
  // 'voice/assistant_library_with_button_demo.py',
  // 'voice/assistant_library_with_local_commands_demo.py',
  // 'voice/cloudspeech_demo.py',


  // TODO(carheden): These examples require files in addition to the code.
  // Figure out how to push additional files to the AIY or modify them to use
  //  a single file.
  // 'buzzer/buzzer_tracker_demo.py',
  // 'vision/object_meter/object_meter.py',
  // 'vision/object_meter/wordnet_grouping/mapping_data.py',
  // 'vision/object_meter/wordnet_grouping/category_mapper.py',

  // TODO(carheden): These expect command line agruments. Modify them to work
  // from CwC
  // 'vision/any_model_camera.py',
  // 'vision/dish_classification.py',
  // 'vision/dish_detection.py',
  // 'vision/face_detection_camera.py',
  // 'vision/face_detection.py',
  // 'vision/face_detection_raspivid.py',
  // 'vision/image_classification.py',
  // 'vision/inaturalist_classification.py',
  // 'vision/mobilenet_based_classifier.py',
  // 'vision/object_detection.py',
  // 'vision/video_capture/video_capture.py',
  // 'vision/face_camera_trigger.py',
];

let normalizeTitle = function(title) {
  return title.replace(/_/g, ' ')
    .replace(/ \w/g, (part) => part.toUpperCase())
    .replace(/^\w/g, (part) => part.toUpperCase());
};

/*
 * We have to encapsulate python code in for AIY in a .cwc file to
 * force it to use the AIY CwC mode mode.
 *
 * TODO(fstanis/carheden/mbordihn): If user open an AIY python file from the
 * menus, they won't be able to use AIY because cwc will load the wrong mode.
 * Consider an 'activate AIY' button in the Python mode or something.
 */
let pyToAIYCwc = function(python) {
  return {
    'content': {
      '__python__': {
        'content': fs.readFileSync(python, 'utf8'),
        'name': '__python__',
        'size': fs.statSync(python).size,
        'type': 'text/x-python',
        'version': 1,
      },
    },
    'files': {},
    'flags': {},
    'format': 'Coding with Chrome File Format 3',
    'frameworks': {},
    'history': '',
    'metadata': {
      '__default__': {
        'author': 'AIY Projects Team',
        'title': normalizeTitle(path.basename(python, '.py')),
        'version': '1.0',
      },
    },
    'mode': 'aiy',
    'ui': 'default',
    'view': '__python',
  };
};


examples.forEach((python) => {
  let pythonPath = fs.realpathSync(path.join(inDir, python));
  let cwcObject = pyToAIYCwc(pythonPath);
  let cwcJSON = JSON.stringify(cwcObject, null, '  ');
  let cwcDirFragment = path.dirname(python);
  let cwcFileName = path.basename(python, '.py') + '.cwc';
  let cwcPath = path.join(outDir, cwcDirFragment, cwcFileName);
  makeDir(path.dirname(cwcPath)).then(() => {
    fs.writeFile(cwcPath, cwcJSON, (err) => {
      if (err) {
        throw err;
      }
      console.log(`\t${pythonPath} ->\n\t\t ${cwcPath}`);
    });
  });
});
