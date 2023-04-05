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
 * @fileoverview Code Editor.
 * @author mbordihn@google.com (Markus Bordihn)
 */

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import { Ace } from 'ace-builds';
import AceEditor from 'react-ace';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CodeIcon from '@mui/icons-material/Code';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import PreviewIcon from '@mui/icons-material/Preview';
import PropTypes from 'prop-types';
import React from 'react';
import RedoIcon from '@mui/icons-material/Redo';
import Toolbar from '@mui/material/Toolbar';
import UndoIcon from '@mui/icons-material/Undo';
import { v4 as uuidv4 } from 'uuid';

import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-github';

import { WindowManager } from '../Desktop/WindowManager';
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import { WindowResizeEvent } from '../Desktop/WindowManager/Events';

import styles from './style.module.css';
import { PreviewService } from '../../service-worker/preview-service-worker';

/**
 *
 */
export class CodeEditor extends React.PureComponent {
  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.projectId = props.projectId || uuidv4();
    this.editorInstance = null;
    this.toolbar = React.createRef();
    this.infobar = React.createRef();

    // Adding event listener for window resize, if windowId is set.
    if (this.props.windowId) {
      WindowManager.windowManagerEventTarget.addEventListener(
        'windowResize',
        this.handleWindowResize.bind(this)
      );
    }

    console.log('Adding code editor with project id: ', this.projectId);
  }

  /**
   * @param {string} content
   */
  setValue(content) {
    console.log('Set editor content:', content);
    this.editorInstance?.setValue(content, 0);
  }

  /**
   * @return {string}
   */
  getValue() {
    return this.editorInstance?.getValue() || '';
  }

  /**
   * Handle Editor undo
   */
  handleUndo() {
    this.editorInstance?.undo();
  }

  /**
   * Handle Editor redo
   */
  handleRedo() {
    this.editorInstance?.redo();
  }

  /**
   * @param {any} newValue
   */
  onChange(newValue) {
    console.log('change', newValue, this.editorInstance);
  }

  /**
   * @param {Ace.Editor} editorInstance
   */
  onLoad(editorInstance) {
    this.editorInstance = editorInstance;
    console.debug('Editor Instance: ', this.editorInstance);
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
    console.log('Handle window resize from:', event.getWindowId());
    this.resize();
  }

  /**
   * Handle Preview
   */
  handlePreview() {
    PreviewService.saveHTMLFile('index.html', this.getValue());
  }

  /**
   * Resize editor content to parent container.
   */
  resize() {
    if (this.editorInstance) {
      if (this.editorInstance.container) {
        const parentElement =
          this.editorInstance.container.closest('.wb-body') ||
          this.editorInstance.container.parentElement;
        if (
          parentElement &&
          parentElement.clientHeight > 100 &&
          parentElement.clientWidth > 100
        ) {
          if (this.toolbar.current != null && this.infobar.current != null) {
            this.editorInstance.container.style.height =
              parentElement.clientHeight -
              this.toolbar.current.clientHeight -
              this.infobar.current.clientHeight -
              1 +
              'px';
          } else {
            this.editorInstance.container.style.height =
              parentElement.clientHeight + 'px';
          }
          this.editorInstance.container.style.width =
            parentElement.clientWidth + 'px';
        }
        this.editorInstance.resize();
      }
    }
  }

  /**
   * @return {Object}
   */
  render() {
    return (
      <React.StrictMode>
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
            {this.props.blockEditor && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="code"
                onClick={this.props.blockEditor.showBlockEditor.bind(
                  this.props.blockEditor
                )}
              >
                <CodeIcon />
              </IconButton>
            )}
            <IconButton
              edge="start"
              color="inherit"
              aria-label="preview"
              onClick={this.handlePreview.bind(this)}
            >
              <PreviewIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <AceEditor
          mode="java"
          theme="github"
          onLoad={this.onLoad.bind(this)}
          onChange={this.onChange.bind(this)}
          name={this.props.windowId + '_editor'}
          editorProps={{ $blockScrolling: true }}
        />
        <Box className={styles.infobar} ref={this.infobar}>
          Test
        </Box>
      </React.StrictMode>
    );
  }
}

CodeEditor.propTypes = {
  blockEditor: PropTypes.object,
  projectId: PropTypes.string,
  windowId: PropTypes.string,
};
