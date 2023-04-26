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
 * @fileoverview Language Setting.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import LanguageIcon from '@mui/icons-material/Language';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import i18next from 'i18next';

/**
 *
 */
export class LanguageSetting extends React.PureComponent {
  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.languages = {
      en: { nativeName: 'English' },
      de: { nativeName: 'Deutsch' },
    };
    this.state = {
      open: false,
      language: i18next.resolvedLanguage,
    };
  }

  /**
   *
   */
  openLanguageSelection() {
    this.setState({ open: true });
  }

  /**
   *
   */
  handleClose() {
    this.setState({ open: false });
  }

  /**
   * @param {string} language
   */
  handleChangeLanguage(language) {
    console.log('Change language to', language);
    i18next.changeLanguage(language).then(() => {
      this.setState({ open: false, language: i18next.resolvedLanguage });
    });
  }

  /**
   * @return {Object}
   */
  render() {
    return (
      <React.StrictMode>
        <IconButton
          onClick={this.openLanguageSelection.bind(this)}
          color={this.props.color}
        >
          <LanguageIcon sx={{ marginRight: '5px' }} />
          <Typography>{this.state.language}</Typography>
        </IconButton>
        <Dialog onClose={this.handleClose.bind(this)} open={this.state.open}>
          <DialogTitle>Please select your language</DialogTitle>
          {Object.keys(this.languages).map((language) => (
            <Button
              color="inherit"
              key={language}
              style={{
                fontWeight:
                  i18next.resolvedLanguage === language ? 'bold' : 'normal',
              }}
              type="submit"
              disabled={i18next.resolvedLanguage === language}
              onClick={() => {
                this.handleChangeLanguage(language);
              }}
            >
              {this.languages[language].nativeName}
            </Button>
          ))}
        </Dialog>
      </React.StrictMode>
    );
  }
}

LanguageSetting.propTypes = {
  color: PropTypes.string,
};

export default LanguageSetting;
