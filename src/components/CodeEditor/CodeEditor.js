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
 * @fileoverview Code Editor.
 * @author mbordihn@google.com (Markus Bordihn)
 */

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CodeIcon from '@mui/icons-material/Code';
import CodeMirror from '@uiw/react-codemirror';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import PreviewIcon from '@mui/icons-material/Preview';
import PropTypes from 'prop-types';
import React from 'react';
import RedoIcon from '@mui/icons-material/Redo';
import Toolbar from '@mui/material/Toolbar';
import UndoIcon from '@mui/icons-material/Undo';
import { redo, undo } from '@codemirror/commands';
import { v4 as uuidv4 } from 'uuid';

import { WindowManager } from '../Desktop/WindowManager';
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import { WindowResizeEvent } from '../Desktop/WindowManager/Events';
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import { EditorState } from '@codemirror/state';
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import { EditorView } from '@codemirror/view';

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
    this.toolbar = React.createRef();
    this.infobar = React.createRef();
    this.state = {
      /** @type {string} */
      content: props.content || '',

      /** @type {EditorState|null} */
      editorState: null,

      /** @type {EditorView|null} */
      editorView: null,
    };

    // Adding event listener for window resize, if windowId is set.
    if (this.props.windowId) {
      WindowManager.windowManagerEventTarget.addEventListener(
        'windowResize',
        this.handleWindowResize.bind(this)
      );
    } else {
      window.addEventListener('resize', this.resize.bind(this));
    }

    console.log('Adding code editor with project id: ', this.projectId);
  }

  /**
   * @param {string} content
   */
  setValue(content) {
    console.log('Set editor content:', content);
    this.setState({ content });
  }

  /**
   * @return {string}
   */
  getValue() {
    return this.state.content || '';
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
   * Handle Editor undo
   */
  handleUndo() {
    if (this.state.editorView) {
      undo({
        state: this.state.editorView.state,
        dispatch: this.state.editorView.dispatch,
      });
    }
  }

  /**
   * Handle Preview
   */
  handlePreview() {
    PreviewService.saveHTMLFile('index.html', this.getValue());
  }

  /**
   * Handle Editor redo
   */
  handleRedo() {
    if (this.state.editorView) {
      redo({
        state: this.state.editorView.state,
        dispatch: this.state.editorView.dispatch,
      });
    }
  }

  /**
   * @param {any} content
   */
  onChange(content) {
    console.log('change', content);
    this.setState({ content });
  }

  /**
   * @param {EditorView} editorView
   * @param {EditorState} editorState
   */
  onCreateEditor(editorView, editorState) {
    this.setState({ editorView, editorState }, () => {
      this.resize();
    });
  }

  /**
   * Resize editor content to parent container.
   */
  resize() {
    if (this.state.editorView) {
      if (this.state.editorView.dom) {
        const editorElement = this.state.editorView.dom;
        const parentElement =
          editorElement.closest('.wb-body') ||
          editorElement.closest('.mosaic-tile') ||
          editorElement.parentElement;
        if (
          parentElement &&
          parentElement.clientHeight > 100 &&
          parentElement.clientWidth > 100
        ) {
          if (this.toolbar.current != null && this.infobar.current != null) {
            editorElement.style.height =
              parentElement.clientHeight -
              this.toolbar.current.clientHeight -
              this.infobar.current.clientHeight -
              1 +
              'px';
          } else {
            editorElement.style.height = parentElement.clientHeight + 'px';
          }
        }
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
        <CodeMirror
          value={this.state.content}
          onCreateEditor={this.onCreateEditor.bind(this)}
          onChange={this.onChange.bind(this)}
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
  content: PropTypes.string,
  projectId: PropTypes.string,
  windowId: PropTypes.string,
};
