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
 * @fileoverview Phaser Blocks builder.
 * @author mbordihn@google.com (Markus Bordihn)
 */

/**
 * Blocks Builder.
 */
export class PhaserBlocksBuilder {
  static basePath = location.host.endsWith('.github.io')
    ? location.pathname
    : '/';

  /**
   * @param {string} name
   * @param {string} url
   * @param {string} dataURL
   * @return {Object}
   */
  static getStaticImageFileBlock(name, url, dataURL) {
    const filename = url ? url.substring(url.lastIndexOf('/') + 1) : name;
    return {
      kind: 'block',
      blockxml: `
  <block type="phaser_load_image">
    <field name="name">${name}</field>
    <value name="image">
      <block type="static_image_file">
        <field name="filename">${filename}</field>
        <field name="url">${url}</field>
        <field name="urlData">${dataURL}</field>
      </block>
    </value>
  </block>`,
    };
  }

  /**
   * @param {string} name
   * @param {string} filename
   * @param {string} url
   * @param {string} dataURL
   * @return {Object}
   */
  static getDynamicImageFileBlock(name, filename, url, dataURL) {
    return {
      kind: 'block',
      blockxml: `
  <block type="phaser_load_image">
    <field name="name">${name}</field>
    <value name="image">
      <block type="dynamic_image_file">
        <field name="filename">${
          filename || url ? url.substring(url.lastIndexOf('/') + 1) : name
        }</field>
        <field name="url">${url}</field>
        <field name="urlData">${dataURL}</field>
      </block>
    </value>
  </block>`,
    };
  }
}
