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
 * @author mbordihn@google.com (Markus Bordihn)
 *
 * @fileoverview Panel for the desktop screen.
 */

import React from 'react';
import * as ReactDOM from 'react-dom/client';

import AppsIcon from '@mui/icons-material/Apps';
import CodeIcon from '@mui/icons-material/Code';
import ExtensionIcon from '@mui/icons-material/Extension';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import PreviewIcon from '@mui/icons-material/Preview';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import TerminalIcon from '@mui/icons-material/Terminal';
import Tooltip from '@mui/material/Tooltip';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

import styles from './style.module.css';
import { WindowManager } from '../WindowManager';
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import { WindowCloseEvent } from '../WindowManager/Events';

/**
 *
 */
export class Launcher extends React.PureComponent {
  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = { drawer: false, launcher: true };
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.handleLauncherToggle = this.handleLauncherToggle.bind(this);
    this.openTerminal = this.openTerminal.bind(this);
  }

  /** Handle Drawer Toggle */
  handleDrawerToggle() {
    this.setState({
      drawer: !this.state.drawer,
    });
  }

  /** Toggle Launcher Window */
  handleLauncherToggle() {
    this.setState({
      launcher: !this.state.launcher,
    });
  }

  /** Open Game Editor */
  openGameEditor() {
    console.debug('Open Game');
    import('../../GameEditor/GameEditor').then((module) => {
      WindowManager.addNewWindow('GameEditor').then((windowId) => {
        const node = WindowManager.getWindowNode(windowId);
        if (node instanceof HTMLElement) {
          const root = ReactDOM.createRoot(node);
          root.render(<module.GameEditor windowId={windowId} />);
        }
      });
    });
  }

  /** Open Block Editor */
  openBlockEditor() {
    console.debug('Open Editor');
    import('../../BlockEditor/BlockEditor').then((module) => {
      WindowManager.addNewWindow('BlockEditor').then((windowId) => {
        const node = WindowManager.getWindowNode(windowId);
        if (node instanceof HTMLElement) {
          const root = ReactDOM.createRoot(node);
          root.render(<module.BlockEditor windowId={windowId} />);
        }
      });
    });
  }

  /** Open Editor */
  openCodeEditor() {
    console.debug('Open Editor');
    import('../../CodeEditor').then((module) => {
      WindowManager.addNewWindow('CodeEditor').then((windowId) => {
        const node = WindowManager.getWindowNode(windowId);
        if (node instanceof HTMLElement) {
          const root = ReactDOM.createRoot(node);
          root.render(<module.CodeEditor windowId={windowId} />);
        }
      });
    });
  }

  /** Open Preview */
  openPreview() {
    console.debug('Open Preview');
    import('../../Preview').then((module) => {
      WindowManager.addNewWindow('Preview').then((windowId) => {
        const node = WindowManager.getWindowNode(windowId);
        if (node instanceof HTMLElement) {
          const root = ReactDOM.createRoot(node);
          root.render(<module.Preview windowId={windowId} />);
        }
      });
    });
  }

  /** Open Terminal */
  openTerminal() {
    console.debug('Open Terminal');
    import('../../../gui/Terminal').then((module) => {
      WindowManager.addNewWindow('Terminal').then((windowId) => {
        const node = WindowManager.getWindowNode(windowId);
        if (node instanceof HTMLElement) {
          const terminalGui = new module.TerminalGui();
          terminalGui.open(node);
          // Adding additional event listener for close and refresh.
          if (windowId) {
            WindowManager.windowManagerEventTarget.addEventListener(
              'windowClose',
              (/** @type {WindowCloseEvent} */ event) => {
                if (event.getWindowId() == windowId) {
                  terminalGui.close();
                }
              }
            );
          }
        }
      });
    });
  }

  /**
   * @return {Object}
   */
  render() {
    return (
      <React.StrictMode>
        <Paper
          elevation={3}
          className={`${styles.launcher} ${
            this.state.launcher ? 'show' : 'hide'
          }`}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="Open drawer"
            onClick={this.handleDrawerToggle}
          >
            <AppsIcon />
          </IconButton>

          <Tooltip title="Open Game Editor">
            <IconButton
              edge="start"
              color="inherit"
              aria-label="File"
              onClick={this.openGameEditor}
            >
              <SportsEsportsIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Open Block Editor">
            <IconButton
              edge="start"
              color="inherit"
              aria-label="File"
              onClick={this.openBlockEditor}
            >
              <ExtensionIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Open Editor">
            <IconButton
              edge="start"
              color="inherit"
              aria-label="File"
              onClick={this.openCodeEditor}
            >
              <CodeIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Open Preview">
            <IconButton
              edge="start"
              color="inherit"
              aria-label="File"
              onClick={this.openPreview}
            >
              <PreviewIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Open Terminal">
            <IconButton
              edge="start"
              color="inherit"
              aria-label="Terminal"
              onClick={this.openTerminal}
            >
              <TerminalIcon />
            </IconButton>
          </Tooltip>
          <div
            className={styles.expandArea}
            onClick={this.handleLauncherToggle}
          >
            {this.state.launcher ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
          </div>
        </Paper>
      </React.StrictMode>
    );
  }
}
