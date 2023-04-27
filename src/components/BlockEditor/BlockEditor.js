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
 * @fileoverview Block Editor.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React, { createRef, lazy } from 'react';

import Blockly from 'blockly';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import i18next from '../App/i18next';

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import { BlocklyWorkspace, WorkspaceSvg } from 'react-blockly';
import { WindowManager } from '../Desktop/WindowManager';
import LegacyBlocks from './blocks/LegacyBlocks';
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import { WindowResizeEvent } from '../Desktop/WindowManager/Events';
import { javascriptGenerator } from 'blockly/javascript';
import BlockToolbar from './BlockToolbar';
import { Database } from '../../utils/db/Database';
import { Project } from '../Project/Project';
import { APP_BASE_PATH } from '../../constants';

const CodeEditor = lazy(() => import('../CodeEditor/CodeEditor'));

import 'material-icons/iconfont/filled.css';
import 'material-icons/iconfont/outlined.css';
import styles from './style.module.css';
import './style.global.css';

/**
 *
 */
export class BlockEditor extends React.PureComponent {
  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.codeEditor = createRef();
    this.toolbar = createRef();
    this.timer = {
      handleXMLChange: null,
    };
    this.lastXMLContent = '';
    this.isDragging = false;
    this.state = {
      /** @type {WorkspaceSvg} */
      blocklyWorkspace: null,

      /** @type {Project} */
      project: props.project || new Project(),
      showEditor: false,
      showDrawer: false,
      hasChanged: false,
      hasSaved: false,
      hasUndo: false,
      hasRedo: false,
      config: {
        grid: {
          spacing: 20,
          length: 3,
          colour: '#ccc',
          snap: true,
        },
        zoom: {
          controls: true,
          wheel: true,
          startScale: 0.9,
          maxScale: 3,
          minScale: 0.5,
          scaleSpeed: 1.1,
        },
        media: APP_BASE_PATH + 'assets/blockly/',
        trashcan: false,
      },
      snackbarSaved: false,
      variables: [],
      xml: props.content || '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>',
    };

    // Databases for saving and loading the workspace.
    this.database = new Database(
      this.state.project.id,
      this.state.project.type
    );

    // Adding event listener for window resize, if windowId is set.
    if (this.props.windowId) {
      WindowManager.windowManagerEventTarget.addEventListener(
        'windowResize',
        this.handleWindowResize.bind(this)
      );
    }

