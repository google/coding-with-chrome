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

import AppsIcon from '@mui/icons-material/Apps';
import CodeIcon from '@mui/icons-material/Code';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import TerminalIcon from '@mui/icons-material/Terminal';
import Tooltip from '@mui/material/Tooltip';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

import styles from './style.module.css';
import { WindowManager } from '../WindowManager';

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

  /** Open Editor */
  openEditor() {
    console.debug('Open Editor');
  }

  /** Open Terminal */
  openTerminal() {
    console.debug('Open Terminal');
    import('../../../gui/Terminal').then((module) => {
      WindowManager.test((node) => {
        console.info('test', node);
        const terminalGui = new module.TerminalGui();
        terminalGui.open(node);
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

          <Tooltip title="Open Editor">
            <IconButton
              edge="start"
              color="inherit"
              aria-label="File"
              onClick={this.openEditor}
            >
              <CodeIcon />
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
