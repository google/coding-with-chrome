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
 * @fileoverview Select Screen for Coding with Chrome.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React from 'react';

import AppBar from '@mui/material/AppBar';
import BuildIcon from '@mui/icons-material/Build';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import SchoolIcon from '@mui/icons-material/School';
import Toolbar from '@mui/material/Toolbar';
import { Alert, AlertTitle, Button, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import i18next from '../App/i18next';
import { APP_BASE_PATH } from '../../constants';

import SettingScreen from '../Settings/SettingScreen';
import LanguageSetting from '../Settings/LanguageSetting';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ReactComponent as Logo } from '../../../assets/logo/logo.svg';

/**
 *
 */
export class SelectScreen extends React.PureComponent {
  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    i18next.on('languageChanged', () => {
      this.forceUpdate();
    });
  }

  /**
   * @return {Object}
   */
  render() {
    return (
      <React.StrictMode>
        <AppBar position="relative">
          <Toolbar>
            <SchoolIcon sx={{ mr: 2 }} />
            <Typography
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Coding with Chrome
            </Typography>
            <SettingScreen color="inherit" />
            <LanguageSetting color="inherit" />
          </Toolbar>
        </AppBar>
        <Grid container spacing={3} direction="column" alignItems="center">
          <Grid item justify="flex-start" sx={{ marginTop: '50px' }}>
            <Logo width="100%" height="250px" />
            <Typography variant="h4" align="center">
              Coding with Chrome
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
            <Typography align="center">
              {i18next.t('SELECT_A_OPTION_TO_START')}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              component={Link}
              to="/game_editor"
              variant="contained"
              startIcon={<BuildIcon />}
            >
              {i18next.t('GAME_EDITOR')}
            </Button>
          </Grid>
          <Grid item>
            <Button
              component={Link}
              to="/desktop"
              variant="outlined"
              startIcon={<DesktopWindowsIcon />}
            >
              Experimental Desktop
            </Button>
          </Grid>
          <Grid item justify="space-between">
            <Typography variant="caption" align="center">
              Location:{window.location.href} | App Base Path:{APP_BASE_PATH} |
              Language:{i18next.language} ({i18next.resolvedLanguage})
            </Typography>
          </Grid>
        </Grid>
      </React.StrictMode>
    );
  }
}

export default SelectScreen;
