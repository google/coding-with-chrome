/**
 * @license Copyright 2020 The Coding with Chrome Authors.
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
 */

/**
 * @fileoverview Blocks builder.
 * @author mbordihn@google.com (Markus Bordihn)
 */

/**
 * Blocks Builder.
 */
export class BlocksBuilder {
  /**
   * @param {string} name
   * @param {string} filename
   * @return {Promise}
   */
  static getAsDataURL(name, filename) {
    return fetch(filename).then((response) => {
      return response.blob().then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () =>
              resolve({
                name,
                filename,
                dataURL: reader.result,
              });
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          }),
      );
    });
  }

  /**
   * @param {BlocklyWorkSpace} workspace
   * @param {string} name
   * @param {string} filename
   * @param {string} urlData
   * @param {string} assetId
   */
  static addDynamicImageFileToWorkspace(
    workspace,
    name,
    filename,
    urlData,
    assetId = '',
  ) {
    if (!workspace) {
      console.warn('Unable to load workspace for image block', name);
      return;
    }

    // Adding image block to workspace.
    const phaserLoadImageBlock = workspace.newBlock('phaser_load_image');
    phaserLoadImageBlock.getField('name').setValue(name);
    phaserLoadImageBlock.initSvg();
    phaserLoadImageBlock.render();

    // Adding dynamic image file.
    const dynamicImageFile = workspace.newBlock('dynamic_image_file');
    dynamicImageFile.getField('urlData').setValue(urlData);
    dynamicImageFile.getField('filename').setValue(filename);
    dynamicImageFile.getField('url').setValue(assetId);
    dynamicImageFile.initSvg();
    dynamicImageFile.render();

    // Connecting both blocks.
    phaserLoadImageBlock
      .getInput('image')
      .connection.connect(dynamicImageFile.outputConnection);

    // Connection to workspace blocks.
    const phaserPreloadBlock = workspace.getBlocksByType('phaser_preload')
      ? workspace.getBlocksByType('phaser_preload')[0]
      : false;
    if (phaserPreloadBlock) {
      phaserPreloadBlock
        .getInput('CODE')
        .connection.connect(phaserLoadImageBlock.previousConnection);
    }
  }

  /**
   * @param {BlocklyWorkSpace} workspace
   * @param {string} name
   * @param {string} filename
   * @param {string} urlData
   * @param {string} assetId
   */
  static addDynamicAudioFileToWorkspace(
    workspace,
    name,
    filename,
    urlData,
    assetId = '',
  ) {
    if (!workspace) {
      console.warn('Unable to load workspace for audio block', name);
      return;
    }

    // Adding audio block to workspace.
    const phaserLoadAudioBlock = workspace.newBlock('phaser_load_audio');
    phaserLoadAudioBlock.getField('name').setValue(name);
    phaserLoadAudioBlock.initSvg();
    phaserLoadAudioBlock.render();

    // Adding dynamic audio file.
    const dynamicAudioFile = workspace.newBlock('dynamic_audio_file');
    dynamicAudioFile.getField('urlData').setValue(urlData);
    dynamicAudioFile.getField('filename').setValue(filename);
    dynamicAudioFile.getField('url').setValue(assetId);
    dynamicAudioFile.initSvg();
    dynamicAudioFile.render();

    // Connecting both blocks.
    phaserLoadAudioBlock
      .getInput('audio')
      .connection.connect(dynamicAudioFile.outputConnection);

    // Connection to workspace blocks.
    const phaserPreloadBlock = workspace.getBlocksByType('phaser_preload')
      ? workspace.getBlocksByType('phaser_preload')[0]
      : false;
    if (phaserPreloadBlock) {
      phaserPreloadBlock
        .getInput('CODE')
        .connection.connect(phaserLoadAudioBlock.previousConnection);
    }
  }
}
