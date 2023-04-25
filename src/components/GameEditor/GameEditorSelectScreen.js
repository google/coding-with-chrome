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

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CasinoIcon from '@mui/icons-material/Casino';
import Container from '@mui/material/Container';
import CreateIcon from '@mui/icons-material/Create';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EmojiPicker from 'emoji-picker-react';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import i18next from 'i18next';
import { v4 as uuidv4 } from 'uuid';

import { Project } from '../Project/Project';
import { ProjectType } from '../Project/ProjectType';

import ProjectNameGenerator from './generator/ProjectNameGenerator';

/**
 *
 */
export class GameEditorSelectScreen extends React.PureComponent {
  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.projectNameField = React.createRef();
    this.cards = [1, 2, 3];
    this.state = {
      openNewProject: false,
      openExistingProject: false,
      openEmojiPicker: false,
      projects: [],
      projectId: props.projectId || uuidv4(),
      projectIcon: '🎮',
      projectName:
        props.projectName ||
        ProjectNameGenerator.generate(i18next.resolvedLanguage),
      projectDescription: props.projectDescription || '',
      xml: props.xml,
    };
  }

  /**
   * Component did mount.
   */
  componentDidMount() {
    Project.getProjects(ProjectType.GAME_EDITOR).then((projects) => {
      this.setState({ projects });
    });
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
   * @param {*} event
   */
  handleOpenProject(event) {
    if (event.currentTarget && event.currentTarget.getAttribute('value')) {
      console.log(event.currentTarget.getAttribute('value'));
      // Update url with new project id and project name.
      window.location.hash = `#/game_editor/${event.currentTarget.getAttribute(
        'value'
      )}`;
      window.location.reload(true);
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
   * @return {Object}
   */
  render() {
    return (
      <React.StrictMode>
        <AppBar position="relative">
          <Toolbar>
            <VideogameAssetIcon sx={{ mr: 2 }} />
            <Typography variant="h6" color="inherit" noWrap>
              Game Editor
            </Typography>
          </Toolbar>
        </AppBar>
        <main>
          {/* Hero unit */}
          <Box
            sx={{
              bgcolor: 'background.paper',
              pt: 8,
              pb: 6,
            }}
          >
            <Container maxWidth="sm">
              <Typography
                component="h1"
                variant="h3"
                align="center"
                color="text.primary"
                gutterBottom
              >
                Game Editor
              </Typography>
              <Typography
                variant="h6"
                align="center"
                color="text.secondary"
                paragraph
              >
                {i18next.t('CREATE_NEW_GAME_PROJECT')}
              </Typography>
              <Stack
                sx={{ pt: 6 }}
                direction="row"
                spacing={2}
                justifyContent="center"
              >
                <Button
                  variant="contained"
                  onClick={() => {
                    this.setState({ openNewProject: true });
                  }}
                >
                  <CreateIcon />
                  {i18next.t('CREATE_NEW_PROJECT')}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    this.setState({ openExistingProject: true });
                  }}
                >
                  <FolderOpenIcon />
                  {i18next.t('OPEN_PROJECT')}
                </Button>
              </Stack>
            </Container>
          </Box>
          <Container sx={{ py: 8 }} maxWidth="md">
            {/* End hero unit */}
            <Grid container spacing={4}>
              {this.cards.map((card) => (
                <Grid item key={card} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <CardContent
                      sx={{
                        pt: '56.25%',
                      }}
                    >
                      Hello World
                    </CardContent>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        Heading
                      </Typography>
                      <Typography>
                        This is a media card. You can use this section to
                        describe the content.
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small">Load</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </main>

        <Dialog
          open={this.state.openExistingProject}
          onClose={() => {
            this.setState({ openExistingProject: false });
          }}
          disablePortal
        >
          {this.state.projects.map((project) => (
            <MenuItem
              key={project.id}
              value={project.id}
              onClick={this.handleOpenProject.bind(this)}
            >
              <ListItemIcon>{project.icon}</ListItemIcon>
              <ListItemText
                primary={
                  <React.Fragment>
                    <Typography color="primary">{project.name}</Typography>
                    <Typography variant="caption" display="block">
                      {project.id}
                    </Typography>
                  </React.Fragment>
                }
                secondary={
                  <React.Fragment>
                    {project.description}
                    <Typography variant="caption" display="block">
                      {'Last modified:' + project.lastModified}
                    </Typography>
                  </React.Fragment>
                }
              />
            </MenuItem>
          ))}
        </Dialog>

        <Dialog
          open={this.state.openNewProject}
          onClose={() => {
            this.setState({ openNewProject: false, openEmojiPicker: false });
          }}
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
              label="Project Name"
              variant="standard"
              defaultValue={this.state.projectName}
              onChange={this.handleProjectNameChange.bind(this)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Button
                      onClick={() => {
                        this.setState({ openEmojiPicker: true });
                      }}
                    >
                      {this.state.projectIcon}
                    </Button>
                  </InputAdornment>
                ),
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

GameEditorSelectScreen.propTypes = {
  onClose: PropTypes.func,
  projectDescription: PropTypes.string,
  projectId: PropTypes.string,
  projectName: PropTypes.string,
  open: PropTypes.bool,
  xml: PropTypes.string,
};

export default GameEditorSelectScreen;
