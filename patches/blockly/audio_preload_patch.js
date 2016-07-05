/**
 * @fileoverview Modern audio preload patch for Blockly.
 *
 * @license Copyright 2016 Google Inc. All Rights Reserved.
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



/**
 * Load an audio file.  Cache it, ready for instantaneous playing.
 * @param {!Array.<string>} filenames List of file types in decreasing order of
 *   preference (i.e. increasing size).  E.g. ['media/go.mp3', 'media/go.wav']
 *   Filenames include path from Blockly's root.  File extensions matter.
 * @param {string} name Name of sound.
 * @private
 */
Blockly.WorkspaceSvg.prototype.loadAudio_ = function(filenames, name) {
  if (!filenames.length) {
    return;
  }
  try {
    var audioTest = new window['Audio']();
  } catch (e) {
    // No browser support for Audio.
    // IE can throw an error even if the Audio object exists.
    return;
  }
  var sound;
  for (var i = 0; i < filenames.length; i++) {
    var filename = filenames[i];
    var ext = filename.match(/\.(\w+)$/);
    if (ext && audioTest.canPlayType('audio/' + ext[1])) {
      // Found an audio format we can play.
      sound = new window['Audio'](filename);
      sound.setAttribute('preload', 'auto');
      break;
    }
  }
  if (sound && sound.play) {
    this.SOUNDS_[name] = sound;
  }
};


/**
 * Preload all the audio files so that they play quickly when asked for.
 * @private
 */
Blockly.WorkspaceSvg.prototype.preloadAudio_ = function() {};
