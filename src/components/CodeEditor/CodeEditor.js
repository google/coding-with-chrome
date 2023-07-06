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

import React, { createRef, lazy } from 'react';

import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import PropTypes from 'prop-types';
import MuiAlert from '@mui/material/Alert';
import i18next from '../App/i18next';

// CodeMirror
const CodeMirror = lazy(() => import('@uiw/react-codemirror'));
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { redo, undo } from '@codemirror/commands';

import CodeEditorToolbar from './CodeEditorToolbar';
import { LanguageDetection } from './LanguageDetection';
import { LanguageType } from './LanguageType';
import { PreviewService } from '../../service-worker/preview-service-worker';
import { WindowEventTarget } from '../Desktop/WindowManager/Events';

import styles from './style.module.css';

/**
 *
 */
export class CodeEditor extends React.PureComponent {
  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.toolbar = createRef();
    this.infobar = createRef();
    this.timer = {
      handleContentChange: null,
    };
    this.lastCode = '';
    this.state = {
      /** @type {LanguageDetection} */
      language: LanguageType.UNKNOWN,

      /** @type {string} */
      content: props.content || '',

      /** @type {string} */
      code: '',

      /** @type {EditorState|null} */
      editorState: null,

      /** @type {EditorView|null} */
      editorView: null,
    };

    // Adding event listener for window resize, if windowId is set.
    if (this.props.windowId) {
      WindowEventTarget.getTarget().addEventListener(
        'windowResize',
        this.handleWindowResize.bind(this)
      );
    } else {
      window.addEventListener('resize', this.resize.bind(this));
    }

    // Try to detect language if content is set.
    if (this.state.content) {
      this.setValue(this.state.content);
    }

    console.log('Adding code editor with project id: ', this.props.project.id);
  }

  /**
   *
   */
  componentDidMount() {
    // Adding event listener for language change.
    i18next.on('languageChanged', () => {
      this.forceUpdate();
    });
  }

  /**
   * @param {string} content
   */
  setValue(content) {
    console.log('Set editor content:', content);
    if (this.state.language === LanguageType.UNKNOWN) {
      console.log('Try to detect language ...');
      const language = LanguageDetection.detectByContent(content);
      if (language !== LanguageType.UNKNOWN) {
        console.log('Detected language:', language);
        this.setState({ language });
      }
    }
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
  undo() {
    if (this.state.editorView) {
      undo({
        state: this.state.editorView.state,
        dispatch: this.state.editorView.dispatch,
      });
    }
  }

  /**
   * Handle Editor redo
   */
  redo() {
    if (this.state.editorView) {
      redo({
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
   * @param {any} content
   */
  onChange(content) {
    // Throttle and debounce code change with a 500ms delay for performance.
    if (this.timer.handleContentChange) {
      clearTimeout(this.timer.handleContentChange);
      this.timer.handleContentChange = null;
    }
    this.timer.handleContentChange = setTimeout(() => {
      if (this.lastCode == content) {
        return;
      }
      console.log('Content change', content);
      this.setState({ code: content }, () => {
        if (this.props.onChange && typeof this.props.onChange === 'function') {
          this.props.onChange(content);
        }
      });
      this.lastCode = content;
    }, 200);
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
    if (!this.state.editorView || !this.state.editorView.dom) {
      return;
    }
    const editorElement = this.state.editorView.dom;
    const parentElement =
      editorElement.closest('.wb-body') ||
      editorElement.closest('.mosaic-tile') ||
      editorElement.parentElement;
    if (parentElement) {
      if (
        editorElement.parentElement &&
        editorElement.parentElement != parentElement
      ) {
        const toolbarHeight =
          this.toolbar && this.toolbar.current
            ? this.toolbar.current.clientHeight || 33
            : 0;
        const infobarHeight =
          this.infobar && this.infobar.current
            ? this.infobar.current.clientHeight || 25
            : 0;
        editorElement.style.height =
          parentElement.clientHeight - toolbarHeight - infobarHeight - 1 + 'px';
      } else {
        editorElement.style.height = parentElement.clientHeight + 'px';
      }
    }
  }

  /**
   * @return {Object}
   */
  render() {
    let languageExtensions;
    if (this.state.language === LanguageType.HTML) {
      languageExtensions = html();
    } else if (this.state.language === LanguageType.JAVASCRIPT) {
      languageExtensions = javascript();
    }

    return (
      <React.StrictMode>
        <Box sx={{ display: this.state.showEditor ? 'none' : 'block' }}>
          {this.state.editorView && (
            <CodeEditorToolbar
              ref={this.toolbar}
              blockEditor={this.props.blockEditor}
              codeEditor={this}
              hasChanged={this.state.hasChanged}
              hasSaved={this.state.hasSaved}
              hasUndo={this.state.hasUndo}
              hasRedo={this.state.hasRedo}
              project={this.props.project}
              onFullscreen={this.props.onFullscreen}
              onNewProject={this.props.onNewProject}
              onOpenProject={this.props.onOpenProject}
            />
          )}
          {languageExtensions ? (
            <CodeMirror
              value={this.state.content}
              onCreateEditor={this.onCreateEditor.bind(this)}
              onChange={this.onChange.bind(this)}
              extensions={[languageExtensions]}
            />
          ) : (
            <CodeMirror
              value={this.state.content}
              onCreateEditor={this.onCreateEditor.bind(this)}
              onChange={this.onChange.bind(this)}
            />
          )}
          <Box className={styles.infobar} ref={this.infobar}>
            Content Type: {this.state.language}
          </Box>
          <Snackbar
            open={this.state.snackbarSaved}
            autoHideDuration={6000}
            onClose={() => {
              this.setState({ snackbarSaved: false });
            }}
          >
            <MuiAlert severity="success">
              Project {this.props.project.name} successfully saved!
            </MuiAlert>
          </Snackbar>
        </Box>
      </React.StrictMode>
    );
  }
}

CodeEditor.propTypes = {
  /** @type {string} */
  content: PropTypes.string,

  /** @type {function} */
  onChange: PropTypes.func,

  /** @type {BlockEditor} */
  codeEditor: PropTypes.object,

  /** @type {BlockEditor} */
  blockEditor: PropTypes.object,

  /** @type {Project} */
  project: PropTypes.object.isRequired,

  /** @type {function} */
  onFullscreen: PropTypes.func,

  /** @type {function} */
  onNewProject: PropTypes.func,

  /** @type {function} */
  onOpenProject: PropTypes.func,

  /** @type {string} */
  windowId: PropTypes.string,
};

export default CodeEditor;
