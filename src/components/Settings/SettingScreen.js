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
 * @fileoverview Setting Screen for Coding with Chrome.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import SettingsIcon from '@mui/icons-material/Settings';
import Typography from '@mui/material/Typography';
import i18next from '../App/i18next';

import { CACHE_SERVICE_WORKER_CACHE_NAME } from '../../constants';

/**
 *
 */
export class SettingScreen extends React.PureComponent {
  /**
   * @param {*} props
   * @constructor
   */
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  /**
   *
   */
  open() {
    this.setState({ open: true });
  }

  /**
   *
   */
  close() {
    this.setState({ open: false });
  }

  /**
   * @param {*} event
   */
  handleSave(event) {
    console.log('Change Event:', event);
    this.close();
  }

  /**
   * Clears online and offline cache.
   */
  handleClearCache() {
    console.log('Clear Cache ...');
    caches.open(CACHE_SERVICE_WORKER_CACHE_NAME).then((cache) => {
      cache.keys().then(function (names) {
        for (const name of names) {
          cache.delete(name);
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
        <IconButton
          onClick={this.open.bind(this)}
          color={this.props.color}
          title={'Change Settings'}
        >
          <SettingsIcon />
        </IconButton>
        <Dialog
          onClose={this.close.bind(this)}
          open={this.state.open}
          fullWidth={true}
        >
          <DialogTitle>Settings</DialogTitle>
          <DialogContent>
            <Typography>
              The settings screen allows you to change the default settings for
              Coding with Chrome.
            </Typography>
            <Box justify="flex-start" sx={{ flexGrow: 1, paddingTop: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={8} md={8}>
                  <Typography>Cache (including Offline Cache)</Typography>
                </Grid>
                <Grid item xs={4} md={4}>
                  <Button
                    variant="contained"
                    onClick={this.handleClearCache.bind(this)}
                  >
                    Clear Cache
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button color="inherit" onClick={this.close.bind(this)}>
              {i18next.t('CANCEL')}
            </Button>
            <Button
              color="inherit"
              type="submit"
              onClick={this.handleSave.bind(this)}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </React.StrictMode>
    );
  }
}

SettingScreen.propTypes = {
  color: PropTypes.string,
};

export default SettingScreen;
