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

import React, { lazy } from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import CreateIcon from '@mui/icons-material/Create';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import i18next from 'i18next';

import { APP_BASE_PATH } from '../../constants';
import { Database } from '../../utils/db/Database';
import { Project } from '../Project/Project';
import { ProjectType } from '../Project/ProjectType';

const NewGameProject = lazy(() => import('./dialog/NewGameProject'));
const OpenGameProject = lazy(() => import('./dialog/OpenGameProject'));
import LanguageSetting from '../Settings/LanguageSetting';

/**
 *
 */
export class GameEditorSelectScreen extends React.PureComponent {
  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.cards = [
      {
        logo: '🎮',
        title: i18next.t('EXAMPLE_PHASER_BOUNCING_BALL'),
        description: i18next.t('EXAMPLE_PHASER_BOUNCING_BALL_DESCRIPTION'),
        file: 'assets/examples/phaser/Bouncing Ball.xml',
      },
      {
        logo: '🎮',
        title: i18next.t('EXAMPLE_PHASER_BOUNCING_CUBES'),
        description: i18next.t('EXAMPLE_PHASER_BOUNCING_CUBES_DESCRIPTION'),
        file: 'assets/examples/phaser/Bouncing Cubes.xml',
      },
      {
        logo: '🎮',
        title: i18next.t('EXAMPLE_PHASER_MOVE_A_SPRITE'),
        description: i18next.t('EXAMPLE_PHASER_MOVE_A_SPRITE_DESCRIPTION'),
        file: 'assets/examples/phaser/Move a Sprite.xml',
      },
      {
        logo: '🎮',
        title: i18next.t('EXAMPLE_PHASER_SWITCH_GAME_STATE'),
        description: i18next.t('EXAMPLE_PHASER_SWITCH_GAME_STATE_DESCRIPTION'),
        file: 'assets/examples/phaser/Switch Game State.xml',
      },
    ];
    this.state = {
      openNewProject: false,
      openExistingProject: false,
    };
  }

  /**
   * @param {*} event
   */
  handleLoadExample(event) {
    const targetElement = event.target;
    const file = targetElement.getAttribute('data-file');
    const name = targetElement.getAttribute('data-name');
    if (!file || !name) {
      return;
    }

    // Disable button
    targetElement.disabled = true;

    // Load example file into new project and open it.
    Project.getEmptyProject(name, ProjectType.GAME_EDITOR).then((project) => {
      const database = new Database(project.id, project.type);
      const xhr = new XMLHttpRequest();
      xhr.open('GET', APP_BASE_PATH + file, true);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          database.put('name', project.name);
          database.put('description', project.description);
          database.put('workspace', xhr.responseText);
          database.put('lastModified', new Date().toISOString()).then(() => {
            window.location.hash = `#/game_editor/${project.getId()}`;
            window.location.reload();
          });
        }
      };
      xhr.send();
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
            <VideogameAssetIcon sx={{ mr: 2 }} />
            <Typography
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Game Editor
            </Typography>
            <LanguageSetting color="inherit" />
          </Toolbar>
        </AppBar>

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
                <CreateIcon sx={{ marginRight: '5px' }} />
                {i18next.t('CREATE_NEW_PROJECT')}
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  this.setState({ openExistingProject: true });
                }}
              >
                <FolderOpenIcon sx={{ marginRight: '5px' }} />
                {i18next.t('OPEN_PROJECT')}
              </Button>
            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          <Typography variant="h6">{i18next.t('EXAMPLES')}</Typography>
          <Grid container spacing={4}>
            {this.cards.map((card) => (
              <Grid item key={card.title} xs={12} sm={6} md={4}>
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
                    {card.logo}
                  </CardContent>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {card.title}
                    </Typography>
                    <Typography>{card.description}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      data-file={card.file}
                      data-name={card.title}
                      onClick={this.handleLoadExample.bind(this)}
                    >
                      Load example
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {this.state.openExistingProject && (
          <OpenGameProject
            open={this.state.openExistingProject}
            onClose={() => {
              this.setState({ openExistingProject: false });
            }}
          />
        )}

        {this.state.openNewProject && (
          <NewGameProject
            open={this.state.openNewProject}
            onClose={() => {
              this.setState({ openNewProject: false });
            }}
          />
        )}
      </React.StrictMode>
    );
  }
}

GameEditorSelectScreen.propTypes = {};

export default GameEditorSelectScreen;
