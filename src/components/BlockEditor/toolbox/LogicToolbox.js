/**
 * @license Copyright 2023 The Coding with Chrome Authors.
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
 * @fileoverview Logic Toolbox for Blockly.
 * @author mbordihn@google.com (Markus Bordihn)
 */

/**
 * @type {array}
 */
export const defaultBlocks = [
  {
    kind: 'block',
    type: 'controls_if',
  },
  {
    kind: 'block',
    type: 'logic_compare',
  },
  {
    kind: 'block',
    type: 'logic_operation',
  },
  {
    kind: 'block',
    type: 'logic_negate',
  },
  {
    kind: 'block',
    type: 'logic_boolean',
  },
  {
    kind: 'block',
    type: 'logic_null',
  },
  {
    kind: 'block',
    type: 'logic_ternary',
  },
];

export default {
  defaultBlocks,
};
