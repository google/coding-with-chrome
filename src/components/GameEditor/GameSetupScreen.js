/**
 * @license Copyright 2022 The Coding with Chrome Authors.
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
 * @fileoverview Editor for the desktop screen.
 */

import React from 'react';

import BlocklyTemplate from './template/BlocklyTemplate';
import Button from '@mui/material/Button';
import CasinoIcon from '@mui/icons-material/Casino';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import i18next from 'i18next';
import { v4 as uuidv4 } from 'uuid';

import ProjectNameGenerator from './generator/ProjectNameGenerator';

/**
 *
 */
export class GameSetupScreen extends React.PureComponent {
  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      projectName:
        props.projectName ||
        ProjectNameGenerator.generate(i18next.resolvedLanguage),
      projectId: props.projectId || uuidv4(),
      projectDescription: props.projectDescription || '',
      xml: props.xml,
      showGameSetupScreen:
        typeof props.open !== 'undefined' ? props.open : true,
    };
  }

  /**
   * @param {event} opt_event
   */
  handleGameSetupClose(opt_event) {
    this.setState({ showGameSetupScreen: false });

    // Process XML.
    let xml = this.state.xml;
    if (!xml) {
      xml = BlocklyTemplate.render(this.state.projectName);
      this.setState({ xml });
    }

    // Call onClose callback function.
    if (typeof this.props.onClose == 'function') {
      this.props.onClose(
        this.state.projectId,
        this.state.projectName,
        this.state.projectDescription,
        xml
      );
    }
  }

  /**
   * @param {event} opt_event
   */
  handleRandomProjectName(opt_event) {
    this.setState({
      projectName: ProjectNameGenerator.generate(i18next.resolvedLanguage),
    });
  }

  /**
   * @param {object} event
   */
  handleProjectNameChange(event) {
    const projectName = event.target.value;
    if (
      projectName.trim().length === 0 &&
      projectName != this.state.projectName
    ) {
      this.setState({ projectName });
    }
  }

  /**
   * @return {Object}
   */
  render() {
    return (
      <React.StrictMode>
        <Dialog
          onClose={this.handleGameSetupClose.bind(this)}
          open={this.state.showGameSetupScreen}
          disablePortal
        >
          <DialogTitle>
            New Game Project
            <Typography variant="caption" display="block">
              ID: {this.state.projectId}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Here you can setup your new game project.
            </DialogContentText>
            <TextField
              required
              autoFocus
              fullWidth
              margin="dense"
              id="project_name"
              label="Project Name"
              variant="standard"
              value={this.state.projectName}
              onChange={this.handleProjectNameChange.bind(this)}
              InputProps={{
                endAdornment: (
                  <Button onClick={this.handleRandomProjectName.bind(this)}>
                    <CasinoIcon />
                  </Button>
                ),
              }}
            />
            <TextField
              maxRows={2}
              multiline
              fullWidth
              id="outlined-multiline-flexible"
              label="Project Description"
              margin="dense"
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleGameSetupClose.bind(this)}>
              Create Project
            </Button>
          </DialogActions>
        </Dialog>
      </React.StrictMode>
    );
  }
}

GameSetupScreen.propTypes = {
  onClose: PropTypes.func,
  projectDescription: PropTypes.string,
  projectId: PropTypes.string,
  projectName: PropTypes.string,
  open: PropTypes.bool,
  xml: PropTypes.string,
};

export default GameSetupScreen;
