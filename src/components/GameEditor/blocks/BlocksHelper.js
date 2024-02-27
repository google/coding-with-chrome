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

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import Blockly, { Block } from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

import { BlocksBuilder } from '../../BlockEditor/blocks/BlocksBuilder';
import { PhaserBlocksBuilder } from './PhaserBlocksBuilder';

import i18next from 'i18next';

const reservedPhaserVariables = [
  'add',
  'anims',
  'cache',
  'cameras',
  'children',
  'collision',
  'create',
  'data',
  'default_group',
  'events',
  'game',
  'helper_',
  'input',
  'lights',
  'load',
  'make',
  'physics',
  'plugins',
  'preload',
  'registry',
  'render',
  'renderer',
  'scale',
  'scene',
  'sound',
  'sys',
  'textures',
  'time',
  'tweens',
  'update',
];

/**
 * Simple Blocks Helper
 */
export class BlocksHelper {
  static variableBlockRegExp =
    /<field\s+name\s*=\s*"VAR"\s*>([\s\S]*?)<\/field>/;

  static workspaceXML = '';

  /**
   * @param {string} xml
   */
  static setWorkspaceXML(xml) {
    this.workspaceXML = xml;
  }

  /**
   * @return {string}
   */
  static getWorkspaceXML() {
    return this.workspaceXML;
  }

  /**
   * @param {Object} images
   * @return {!Array}
   */
  static phaserImagesToBlock(images) {
    const blocks = [];
    for (const imageData of images) {
      const imageURL = imageData[1];
      BlocksBuilder.getAsDataURL(imageData[0], imageURL).then((data) => {
        console.log('Add sample image ' + data.name + ' block.');
        blocks.push(
          PhaserBlocksBuilder.getStaticImageFileBlock(
            data.name,
            imageURL,
            data.dataURL,
          ),
        );
      });
    }
    return blocks;
  }

