/**
 * @fileoverview Modern audio preload patch for Blockly.
 *
 * @license Copyright 2016 The Coding with Chrome Authors.
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
 * Preload all the audio files so that they play quickly when asked for.
 * @package
 */
Blockly.WorkspaceAudio.prototype.preload = function() {
  for (let name in this.SOUNDS_) {
    let sound = this.SOUNDS_[name];
    sound.volume = 0.01;
    let playPromise = sound.play();
    if (playPromise !== undefined) {
      playPromise.then((e) => {
        sound.pause();
      });
    }
    // iOS can only process one sound at a time.  Trying to load more than one
    // corrupts the earlier ones.  Just load one and leave the others uncached.
    if (goog.userAgent.IPAD || goog.userAgent.IPHONE) {
      break;
    }
  }
};
