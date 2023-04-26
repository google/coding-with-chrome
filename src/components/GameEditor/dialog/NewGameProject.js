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
 * @fileoverview Game Editor Setup Screen.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React from 'react';

import Button from '@mui/material/Button';
import CasinoIcon from '@mui/icons-material/Casino';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EmojiPicker from 'emoji-picker-react';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import i18next from 'i18next';
import { v4 as uuidv4 } from 'uuid';

import { Project } from '../../Project/Project';
import { ProjectType } from '../../Project/ProjectType';

import ProjectNameGenerator from '../generator/ProjectNameGenerator';

/**
 *
 */
export class NewGameProject extends React.PureComponent {
  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.projectNameField = React.createRef();
    this.state = {
      open: false,
      openEmojiPicker: false,
      projectId: props.projectId || uuidv4(),
      projectIcon: '🎮',
      projectName:
        props.projectName ||
        ProjectNameGenerator.generate(i18next.resolvedLanguage),
      projectDescription: props.projectDescription || '',
    };
  }

  /**
   * Handle game setup close.
   */
  handleCreateProject() {
    // Create new project based on user input.
    console.log(
      `Create new project with id ${this.state.projectId}, name ${this.state.projectName}, description ${this.state.projectDescription} and icon ${this.state.projectIcon}`
    );
    const project = new Project(
      this.state.projectId,
      ProjectType.GAME_EDITOR,
      this.state.projectName,
      this.state.projectDescription
    );
    if (this.state.projectIcon) {
      project.setIcon(this.state.projectIcon);
    }

    // Save project and update url with new project id.
    project.save().then(() => {
      window.location.hash = `#/game_editor/${project.getId()}`;
      window.location.reload(true);
    });
  }

  /**
   * Generates a random project name.
   */
  handleRandomProjectName() {
    const projectName = ProjectNameGenerator.generate(i18next.resolvedLanguage);
    this.projectNameField.current.value = projectName;
    this.setState({ projectName });
  }

  /**
   * @param {object} event
   */
  handleProjectNameChange(event) {
    const projectName = event.target.value;
    if (
      projectName.trim().length != 0 &&
      projectName != this.state.projectName
    ) {
      this.setState({ projectName });
    }
  }

  /**
   * @param {object} event
   */
  handleProjectDescriptionChange(event) {
    const projectDescription = event.target.value;
    if (
      projectDescription.trim().length != 0 &&
      projectDescription != this.state.projectDescription
    ) {
      this.setState({ projectDescription });
    }
  }

  /**
   * @param {EmojiPicker.EmojiClickData} emojiObject
   */
  handleEmojiClick(emojiObject) {
    if (emojiObject && emojiObject.emoji) {
      this.setState({ openEmojiPicker: false, projectIcon: emojiObject.emoji });
    }
  }

  /**
   * Handle game setup close.
   */
  handleOnClose() {
    this.setState({ open: false, openEmojiPicker: false });
    if (this.props.onClose && typeof this.props.onClose === 'function') {
      this.props.onClose();
    }
  }

  /**
   * @return {Object}
   */
  render() {
    const open =
      typeof this.props.open != 'undefined' ? this.props.open : this.state.open;
    return (
      <React.StrictMode>
        <Dialog
          open={open}
          onClose={this.handleOnClose.bind(this)}
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
            {this.state.openEmojiPicker && (
              <EmojiPicker
                emojiStyle="native"
                onEmojiClick={this.handleEmojiClick.bind(this)}
              />
            )}
            <TextField
              inputRef={this.projectNameField}
              required
              autoFocus
              fullWidth
              margin="dense"
              id="project_name"
              label="Project Icon and Name"
              variant="standard"
              defaultValue={this.state.projectName}
              onChange={this.handleProjectNameChange.bind(this)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ maxWidth: '24px' }}>
                    <Button
                      onClick={() => {
                        this.setState({ openEmojiPicker: true });
                      }}
                      sx={{ minWidth: '24px', maxWidth: '24px' }}
                    >
                      {this.state.projectIcon}
                    </Button>
                  </InputAdornment>
                ),
                endAdornment: (
                  <IconButton
                    onClick={this.handleRandomProjectName.bind(this)}
                    title="Get a random name."
                  >
                    <CasinoIcon />
                  </IconButton>
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
              onChange={this.handleProjectDescriptionChange.bind(this)}
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCreateProject.bind(this)}>
              Create Project
            </Button>
          </DialogActions>
        </Dialog>
      </React.StrictMode>
    );
  }
}

NewGameProject.propTypes = {
  onClose: PropTypes.func,
  projectDescription: PropTypes.string,
  projectId: PropTypes.string,
  projectName: PropTypes.string,
  open: PropTypes.bool,
};

export default NewGameProject;
