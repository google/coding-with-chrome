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

import React, { createRef } from 'react';
import PropTypes from 'prop-types';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CodeIcon from '@mui/icons-material/Code';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import PreviewIcon from '@mui/icons-material/Preview';
import RedoIcon from '@mui/icons-material/Redo';
import Toolbar from '@mui/material/Toolbar';
import UndoIcon from '@mui/icons-material/Undo';
import { v4 as uuidv4 } from 'uuid';

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import { BlocklyWorkspace, WorkspaceSvg } from 'react-blockly';
import { CodeEditor } from './../CodeEditor';
import { WindowManager } from '../Desktop/WindowManager';
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import { WindowResizeEvent } from '../Desktop/WindowManager/Events';
import { javascriptGenerator } from 'blockly/javascript';

import 'material-icons/iconfont/material-icons.css';
import styles from './style.module.css';
import './style.global.css';
import { PreviewService } from '../../service-worker/preview-service-worker';

/**
 *
 */
export class BlockEditor extends React.PureComponent {
  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.projectId = props.projectId || uuidv4();
    this.blockyWorkspace = null;
    this.codeEditor = createRef();
    this.toolbar = createRef();

    this.state = {
      showEditor: false,
      xml: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="text" x="70" y="30"><field name="TEXT"></field></block></xml>',
      javascriptCode: '',
    };

    WindowManager.windowManagerEventTarget.addEventListener(
      'windowResize',
      this.handleWindowResize.bind(this)
    );
  }

  /**
   *
   */
  showBlockEditor() {
    console.log('Show Block Editor ...');
    this.setState({ showEditor: false });
  }

  /**
   *
   */
  showPreview() {
    console.log('Show Preview ...');
    const code = this.getWorkspaceCode();
    PreviewService.saveHTMLFile(`${this.projectId}/`, code);
  }

  /**
   *
   */
  async showCodeEditor() {
    console.log('Show Code Editor ...');
    const code = this.getWorkspaceCode();
    if (this.codeEditor) {
      this.codeEditor.current.setValue(code);
    }
    this.setState({ showEditor: true });
  }

  /**
   * @return {string}
   */
  getWorkspaceCode() {
    let code = javascriptGenerator.workspaceToCode(this.blockyWorkspace) || '';
    if (this.props.template && typeof this.props.template === 'function') {
      code = this.props.template(code, this.projectId);
    }
    return code;
  }

  /**
   * Handle Blocks undo
   */
  handleUndo() {
    console.log('Undo ...');
    this.blockyWorkspace?.undo(false);
  }

  /**
   * Handle Blockly redo
   */
  handleRedo() {
    console.log('Redo ...');
    this.blockyWorkspace?.undo(true);
  }

  /**
   * @param {any} newValue
   */
  onChange(newValue) {
    console.log('change', newValue, this.blockyWorkspace);
  }

  /**
   * @param {WorkspaceSvg} blockEditorInstance
   */
  onLoad(blockEditorInstance) {
    this.blockyWorkspace = blockEditorInstance;
    this.resize();
  }

  /**
   * Handle window resize
   * @param {WindowResizeEvent} event
   */
  handleWindowResize(event) {
    if (event.getWindowId() != this.props.windowId) {
      return;
    }
    this.resize();
  }

  /**
   * Reset zoom and center blocks.
   */
  resetZoom() {
    this.blockyWorkspace?.setScale(1);
    this.blockyWorkspace?.scrollCenter();
  }

  /**
   * Resize editor content to parent container.
   */
  resize() {
    if (this.blockyWorkspace) {
      const parentElement =
        this.blockyWorkspace.getInjectionDiv().closest('.wb-body') ||
        this.blockyWorkspace.getInjectionDiv().parentElement;
      console.log(parentElement);
      if (parentElement) {
        const injectionDiv =
          this.blockyWorkspace.getInjectionDiv().parentElement;
        if (injectionDiv && injectionDiv != parentElement) {
          if (this.toolbar.current) {
            injectionDiv.style.height =
              parentElement.clientHeight -
              this.toolbar.current.clientHeight +
              'px';
          } else {
            injectionDiv.style.height = parentElement.clientHeight + 'px';
          }
        }
      }
      window.dispatchEvent(new Event('resize'));
      this.resetZoom();
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
        <Box sx={{ display: this.state.showEditor ? 'none' : 'block' }}>
          <AppBar position="static">
            <Toolbar
              variant="dense"
              className={styles.toolbar}
              ref={this.toolbar}
            >
              <IconButton edge="start" color="inherit" aria-label="menu">
                <MenuIcon />
              </IconButton>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="undo"
                onClick={this.handleUndo.bind(this)}
              >
                <UndoIcon />
              </IconButton>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="redo"
                onClick={this.handleRedo.bind(this)}
              >
                <RedoIcon />
              </IconButton>
              <Button variant="contained">Create new Variable</Button>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="preview"
                onClick={this.showPreview.bind(this)}
              >
                <PreviewIcon />
              </IconButton>
              {this.codeEditor && (
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="code"
                  onClick={this.showCodeEditor.bind(this)}
                >
                  <CodeIcon />
                </IconButton>
              )}
            </Toolbar>
          </AppBar>
          <BlocklyWorkspace
            className={this.props.windowId ? styles.fillWindow : styles.fill}
            toolboxConfiguration={
              this.props.toolbox || this.getToolboxCategory()
            }
            workspaceConfiguration={{
              grid: {
                spacing: 20,
                length: 3,
                colour: '#ccc',
                snap: true,
              },
              zoom: {
                controls: true,
                startScale: 0.9,
                maxScale: 3,
                minScale: 0.3,
                scaleSpeed: 1.2,
              },
              trashcan: false,
            }}
            initialXml={this.props.content || ''}
            onInject={this.onLoad.bind(this)}
            onXmlChange={(content) => this.setState({ xml: content })}
          />
        </Box>
        <Box sx={{ display: this.state.showEditor ? 'block' : 'none' }}>
          <CodeEditor
            windowId={this.props.windowId}
            blockEditor={this}
            ref={this.codeEditor}
          ></CodeEditor>
        </Box>
      </React.StrictMode>
    );
  }
}

BlockEditor.propTypes = {
  content: PropTypes.string,
  projectId: PropTypes.string,
  template: PropTypes.func,
  toolbox: PropTypes.object,
  windowId: PropTypes.string,
};
