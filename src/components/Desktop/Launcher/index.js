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

import AppsIcon from '@material-ui/icons/Apps';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import { Console, DragVerticalVariant } from 'mdi-material-ui';

import styles from './style.module.css';

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

  /** */
  handleDrawerToggle() {
    this.setState({
      ...this.state,
      drawer: !this.state.drawer,
    });
  }

  /** */
  handleLauncherToggle() {
    this.setState({
      ...this.state,
      launcher: !this.state.launcher,
    });
    console.log(this.state);
  }

  /** */
  openTerminal() {
    console.log('Open Terminal');
    import('../../../gui/Terminal').then((module) => {
      const terminalGui = new module.TerminalGui();
      terminalGui.show(document.getElementById('terminal'));
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
          <Tooltip title="Open Terminal">
            <IconButton
              edge="start"
              color="inherit"
              aria-label="Terminal"
              onClick={this.openTerminal}
            >
              <Console />
            </IconButton>
          </Tooltip>
          <div
            className={styles.expandArea}
            onClick={this.handleLauncherToggle}
          >
            <DragVerticalVariant />
          </div>
        </Paper>
      </React.StrictMode>
    );
  }
}
