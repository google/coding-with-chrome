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
 * @fileoverview General Blocks helper definition.
 *
 * @author mbordihn@google.com (Markus Bordihn)
 */

import Blockly from 'blockly';

/**
 * Simple Blocks Helper
 */
export class BlocksHelper {
  static variableBlockRegExp =
    /<field\s+name\s*=\s*"VAR"\s*>([\s\S]*?)<\/field>/;

  /**
   * @param {string} name
   * @return {!Array}
   */
  static phaserImage(name) {
    let foundName = false;
    const imageList = [];
    const variables = Blockly.getMainWorkspace().getBlocksByType(
      'phaser_load_image',
      true
    );
    for (const variable of variables) {
      if (
        variable &&
        !variable['disabled'] &&
        variable['childBlocks_'][0] !== undefined
      ) {
        const imageName =
          variable['inputList'][0]['fieldRow'][2]['value_'] || 'unknown';
        const childInputList = variable['childBlocks_'][0]['inputList'];
        const imageSrc =
          childInputList[0]['fieldRow'][0]['value_'] ||
          childInputList[1]['fieldRow'][0]['value_'];
        const imageEntry = [
          imageSrc ? { src: imageSrc, width: 50, height: 50 } : imageName,
          imageName,
        ];
        if (name && imageName === name) {
          imageList.unshift(imageEntry);
          foundName = true;
        } else if (imageEntry) {
          imageList.push(imageEntry);
        }
      }
    }
    if (name && !foundName) {
      imageList.unshift([name, name]);
    }
    if (!imageList.length) {
      imageList.push(['none', 'none']);
    }
    return imageList;
  }

  /**
   * @param {BlockSvg} blockSvg
   * @return {!Array}
   */
  static phaserVariable(blockSvg) {
    const variableMap = new Map();
    const mainWorkspace = Blockly.getMainWorkspace();
    // Get all variables from the workspace.
    const variables = mainWorkspace.getBlocksByType('phaser_variable_set');
    for (const variable of variables) {
      if (variable && !variable['disabled']) {
        const variableName =
          variable['inputList'][0]['fieldRow'][0]['value_'] || '';
        if (variableName) {
          variableMap.set(variableName, variableName);
        }
      }
    }

    // Get all variables from the current flyout.
    if (blockSvg?.isInFlyout) {
      const flyoutVariables = mainWorkspace
        .getFlyout()
        .getWorkspace()
        .getBlocksByType('phaser_variable_set');
      for (const flyoutVariable of flyoutVariables) {
        if (flyoutVariable && !flyoutVariable['disabled']) {
          const variableName =
            flyoutVariable['inputList'][0]['fieldRow'][0]['value_'] || '';
          if (variableName) {
            variableMap.set(variableName, variableName);
          }
        }
      }

      // Check all toolbox items to find any missing pre-defined variables.
      const toolboxItems = mainWorkspace.getToolbox().getToolboxItems();
      for (const toolboxItem of toolboxItems) {
        if (!toolboxItem?.flyoutItems_?.length) {
          continue;
        }
        const flyoutItems = toolboxItem.flyoutItems_;
        for (const flyoutItem of flyoutItems) {
          if (!flyoutItem?.blockxml?.length) {
            continue;
          }
          const variableName = this.extractBlockXMLVariableName(
            flyoutItem.blockxml
          );
          if (variableName) {
            variableMap.set(variableName, variableName);
          }
        }
      }
    }

    // Add default variable if no variable is available.
    if (variableMap.size === 0) {
      variableMap.set('found_no_variable', 'none');
    }

    return [].concat([...variableMap.entries()]).sort();
  }

  /**
   * @param {String} blockXML
   * @return {String}
   */
  static extractBlockXMLVariableName(blockXML) {
    if (!blockXML?.includes('phaser_variable_set')) {
      return '';
    }
    const variableMatch = blockXML.match(this.variableBlockRegExp);
    if (variableMatch) {
      return variableMatch[1].trim();
    }
    return '';
  }

  /**
   * @param {string} text
   * @return {string}
   */
  static validateText(text) {
    return text.replace(/'/g, '').replace(/\\/g, '');
  }

  /**
   * @param {string} value
   * @return {number}
   */
  static validateNumber(value) {
    return Number(value.replace(/[^\d.-]/g, ''));
  }
}
