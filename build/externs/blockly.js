/**
 * @fileoverview Blockly externs.
 *
 * @license Copyright 2016 The Coding with Chrome Authors.
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
 *
 * @author mbordihn@google.com (Markus Bordihn)
 */



/** @constructor */
var Blockly = function() {};

/** @const */
Blockly.HSV_SATURATION;

/** @const */
Blockly.HSV_VALUE;

/**
 * @param {!Element|string} container Containing element, or its ID,
 *     or a CSS selector.
 * @param {Object=} opt_options Optional dictionary of options.
 * @return {!Blockly.Workspace} Newly created main workspace.
 */
Blockly.inject = function(container, opt_options) {};

/**
 * @return {!Blockly.Workspace} The main workspace.
 */
Blockly.getMainWorkspace = function() {};

/**
 * @param {!Blockly.WorkspaceSvg} workspace Any workspace in the SVG.
 */
Blockly.svgResize = function(workspace) {};

/**
 * @param {Node|string} tree DOM tree of blocks, or text representation of same.
 */
Blockly.updateToolbox = function(tree) {};

/**
 * @param {!Function} func Function to call.
 * @return {!Array.<!Array>} Opaque data that can be passed to
 *     removeChangeListener.
 * @deprecated April 2015
 */
Blockly.addChangeListener = function(func) {};


/** @type {Function} */
Blockly.Events = function() {};

/** @type {!string} */
Blockly.Events.CREATE;

/** @type {!string} */
Blockly.Events.CHANGE;

/** @type {!string} */
Blockly.Events.DELETE;

/** @type {!string} */
Blockly.Events.MOVE;

/** @type {!string} */
Blockly.Events.UI;

/** @type {Function} */
Blockly.Events.disableOrphans = function() {};

/**
 * @param {Blockly.Workspace} workspace Workspace to generate code from.
 * @return {string} Generated code.
 */
Blockly.JavaScript.prototype.workspaceToCode = function(workspace) {};

/**
 * @param {Blockly.Block} block The block to generate code for.
 * @return {string|!Array} For statement blocks, the generated code.
 *     For value blocks, an array containing the generated code and an
 *     operator order value.  Returns '' if block is null.
 */
Blockly.JavaScript.prototype.blockToCode = function(block) {};

/**
 * @param {!Blockly.Block} block The block containing the input.
 * @param {string} name The name of the input.
 * @return {string} Generated code or '' if no blocks are connected.
 */
Blockly.JavaScript.prototype.statementToCode = function(block, name) {};


/**
 * @param {!Blockly.Workspace} workspace The workspace containing blocks.
 * @param {boolean} pretty_print
 * @return {!Element} XML document.
 */
Blockly.Xml.workspaceToDom = function(workspace, pretty_print) {};

/**
 * @param {string} text Text representation.
 * @return {!Element} A tree of XML elements.
 */
Blockly.Xml.textToDom = function(text) {};

/**
 * @param {!Element} xml XML DOM.
 * @param {!Blockly.Workspace} workspace The workspace.
 */
Blockly.Xml.domToWorkspace = function(xml, workspace) {};

/**
 * @param {!Element} xmlBlock XML block element.
 * @param {!Blockly.Workspace} workspace The workspace.
 * @return {!Blockly.Block} The root block created.
 */
Blockly.Xml.domToBlock = function(xmlBlock, workspace) {};

/**
 * @param {!Element} dom A tree of XML elements.
 * @return {string} Text representation.
 */
Blockly.Xml.domToPrettyText = function(dom) {};


/** @constructor */
Blockly.Block = function() {};

/**
 * @param {!Blockly.Workspace} workspace
 * @param {?string} prototypeName
 * @param {string=} opt_id
 * @constructor
 */
Blockly.Blocks = function(workspace, prototypeName, opt_id) {};


/** @type {Object} */
Blockly.BlockSvg = {};

/** @type {boolean} */
Blockly.BlockSvg.START_HAT;


/** @type {Object} */
Blockly.JavaScript = {};

/** @type {string} */
Blockly.JavaScript.ORDER_ATOMIC = '';

/**
 * @param {!Blockly.Block} block
 * @param {string} name
 * @param {number} order
 * @return {string}
 */
Blockly.JavaScript.prototype.valueToCode = function(block, name, order) {};


/** @type {Object} */
Blockly.Xml = {};


/** @type {Object} */
Blockly.Variables = {};

/**
 * @param {!Blockly.Workspace} workspace
 * @param {function(?string=)=} opt_callback
 */
Blockly.Variables.createVariable = function(workspace, opt_callback) {};


/** @constructor */
Blockly.Workspace = function() {};

/** @type {Object} */
Blockly.Workspace.options = {};

/** @type {Array} */
Blockly.Workspace.undoStack_ = [];

/** @type {Array} */
Blockly.Workspace.redoStack_ = [];

/** @type {Object} */
Blockly.Workspace.toolbox_ = {};

/** @type {Object} */
Blockly.Workspace.toolbox_.tree_ = {};

/** @type {Object} */
Blockly.Workspace.toolbox_.tree_.childIndex_ = {};

/** @param {number} newScale */
Blockly.Workspace.prototype.setScale = function(newScale) {};

/**
 * Center the workspace.
 */
Blockly.Workspace.prototype.scrollCenter = function() {};

/**
 * @param {Node|string} tree
 */
Blockly.Workspace.prototype.updateToolbox = function(tree) {};

/**
 * @param {!Function} func
 * @return {!Function}
 */
Blockly.Workspace.prototype.addChangeListener = function(func) {};

/**
 * @param {boolean} redo False if undo, true if redo.
 */
Blockly.Workspace.prototype.undo = function(redo) {};

/**
 * @param {!Blockly.Options} options
 * @param {Blockly.BlockDragSurfaceSvg=} opt_blockDragSurface
 * @param {Blockly.workspaceDragSurfaceSvg=} opt_wsDragSurface
 * @constructor
 */
Blockly.WorkspaceSvg = function(options,
    opt_blockDragSurface, opt_wsDragSurface) {
};

/** @constructor */
Blockly.Options = function() {};

/**
 * @param {!Element} container Containing element.
 * @constructor
 */
Blockly.BlockDragSurfaceSvg = function(container) {};

/**
 * @param {!Element} container Containing element.
 * @constructor
 */
Blockly.workspaceDragSurfaceSvg = function(container) {};