  /**
   * @param {string} name
   * @return {!Array}
   */
  static phaserImage(name) {
    let foundName = false;
    const imageList = [];
    const imageBlocks = Blockly.getMainWorkspace().getBlocksByType(
      'phaser_load_image',
      true,
    );
    for (const imageBlock of imageBlocks) {
      if (
        imageBlock &&
        !imageBlock['disabled'] &&
        imageBlock['childBlocks_'][0] !== undefined
      ) {
        const imageName = imageBlock.getFieldValue('name') || 'unknown';
        const imageSrc =
          imageBlock.getChildren()?.[0]?.getFieldValue('urlData') ||
          imageBlock.getChildren()?.[1]?.getFieldValue('id') ||
          imageBlock.getChildren()?.[1]?.getFieldValue('url');
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
   * @param {Array.<String>} blockTypes
   * @param {String} defaultName
   * @param {String} defaultValue
   * @return {!Array}
   */
  static phaserVariables(
    blockSvg,
    blockTypes = ['phaser_variable_set'],
    defaultName = 'found_no_variable',
    defaultValue = 'default',
  ) {
    // Get all variables for the given block types.
    const variableMap = new Map();
    for (const blockType of blockTypes) {
      const variables = this.phaserVariable(
        blockSvg,
        blockType,
        defaultName,
        defaultValue,
      );
      for (const variable of variables) {
        variableMap.set(variable[0], variable[1]);
      }
    }

    // Remove default variable name and value, if other variables are available.
    if (variableMap.size > 1) {
      variableMap.delete(defaultName);
    }

    return [].concat([...variableMap.entries()]).sort();
  }

  /**
   * @param {BlockSvg} blockSvg
   * @param {String|Array.<String>} blockType
   * @param {String} defaultName
   * @param {String} defaultValue
   * @return {!Array}
   */
  static phaserVariable(
    blockSvg,
    blockType = 'phaser_variable_set',
    defaultName = 'found_no_variable',
    defaultValue = 'default',
  ) {
    const variableMap = new Map();
    const mainWorkspace = Blockly.getMainWorkspace();

    // Get all variables from the workspace.
    const variableBlocks = mainWorkspace.getBlocksByType(blockType);
    for (const variableBlock of variableBlocks) {
      if (variableBlock && !variableBlock['disabled']) {
        const variableName = variableBlock.getFieldValue('VAR') || '';
        if (variableName) {
          variableMap.set(variableName, variableName);
        }
      }
    }

    // Get all variables from the current flyout.
    if (blockSvg?.isInFlyout) {
      const flyoutVariableBlocks = mainWorkspace
        .getFlyout()
        .getWorkspace()
        .getBlocksByType(blockType);
      for (const flyoutVariableBlock of flyoutVariableBlocks) {
        if (flyoutVariableBlock && !flyoutVariableBlock['disabled']) {
          const variableName = flyoutVariableBlock.getFieldValue('VAR') || '';
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
            flyoutItem.blockxml,
          );
          if (variableName) {
            variableMap.set(variableName, variableName);
          }
        }
      }
    }

    // Check xml for any missing cross referenced variables, which are not
    // loaded in sequence like class definitions.
    if (this.getWorkspaceXML()) {
      const variables = this.extractBlockXMLVariablesName(
        this.getWorkspaceXML(),
        blockType,
      );
      for (const variable of variables) {
        variableMap.set(variable, variable);
      }
    }

    // Add default variable name and value, if no variable is available.
    if (variableMap.size === 0) {
      variableMap.set(defaultName, defaultValue);
    }

    return [].concat([...variableMap.entries()]).sort();
  }

  /**
   * @param {Block} block
   * @param {String} variableType
   * @return {string}
   */
  static getVariableName(block, variableType = '') {
    let variableName = block.getFieldValue('VAR');
    if (!variableName.startsWith('this')) {
      variableName = 'this.' + variableName;
    }
    if (variableType && !variableName.endsWith(variableType)) {
      variableName += variableType;
    }
    return [variableName, javascriptGenerator.ORDER_ATOMIC];
  }

  /**
   * @param {Block} block
   * @return {string}
   */
  static getSceneName(block) {
    let variableName = block.getFieldValue('VAR');
    if (!variableName.startsWith('Scene')) {
      variableName = variableName + 'Scene';
    }
    return [variableName, javascriptGenerator.ORDER_ATOMIC];
  }

  /**
   * @param {Block} block
   */
  static checkSceneName(block) {
    const variableName = block.getFieldValue('VAR') + 'Scene';
    if (!variableName) {
      block.setWarningText(i18next.t('WARNING.NO_VARIABLE_DEFINED'));
    } else if (reservedPhaserVariables.includes(variableName)) {
      block.setWarningText(i18next.t('WARNING.RESERVED_VARIABLE_NAME'));
    } else {
      block.setWarningText(null);
    }
  }

  /**
   * @param {Block} block
   */
  static checkVariableName(block) {
    const variableName = block.getFieldValue('VAR');
    if (!variableName) {
      block.setWarningText(i18next.t('WARNING.NO_VARIABLE_DEFINED'));
    } else if (reservedPhaserVariables.includes(variableName)) {
      block.setWarningText(i18next.t('WARNING.RESERVED_VARIABLE_NAME'));
    } else {
      block.setWarningText(null);
    }
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
   * @param {String} blockXML
   * @param {String} blockType
   * @return {Array.<String>}
   */
  static extractBlockXMLVariablesName(
    blockXML,
    blockType = 'phaser_variable_set',
  ) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(blockXML, 'text/xml');
    const variableNodes = xmlDoc.getElementsByTagName('block');
    const variables = [];

    for (const variableNode of variableNodes) {
      const typeAttribute = variableNode.getAttribute('type');
      const fieldNode = variableNode.getElementsByTagName('field')[0];

      if (typeAttribute === blockType && fieldNode) {
        const variableValue = fieldNode.textContent.trim();
        variables.push(variableValue);
      }
    }
    return variables;
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

  /**
   * @param {string} value
   * @return {string}
   */
  static validateVariableName(value) {
    return value.replace(/^[^a-zA-Z_]+|[^a-zA-Z0-9_]+/g, '') || 'variable';
  }
}
