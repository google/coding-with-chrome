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

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import BuildIcon from '@mui/icons-material/Build';
import Button from '@mui/material/Button';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import SchoolIcon from '@mui/icons-material/School';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

import i18next from '../App/i18next';
import {
  APP_BASE_PATH,
  APP_VERSION,
  CACHE_SERVICE_WORKER_CACHE_NAME,
} from '../../constants';

import Settings from '../Settings/Settings';
import SettingScreen from '../Settings/SettingScreen';
import LanguageSetting from '../Settings/LanguageSetting';

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
    this.state = {
      showUpdate: false,
    };
  }

  /**
   * Component did mount.
   */
  componentDidMount() {
    // Check for updates
    Settings.getVersion().then((version) => {
      if (!version && APP_VERSION) {
        Settings.setVersion(APP_VERSION);
      } else if (version && version !== APP_VERSION) {
        this.setState({
          showUpdate: true,
        });
      }
    });

    // Update language
    i18next.on('languageChanged', () => {
      this.forceUpdate();
    });
  }

  /**
   * Perform forced update, by clearing the cache and reloading the page.
   */
  performUpdate() {
    caches.open(CACHE_SERVICE_WORKER_CACHE_NAME).then((cache) => {
      cache.keys().then(function (names) {
        for (const name of names) {
          cache.delete(name);
        }
      });
      Settings.setVersion(APP_VERSION);
      setTimeout(() => {
        window.location.reload(true);
      }, 1000);
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
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                {i18next.t('SELECT_SCREEN_TITLE')}
              </Typography>
              <Typography color="inherit" variant="caption">
                {i18next.t('SELECT_SCREEN_SUBTITLE')}
              </Typography>
            </Box>
            <IconButton
              component={Link}
              to="/desktop"
              color="inherit"
              sx={{
                filter: 'opacity(5%)',
              }}
              title="Experimental Desktop"
            >
              <DesktopWindowsIcon />
            </IconButton>
            <SettingScreen color="inherit" showIcon={true} />
            <LanguageSetting color="inherit" showIcon={true} />
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
            {this.state.showUpdate && (
              <Alert severity="info">
                <AlertTitle>Update available</AlertTitle>
                <Typography>
                  A new version of Coding with Chrome is available. Please click
                  the following update button to get the latest version.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<BrowserUpdatedIcon />}
                  onClick={this.performUpdate.bind(this)}
                  sx={{ marginTop: '20px' }}
                >
                  Update Coding with Chrome
                </Button>
              </Alert>
            )}
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
          <Grid item justify="space-between">
            <Typography variant="caption" align="center">
              Location:{window.location.href} | App Base Path:{APP_BASE_PATH} |
              Language:{i18next.language} ({i18next.resolvedLanguage}) |
              Version:{APP_VERSION}
            </Typography>
          </Grid>
        </Grid>
      </React.StrictMode>
    );
  }
}

export default SelectScreen;
