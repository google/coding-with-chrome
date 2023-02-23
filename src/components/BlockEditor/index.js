/**
 * @license Copyright 2022 The Coding with Chrome Authors.
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
 * @author mbordihn@google.com (Markus Bordihn)
 *
 * @fileoverview Editor for the desktop screen.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { BlocklyWorkspace } from 'react-blockly';
import { WindowManager } from '../Desktop/WindowManager';

import styles from './style.module.css';

/**
 *
 */
export class BlockEditor extends React.PureComponent {
  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.windowId = props.windowId;
    this.blockEditorInstance = null;

    this.state = {
      xml: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="text" x="70" y="30"><field name="TEXT"></field></block></xml>',
      javascriptCode: '',
    };

    // Adding additional event listener for close and refresh.
    if (this.windowId) {
      WindowManager.addResizeEventListener(this.windowId, () => {
        this.resize();
      });
    }
  }

  /**
   * @param {any} newValue
   */
  onChange(newValue) {
    console.log('change', newValue, this.blockEditorInstance);
  }

  /**
   * @param {any} blockEditorInstance
   */
  onLoad(blockEditorInstance) {
    this.blockEditorInstance = blockEditorInstance;
    console.debug('Editor Instance: ', this.blockEditorInstance);
  }

  /**
   * Resize editor content to parent container.
   */
  resize() {
    if (this.blockEditorInstance) {
      console.log(this.blockEditorInstance);
      window.dispatchEvent(new Event('resize'));
    }
  }

  /**
   * @return {*}
   */
  getToolboxCategory() {
    const toolboxCategories = {
      kind: 'categoryToolbox',
      contents: [
        {
          kind: 'category',
          name: 'Logic',
          colour: '#5C81A6',
          contents: [
            {
              kind: 'block',
              type: 'controls_if',
            },
            {
              kind: 'block',
              type: 'logic_compare',
            },
          ],
        },
        {
          kind: 'category',
          name: 'Math',
          colour: '#5CA65C',
          contents: [
            {
              kind: 'block',
              type: 'math_round',
            },
            {
              kind: 'block',
              type: 'math_number',
            },
          ],
        },
        {
          kind: 'category',
          name: 'Custom',
          colour: '#5CA699',
          contents: [
            {
              kind: 'block',
              type: 'new_boundary_function',
            },
            {
              kind: 'block',
              type: 'return',
            },
          ],
        },
      ],
    };
    return toolboxCategories;
  }

  /**
   * @return {Object}
   */
  render() {
    return (
      <React.StrictMode>
        <BlocklyWorkspace
          className={styles.fill}
          toolboxConfiguration={this.getToolboxCategory()} // this must be a JSON toolbox definition
          initialXml={this.state.xml}
          onInject={this.onLoad.bind(this)}
          onXmlChange={(content) => this.setState({ xml: content })}
        />
      </React.StrictMode>
    );
  }
}

BlockEditor.propTypes = {
  windowId: PropTypes.string.isRequired,
};
