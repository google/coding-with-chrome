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
import Box from '@mui/material/Box';
import MuiAlert from '@mui/material/Alert';
import PropTypes from 'prop-types';
import Snackbar from '@mui/material/Snackbar';
import i18next from '../App/i18next';

// Blockly
import Blockly from 'blockly';
import { BlocklyWorkspace } from 'react-blockly';

import BlockEditorToolbar from './BlockEditorToolbar';
import { APP_BASE_PATH } from '../../constants';
import { Database } from '../../utils/db/Database';
import { PreviewService } from '../../service-worker/preview-service-worker';
import { WindowEventTarget } from '../Desktop/WindowManager/Events';
import { javascriptGenerator } from 'blockly/javascript';

// Lazy load components
const CodeEditor = lazy(() => import('../CodeEditor/CodeEditor'));

import 'material-icons/iconfont/filled.css';
import 'material-icons/iconfont/outlined.css';
import styles from './style.module.css';
import './style.global.css';
import { DataURL } from '../../utils/file/DataURL';

/**
 * Block editor based on Blockly.
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
    this.isDragging = false;
    this.lastActiveTreeRoot = null;
    this.changeCache = {
      xml: '',
      hasChanged: false,
    };
    this.state = {
      /** @type {WorkspaceSvg} */
      blocklyWorkspace: null,

      /** @type {string} */
      code: '',

      /** @type {boolean} */
      showEditor: false,

      /** @type {boolean} */
      showDrawer: false,

      /** @type {boolean} */
      hasChanged: false,

      /** @type {boolean} */
      hasSaved: false,

      /** @type {boolean} */
      hasUndo: false,

      /** @type {boolean} */
      hasRedo: false,

      /** @type {boolean} */
      isFirstXMLUpdate: true,

      /** @type {object} */
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

      /** @type {object} */
      toolbox: props.toolbox || {
        kind: 'categoryToolbox',
        contents: [],
      },

      /** @type {string} */
      language:
        props.language || i18next.language || i18next.resolvedLanguage || 'en',

      /** @type {boolean} */
      snackbarSaved: false,

      /** @type {array} */
      variables: [],

      /** @type {string} */
      xml: '',
    };

    // Creating databases for saving and loading the workspace.
    this.database = new Database(
      this.props.project.id,
      this.props.project.type,
    );

    // Adding event listener for window resize, if windowId is set.
    if (this.props.windowId) {
      WindowEventTarget.getTarget().addEventListener(
        'windowResize',
        this.handleWindowResize.bind(this),
      );
    }

    // Dynamically loading default toolbox, if not defined.
    if (!this.props.toolbox) {
      import('./toolbox/Toolbox').then((module) => {
        this.setState({ toolbox: module.Toolbox.getToolbox() });
      });
    }

    // Adding key handler for better idle detection and less auto-refreshes.
    window.addEventListener('keydown', () => {
      this.deferXMLChange();
    });

    console.log('Adding block editor with project id: ', this.props.project.id);
  }

  /**
   *
   */
  componentDidMount() {
    // Setting blockly language pack.
    if (this.state.language !== 'en') {
      this.changeLanguage(this.state.language);
    }

    // Adding event listener for language change.
    i18next.on('languageChanged', (language) => {
      if (this.state.language == language) {
        return;
      }
      this.refreshWorkspace();
      this.changeLanguage(language);
      this.forceUpdate();
      this.refresh();
    });

    // Loading workspace from database, if not empty.
    this.database.get('workspace').then((workspace) => {
      if (workspace) {
        console.debug('Loading workspace from database ...');
        this.loadWorkspace(workspace);
      }
    });
  }

  /**
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    if (this.props.toolbox !== prevProps.toolbox && !this.props.toolbox) {
      if (this.state.blocklyWorkspace) {
        this.state.blocklyWorkspace.updateToolbox(this.props.toolbox);
        window.setTimeout(this.collapseToolbox.bind(this), 100);
      }
    }
  }

  /**
   * Refresh the block editor workspace, if any.
   */
  refreshWorkspace() {
    if (this.state.blocklyWorkspace) {
      const xml = this.getXML();
      if (xml) {
        Blockly.Xml.clearWorkspaceAndLoadFromXml(
          Blockly.utils.xml.textToDom(xml),
          this.getBlocklyWorkspace(),
        );
      }
    }
  }

  /**
   * Refresh the blockly language pack.
   * @param {string} language
   */
  changeLanguage(language) {
    console.debug('Change language to', language);
    this.setState({ language: language }, () => {
      // Lazy load language pack.
      import(`blockly/msg/${language}.js`).then((module) => {
        Blockly.setLocale(module);
        this.refreshWorkspace();
      });
    });
  }

  /**
   *
   */
  showBlockEditor() {
    console.debug('Show Block Editor ...');
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
    console.debug('Show Code Editor ...');
    this.setState({ showEditor: true }, () => {
      this.codeEditor.current.resize();
      this.codeEditor.current.setValue(this.state.code);
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
        this.props.project,
        this.state.blocklyWorkspace,
      );
    }
    return code;
  }

  /**
   * @param {string} xml
   * @return {string}
   */
  praseXML(xml) {
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
   * @return {string}
   */
  getPrettyXML() {
    const xmlDom = Blockly.Xml.workspaceToDom(
      this.state.blocklyWorkspace,
      true,
    );
    return Blockly.Xml.domToText(xmlDom);
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
      console.error(
        'Unable to load workspace',
        this.getBlocklyWorkspace(),
        'with:',
        xml,
      );
      return;
    }
    console.debug('Loading workspace:', xml, files, hasChanged);

    // Parse XML and construct workspace.
    const parsedXML = this.praseXML(xml, files);
    Blockly.Xml.clearWorkspaceAndLoadFromXml(
      Blockly.utils.xml.textToDom(parsedXML),
      this.getBlocklyWorkspace(),
    );

    // Parse assets from workspace, if needed.
    let assets = new Map();
    if (
      this.props.parseAssets &&
      typeof this.props.parseAssets === 'function'
    ) {
      assets = this.props.parseAssets(this.getBlocklyWorkspace());
      console.log('Assets parsed from workspace: ', assets);
    }
    if (assets.size > 0) {
      for (const [key, value] of assets.entries()) {
        DataURL.generateIdFromDataURL(value.urlData).then((assetId) => {
          console.log('Adding asset: ', key, value, assetId);
          PreviewService.addAssetFile(
            this.props.project.id,
            assetId,
            value.urlData,
          );
        });
      }
    }

    // Update state and trigger onLoadWorkspace event.
    this.setState(
      { hasChanged: hasChanged, hasSaved: true, xml: parsedXML },
      () => {
        this.handleXMLChange(xml, hasChanged);
      },
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

    // Refresh workspace.
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
      // Loading workspace from predefined values, if defined.
      if (this.props.content) {
        this.loadWorkspace(this.props.content);
      } else {
        this.resize();
        this.refresh();
      }
    });
  }

  /**
   * @param {string} itemId
   */
  autoCollapse() {
    const toolbox = this.state.blocklyWorkspace.toolbox_;
    const treeRoots = document.getElementsByClassName('blocklyTreeRoot');
    const activeTree = document.getElementsByClassName('blocklyTreeSelected');
    if (
      !toolbox ||
      !treeRoots ||
      !treeRoots.length ||
      !activeTree ||
      !activeTree.length
    ) {
      return;
    }
    // Get active tree root and only auto-collapse if it has changed.
    const activeTreeRoot = activeTree[0].closest('.blocklyTreeRoot');
    if (!activeTreeRoot) {
      return;
    }
    if (activeTreeRoot == this.lastActiveTreeRoot) {
      activeTreeRoot.classList.toggle(
        'expanded',
        activeTreeRoot.ariaExpanded === 'true',
      );
      return;
    }
    this.lastActiveTreeRoot = activeTreeRoot;
    const activeTreeRootId = activeTreeRoot?.firstChild?.id;

    // Collapse all tree roots and expand the active one.
    for (const treeRoot of treeRoots) {
      const treeRootChild = treeRoot.firstChild;
      const treeRootId = treeRootChild.id;
      const treeRootItem = toolbox.getToolboxItemById(treeRootId);
      if (treeRootItem) {
        treeRootItem.setExpanded(treeRootId == activeTreeRootId);
        treeRoot.classList.toggle('expanded', treeRootId == activeTreeRootId);
        if (treeRootChild.style.backgroundColor) {
          treeRoot.style.backgroundImage = `linear-gradient(to right, ${treeRootChild.style.backgroundColor} 28px, #0000 0)`;
        }
      }
    }
  }

  /**
   * @param {boolean} expand
   */
  collapseToolbox(expand = false) {
    console.log('Collapse toolbox ...');
    const toolbox = this.state.blocklyWorkspace.toolbox_;
    const treeRoots = document.getElementsByClassName('blocklyTreeRoot');
    for (const treeRoot of treeRoots) {
      const treeRootItem = toolbox.getToolboxItemById(treeRoot.firstChild.id);
      if (treeRootItem) {
        treeRootItem.setExpanded(expand);
      }
    }
  }

  /**
   * @param {object} event
   */
  handleBlocklyEvent(event) {
    switch (event.type) {
      case Blockly.Events.TOOLBOX_ITEM_SELECT:
        if (this.props.autoCollapse) {
          this.autoCollapse();
        }
        break;
    }
    this.isDragging = event.type === Blockly.Events.BLOCK_DRAG;
  }

  /**
   * @param {WorkspaceSvg} workspace
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars, require-jsdoc
  handleWorkspaceChange(workspace) {
    // Not used.
  }

  /**
   * Defers any existing XML Change event, if needed.
   */
  deferXMLChange() {
    if (!this.timer.handleXMLChange) {
      return;
    }
    if (
      this.changeCache.xml &&
      this.changeCache.hasChanged &&
      this.changeCache.xml != this.state.xml
    ) {
      this.handleXMLChange(this.changeCache.xml, this.changeCache.hasChanged);
    }
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
      hasChanged,
      xml,
    });

    // Cache values for defer updates.
    this.changeCache = {
      xml: xml,
      hasChanged: hasChanged,
    };

    // Throttle and debounce XML change with a delay for performance reasons.
    if (this.timer.handleXMLChange) {
      clearTimeout(this.timer.handleXMLChange);
      this.timer.handleXMLChange = null;
    }

    // Allow fast first XML Change and throttle further XML changes.
    if (this.state.isFirstXMLUpdate) {
      this.updateCodeAfterXMLChange();
      this.setState({
        isFirstXMLUpdate: false,
      });
    } else {
      this.timer.handleXMLChange = setTimeout(() => {
        this.updateCodeAfterXMLChange();
      }, 200);
    }
  }

  /**
   * Updates code after xml change.
   */
  updateCodeAfterXMLChange() {
    // Updating stored variables.
    const variables = this.getBlocklyWorkspace()?.getAllVariables();
    if (
      variables &&
      variables.length > 0 &&
      variables != this.state.variables
    ) {
      console.debug('Variables change', variables);
      this.setState({ variables: variables });
    }

    // Processing code.
    const code = this.getWorkspaceCode();
    this.setState({ code }, () => {
      if (this.props.onChange && typeof this.props.onChange === 'function') {
        this.props.onChange(code);
      }
    });
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
      `Saving workspace for ${this.props.project} into ${this.database}`,
    );
    this.database.put('name', this.props.project.name);
    this.database.put('description', this.props.project.description);
    this.database.put('workspace', this.state.xml);
    this.database.put('lastModified', this.props.project.lastModified);

    // Store additionally project reference.
    const project = this.props.project;
    project.setLastModified();
    project.setIsEmpty(!this.state.xml);
    project.save();

    // Update states.
    this.setState({
      snackbarSaved: true,
      hasChanged: false,
      hasSaved: true,
      project,
    });

    // Trigger onSaveWorkspace event.
    if (
      this.props.onSaveWorkspace &&
      typeof this.props.onSaveWorkspace === 'function'
    ) {
      this.props.onSaveWorkspace(project, this.database, this.state.code);
    }
  }

  /**
   * Export project file.
   */
  handleExportFile() {
    console.log(`Export  ${this.props.project} ...`);
    const textAsBlob = new Blob([this.state.xml], { type: 'text/plain' });
    const downloadLink = document.createElement('a');
    downloadLink.download = `${this.props.project.name}-${this.props.project.id}.xml`;
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
   * @return {Object}
   */
  render() {
    return (
      <React.StrictMode>
        <Box sx={{ display: this.state.showEditor ? 'none' : 'block' }}>
          {this.state.blocklyWorkspace && (
            <BlockEditorToolbar
              ref={this.toolbar}
              blockEditor={this}
              blocklyWorkspace={this.state.blocklyWorkspace}
              hasChanged={this.state.hasChanged}
              hasSaved={this.state.hasSaved}
              hasUndo={this.state.hasUndo}
              hasRedo={this.state.hasRedo}
              project={this.props.project}
              onFullscreen={this.props.onFullscreen}
              onNewProject={this.props.onNewProject}
              onOpenProject={this.props.onOpenProject}
              onDeleteProject={this.props.onDeleteProject}
            />
          )}
          <Box>
            <BlocklyWorkspace
              className={this.props.windowId ? styles.fillWindow : styles.fill}
              toolboxConfiguration={this.props.toolbox || this.state.toolbox}
              workspaceConfiguration={this.state.config}
              initialXml={''}
              onInject={this.onLoad.bind(this)}
              onWorkspaceChange={this.handleWorkspaceChange.bind(this)}
              onXmlChange={this.handleXMLChange.bind(this)}
            />
          </Box>
          {this.state.snackbarSaved && (
            <Snackbar
              open={this.state.snackbarSaved}
              autoHideDuration={6000}
              onClose={() => {
                this.setState({ snackbarSaved: false });
              }}
            >
              <MuiAlert severity="success">
                Project {this.props.project.name} successfully saved!
              </MuiAlert>
            </Snackbar>
          )}
        </Box>
        {this.state.showEditor && (
          <Box sx={{ display: this.state.showEditor ? 'block' : 'none' }}>
            <CodeEditor
              ref={this.codeEditor}
              windowId={this.props.windowId}
              project={this.props.project}
              blockEditor={this}
              onChange={this.props.onChange}
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
  onSaveWorkspace: PropTypes.func,

  /** @type {function} */
  onFullscreen: PropTypes.func,

  /** @type {function} */
  onNewProject: PropTypes.func,

  /** @type {function} */
  onOpenProject: PropTypes.func,

  /** @type {function} */
  onDeleteProject: PropTypes.func,

  /** @type {function} */
  parseXML: PropTypes.func,

  /** @type {function} */
  parseAssets: PropTypes.func,

  /** @type {Project} */
  project: PropTypes.object.isRequired,

  /** @type {function} */
  template: PropTypes.func,

  /** @type {boolean} */
  autoCollapse: PropTypes.bool,

  /** @type {string} */
  language: PropTypes.string,

  /** @type {object} */
  toolbox: PropTypes.object,

  /** @type {string} */
  windowId: PropTypes.string,
};
