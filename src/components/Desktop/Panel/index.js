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
 * @fileoverview Panel for the desktop screen.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React from 'react';

import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import i18next from 'i18next';

import { toolbar, title } from './style.module.css';
import { APP_SUPPORTED_LANGUAGES } from '../../../constants';

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
    this.languages = APP_SUPPORTED_LANGUAGES;
  }

  /**
   * Handle drawer toggle.
   */
  handleDrawerToggle() {
    this.setState((prevState) => ({
      drawer: !prevState.drawer,
    }));
  }

  /**
   * @return {Object}
   */
  render() {
    return (
      <React.StrictMode>
        <AppBar position="static">
          <Toolbar className={toolbar}>
            <Typography variant="h6" className={title}>
              Coding with Chrome
            </Typography>
            {Object.keys(this.languages).map((language) => (
              <Button
                color="inherit"
                key={language}
                style={{
                  fontWeight:
                    i18next.resolvedLanguage === language ? 'bold' : 'normal',
                }}
                type="submit"
                onClick={() => i18next.changeLanguage(language)}
              >
                {this.languages[language].nativeName}
              </Button>
            ))}
            <Button color="inherit">{i18next.t('Login')}</Button>
          </Toolbar>
        </AppBar>
      </React.StrictMode>
    );
  }
}
