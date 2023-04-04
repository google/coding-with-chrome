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
 * @author mbordihn@google.com (Markus Bordihn)
 *
 * @fileoverview Preview for the desktop screen.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, AlertTitle, Button, Grid, Typography } from '@mui/material';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import BuildIcon from '@mui/icons-material/Build';

import styles from './style.module.css';

/**
 *
 */
export class SelectScreen extends React.PureComponent {
  /**
   * @return {Object}
   */
  render() {
    return (
      <div className={styles.container}>
        <Grid container spacing={3} direction="column" alignItems="center">
          <Grid item>
            <Typography variant="h4" align="center">
              Welcome to the Select Screen
            </Typography>
          </Grid>
          <Grid item>
            <Alert severity="warning">
              <AlertTitle>Experimental Version</AlertTitle>
              This version is experimental and not fully functional. Use at your
              own risk.
            </Alert>
          </Grid>
          <Grid item>
            <Button
              component={Link}
              to="/desktop"
              variant="contained"
              className={styles.button}
              startIcon={<DesktopWindowsIcon />}
            >
              Desktop Version
            </Button>
          </Grid>
          <Grid item>
            <Button
              component={Link}
              to="/game_editor"
              variant="contained"
              className={styles.button}
              startIcon={<BuildIcon />}
            >
              Game Editor
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default SelectScreen;
