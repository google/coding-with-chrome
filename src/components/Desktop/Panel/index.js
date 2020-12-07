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

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import styles from './style.module.css';

/**
 *
 */
export class Panel extends React.PureComponent {
  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = { drawer: false };
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
  }

  /** */
  handleDrawerToggle() {
    this.setState({
      drawer: !this.state.drawer,
    });
  }

  /**
   * @return {Object}
   */
  render() {
    return (
      <React.StrictMode>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={styles.title}>
              Coding with Chrome
            </Typography>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
      </React.StrictMode>
    );
  }
}