    // Loading workspace from database if not empty.
    this.database.get('workspace').then((workspace) => {
      if (workspace) {
        this.loadWorkspace(workspace);
      }
    });
    console.log('Adding block editor with project id: ', this.state.project.id);
  }

  /**
   *
   */
  componentDidMount() {
    i18next.on('languageChanged', () => {
      this.refreshWorkspace();
      this.forceUpdate();
    });
  }

  /**
   * Refresh the block editor workspace
   */
  refreshWorkspace() {
    if (this.state.blocklyWorkspace) {
      const xml = this.getXML();
      Blockly.Xml.clearWorkspaceAndLoadFromXml(
        Blockly.utils.xml.textToDom(xml),
        this.getBlocklyWorkspace()
      );
    }
  }

  /**
   *
   */
  showBlockEditor() {
    console.log('Show Block Editor ...');
    this.setState({ showEditor: false }, () => {
      this.resize();
    });
  }

  /**
   *
   */
  async showCodeEditor() {
    if (!this.codeEditor) {
      return;
    }
    console.log('Show Code Editor ...');
    const code = this.getWorkspaceCode();
    this.setState({ showEditor: true }, () => {
      this.codeEditor.current.resize();
      this.codeEditor.current.setValue(code);
    });
  }

  /**
   * @return {string}
   */
  getWorkspaceCode() {
    let code =
      javascriptGenerator.workspaceToCode(this.state.blocklyWorkspace) || '';
    if (this.props.template && typeof this.props.template === 'function') {
      code = this.props.template(
        code,
        this.state.project,
        this.state.blocklyWorkspace
      );
    }
    return code;
  }

  /**
   * @param {string} xml
   * @param {Map<string, string>} files
   * @return {string}
   */
  praseXML(xml, files = new Map()) {
    // Search for legacy blocks and replace them.
    xml = LegacyBlocks.replaceLegacyBlocks(xml, files);

    // Handle custom XML parsing, if defined.
    if (this.props.parseXML && typeof this.props.parseXML === 'function') {
      xml = this.props.parseXML(xml);
    }
    return xml;
  }

  /**
   * @return {string}
   */
  getXML() {
    return this.state.xml;
  }

  /**
   * @return {WorkspaceSvg}
   */
  getBlocklyWorkspace() {
    return this.state.blocklyWorkspace;
  }

  /**
   * @return {boolean}
   */
  hasBlocklyWorkspace() {
    return !!this.state.blocklyWorkspace;
  }

  /**
   * @param {string} xml
   * @param {Map<string, string>} files
   * @param {boolean} hasChanged
   */
  loadWorkspace(xml, files = new Map(), hasChanged = false) {
    if (!this.hasBlocklyWorkspace()) {
      return;
    }
    console.log('Loading workspace ...', xml);
    const parsedXML = this.praseXML(xml, files);
    Blockly.Xml.clearWorkspaceAndLoadFromXml(
      Blockly.utils.xml.textToDom(parsedXML),
      this.getBlocklyWorkspace()
    );

    // Update state and trigger onLoadWorkspace event.
    this.setState(
      { hasChanged: hasChanged, hasSaved: true, xml: parsedXML },
      () => {
        this.handleXMLChange(xml, hasChanged);
      }
    );

    // Clear undo stack.
    this.getBlocklyWorkspace().clearUndo();

    // Trigger onLoadWorkspace event.
    if (
      this.props.onLoadWorkspace &&
      typeof this.props.onLoadWorkspace === 'function'
    ) {
      this.props.onLoadWorkspace(this.getBlocklyWorkspace());
    }

    this.resize();
    this.refresh();
  }

  /**
   * @param {WorkspaceSvg} blocklyWorkspace
   */
  onLoad(blocklyWorkspace) {
    blocklyWorkspace.addChangeListener(this.handleBlocklyEvent.bind(this));
    blocklyWorkspace.addChangeListener(Blockly.Events.disableOrphans);
    this.setState({ blocklyWorkspace }, () => {
      this.resize();
      this.refresh();
    });
  }

  /**
   * @param {object} event
   */
  handleBlocklyEvent(event) {
    this.isDragging = event.type === 'drag';
  }

  /**
   * @param {WorkspaceSvg} workspace
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars, require-jsdoc
  handleWorkspaceChange(workspace) {
    // Not used.
  }

  /**
   * @param {string} xml
   * @param {boolean} hasChanged
   */
  handleXMLChange(xml, hasChanged = true) {
    if ((this.state.xml == xml && !hasChanged) || this.isDragging) {
      return;
    }

    // Update undo and redo state.
    this.setState({
      hasUndo: this.getBlocklyWorkspace()?.undoStack_.length > 0,
      hasRedo: this.getBlocklyWorkspace()?.redoStack_.length > 0,
    });

    // Throttle XML change to avoid performance issues.
    if (this.timer.HandleXMLChange) {
      clearTimeout(this.timer.HandleXMLChange);
    }

    // Trigger XML change after a 500ms delay.
    this.timer.HandleXMLChange = setTimeout(() => {
      if (this.lastXMLContent != xml) {
        console.log('XML change', xml);
        this.setState({
          hasChanged: hasChanged,
          xml: xml,
        });
        const variables = this.getBlocklyWorkspace()?.getAllVariables();
        if (variables && variables != this.state.variables) {
          console.log('Variables change', variables);
          this.setState({ variables: variables });
        }
        if (this.props.onChange && typeof this.props.onChange === 'function') {
          this.props.onChange(this.getWorkspaceCode());
        }
        this.lastXMLContent = xml;
      }
    }, 500);
  }

  /**
   * Handle window resize
   * @param {WindowResizeEvent} event
   */
  handleWindowResize(event) {
    if (event.getWindowId() != this.props.windowId) {
      return;
    }
    this.resize();
  }

  /**
   * Save file.
   */
  saveWorkspace() {
    // Save workspace to database.
    console.log(
      'Saving workspace for',
      this.state.project,
      'into',
      this.database
    );
    this.database.put('name', this.state.project.name);
    this.database.put('description', this.state.project.description);
    this.database.put('workspace', this.state.xml);
    this.database.put('lastModified', this.state.project.lastModified);

    // Store additionally project reference.
    const project = this.state.project;
    project.setLastModified();
    project.save();

    // Update states.
    this.setState({
      snackbarSaved: true,
      hasChanged: false,
      hasSaved: true,
      project,
    });
  }

  /**
   * Export project file.
   */
  handleExportFile() {
    console.log(`Export  ${this.state.project} ...`);
    const textAsBlob = new Blob([this.state.xml], { type: 'text/plain' });
    const downloadLink = document.createElement('a');
    downloadLink.download = `${this.state.project.name}-${this.state.project.id}.xml`;
    downloadLink.innerHTML = 'Download File';
    if (window.webkitURL != null) {
      // Chrome allows the link to be clicked without actually adding it to the DOM.
      downloadLink.href = window.webkitURL.createObjectURL(textAsBlob);
    } else {
      // Firefox requires the link to be added to the DOM before it can be clicked.
      downloadLink.href = window.URL.createObjectURL(textAsBlob);
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
    }

    downloadLink.click();
  }

  /**
   * Reset zoom and center blocks.
   */
  resetZoom() {
    this.state.blocklyWorkspace?.setScale(1);
    this.state.blocklyWorkspace?.scrollCenter();
  }

  /**
   * Refresh editor toolbox.
   */
  refresh() {
    const toolbox = this.state.blocklyWorkspace?.getToolbox();
    if (toolbox) {
      if (this.props.toolbox) {
        this.state.blocklyWorkspace?.updateToolbox(this.props.toolbox);
      }
      console.log('Refreshing toolbox ...');
      toolbox.refreshSelection();
    }
  }

  /**
   * Resize editor content to parent container.
   */
  resize() {
    if (!this.state.blocklyWorkspace) {
      return;
    }
    const parentElement =
      this.state.blocklyWorkspace.getInjectionDiv().closest('.wb-body') ||
      this.state.blocklyWorkspace.getInjectionDiv().parentElement;
    if (parentElement) {
      const injectionDiv =
        this.state.blocklyWorkspace.getInjectionDiv().parentElement;
      if (injectionDiv && injectionDiv != parentElement) {
        if (this.toolbar && this.toolbar.current) {
          injectionDiv.style.height =
            parentElement.clientHeight -
            this.toolbar.current.clientHeight +
            'px';
        } else {
          injectionDiv.style.height = parentElement.clientHeight + 'px';
        }
      }
    }
    window.dispatchEvent(new Event('resize'));
    this.resetZoom();
  }

  /**
   * @return {*}
   */
  getToolboxCategory() {
    const toolboxCategories = {
      kind: 'categoryToolbox',
      contents: [
        {
          kind: 'category',
          name: 'Logic',
          colour: '#5C81A6',
          contents: [
            {
              kind: 'block',
              type: 'controls_if',
            },
            {
              kind: 'block',
              type: 'logic_compare',
            },
          ],
        },
        {
          kind: 'category',
          name: 'Math',
          colour: '#5CA65C',
          contents: [
            {
              kind: 'block',
              type: 'math_round',
            },
            {
              kind: 'block',
              type: 'math_number',
            },
          ],
        },
        {
          kind: 'category',
          name: 'Custom',
          colour: '#5CA699',
          contents: [
            {
              kind: 'block',
              type: 'new_boundary_function',
            },
            {
              kind: 'block',
              type: 'return',
            },
          ],
        },
      ],
    };
    return toolboxCategories;
  }

  /**
   * @return {Object}
   */
  render() {
    const project = this.props.project || this.state.project;
    return (
      <React.StrictMode>
        <Box sx={{ display: this.state.showEditor ? 'none' : 'block' }}>
          {this.state.blocklyWorkspace && (
            <BlockToolbar
              ref={this.toolbar}
              blockEditor={this}
              blocklyWorkspace={this.state.blocklyWorkspace}
              hasChanged={this.state.hasChanged}
              hasSaved={this.state.hasSaved}
              hasUndo={this.state.hasUndo}
              hasRedo={this.state.hasRedo}
              project={project}
              onFullscreen={this.props.onFullscreen}
              onNewProject={this.props.onNewProject}
              onOpenProject={this.props.onOpenProject}
            />
          )}
          <Box>
            <BlocklyWorkspace
              className={this.props.windowId ? styles.fillWindow : styles.fill}
              toolboxConfiguration={
                this.props.toolbox || this.getToolboxCategory()
              }
              workspaceConfiguration={this.state.config}
              initialXml={this.props.content || ''}
              onInject={this.onLoad.bind(this)}
              onWorkspaceChange={this.handleWorkspaceChange.bind(this)}
              onXmlChange={this.handleXMLChange.bind(this)}
            />
          </Box>
          <Snackbar
            open={this.state.snackbarSaved}
            autoHideDuration={6000}
            onClose={() => {
              this.setState({ snackbarSaved: false });
            }}
          >
            <MuiAlert severity="success">
              Project {project.name} successfully saved!
            </MuiAlert>
          </Snackbar>
        </Box>
        {this.state.showEditor && (
          <Box sx={{ display: this.state.showEditor ? 'block' : 'none' }}>
            <CodeEditor
              windowId={this.props.windowId}
              project={project}
              blockEditor={this}
              ref={this.codeEditor}
            ></CodeEditor>
          </Box>
        )}
      </React.StrictMode>
    );
  }
}

BlockEditor.propTypes = {
  /** @type {string} */
  content: PropTypes.string,

  /** @type {function} */
  onChange: PropTypes.func,

  /** @type {function} */
  onLoadWorkspace: PropTypes.func,

  /** @type {function} */
  onFullscreen: PropTypes.func,

  /** @type {function} */
  onNewProject: PropTypes.func,

  /** @type {function} */
  onOpenProject: PropTypes.func,

  /** @type {function} */
  parseXML: PropTypes.func,

  /** @type {Project} */
  project: PropTypes.object,

  /** @type {function} */
  template: PropTypes.func,

  toolbox: PropTypes.object,
  windowId: PropTypes.string,
};
