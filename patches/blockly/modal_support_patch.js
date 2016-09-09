/**
 * @fileoverview Modal support patch for Blockly.
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



/**
 * Return a sorted list of variable names for variable dropdown menus.
 * Include a special option at the end for creating a new variable name.
 * @return {!Array.<string>} Array of variable names.
 * @this {!Blockly.FieldVariable}
 */
Blockly.FieldVariable.dropdownCreate = function() {
  if (this.sourceBlock_ && this.sourceBlock_.workspace) {
    // Get a copy of the list, so that adding rename and new variable options
    // doesn't modify the workspace's list.
    var variableList = this.sourceBlock_.workspace.variableList.slice(0);
  } else {
    var variableList = [];
  }
  // Ensure that the currently selected variable is an option.
  var name = this.getText();
  if (name && variableList.indexOf(name) == -1) {
    variableList.push(name);
  }
  variableList.sort(goog.string.caseInsensitiveCompare);
  if (typeof window.prompt !== 'undefined' ||
      (workspace && workspace.options.modalOptions.prompt)) {
    variableList.push(Blockly.Msg.RENAME_VARIABLE);
  }
  variableList.push(Blockly.Msg.DELETE_VARIABLE.replace('%1', name));
  // Variables are not language-specific, use the name as both the user-facing
  // text and the internal representation.
  var options = [];
  for (var x = 0; x < variableList.length; x++) {
    options[x] = [variableList[x], variableList[x]];
  }
  return options;
};


/**
 * Event handler for a change in variable name.
 * Special case the 'New variable...' and 'Rename variable...' options.
 * In both of these special cases, prompt the user for a new name.
 * @param {string} text The selected dropdown menu option.
 * @return {null|undefined|string} An acceptable new variable name, or null if
 *     change is to be either aborted (cancel button) or has been already
 *     handled (rename), or undefined if an existing variable was chosen.
 */
Blockly.FieldVariable.prototype.classValidator = function(text) {
  var workspace = this.sourceBlock_.workspace;
  var newVarName = Blockly.Variables.generateUniqueName(workspace);
  var oldVar = this.getText();
  var callbackFunc = function(variable_name) {
    Blockly.hideChaff();
    if (!variable_name) {
      return;
    }
    // Merge runs of whitespace.  Strip leading and trailing whitespace.
    // Beyond this, all names are legal.
    variable_name = variable_name
      .replace(/[\s\xa0]+/g, ' ')
      .replace(/^ | $/g, '');
    if (!variable_name ||
        variable_name == Blockly.Msg.RENAME_VARIABLE ||
        variable_name == Blockly.Msg.NEW_VARIABLE ||
        variable_name == Blockly.Msg.DELETE_VARIABLE) {
      // Ok, not ALL names are legal...
      return;
    }

    if (text == Blockly.Msg.RENAME_VARIABLE) {
      workspace.renameVariable(oldVar, variable_name, workspace);
    } else if (text == Blockly.Msg.NEW_VARIABLE) {
      workspace.renameVariable(newVarName, variable_name, workspace);
    }
  };

  var promptDialog = workspace.options.modalOptions.prompt;
  if (text == Blockly.Msg.RENAME_VARIABLE) {
    promptDialog(Blockly.Msg.RENAME_VARIABLE_TITLE.replace('%1', oldVar),
        oldVar, callbackFunc, text);
    return null;
  } else if (text == Blockly.Msg.NEW_VARIABLE) {
    window.setTimeout(function() {
      promptDialog(Blockly.Msg.NEW_VARIABLE_TITLE, newVarName, callbackFunc,
          text);
    }, 100);
    return newVarName;
  } else if (text == Blockly.Msg.DELETE_VARIABLE.replace('%1', oldVar)) {
    workspace.deleteVariable(oldVar, workspace);
    return null;
  }
  return undefined;
};


/**
 * Create a new variable on the given workspace.
 * @param {!Blockly.Workspace} workspace The workspace on which to create the
 *     variable.
 * @return {null|undefined|string} An acceptable new variable name, or null if
 *     change is to be aborted (cancel button), or undefined if an existing
 *     variable was chosen.
 */
Blockly.Variables.createVariable = function(workspace) {
  var promptDialog = workspace.options.modalOptions.prompt;

  var callbackFunc = function(text) {
    if (text && workspace.variableIndexOf(text) === -1) {
      workspace.createVariable(text);
    }
  };

  promptDialog(Blockly.Msg.NEW_VARIABLE_TITLE, '', callbackFunc);
};


/**
 * Delete a variables and all of its uses from this workspace.
 * @param {string} name Name of variable to delete.
 */
Blockly.Workspace.prototype.deleteVariable = function(name, workspace) {
  var variableIndex = this.variableIndexOf(name);
  if (variableIndex != -1) {
    var uses = this.getVariableUses(name);
    if (uses.length > 1) {
      for (var i = 0, block; block = uses[i]; i++) {
        if (block.type == 'procedures_defnoreturn' ||
          block.type == 'procedures_defreturn') {
          var procedureName = block.getFieldValue('NAME');
          var alertDialog = workspace.options.modalOptions.alert;
          alertDialog(
              Blockly.Msg.CANNOT_DELETE_VARIABLE_PROCEDURE.replace('%1', name).
              replace('%2', procedureName));
          return;
        }
      }
      var confirmDialog = workspace.options.modalOptions.confirm;
      var confirmCallback = function(del) {
        if (!del) {
          return;
        }
        Blockly.Events.setGroup(true);
        for (var i = 0; i < uses.length; i++) {
          uses[i].dispose(true, false);
        }
        Blockly.Events.setGroup(false);
        this.variableList.splice(variableIndex, 1);
      };
      confirmDialog(Blockly.Msg.DELETE_VARIABLE_CONFIRMATION
        .replace('%1', uses.length)
        .replace('%2', name), confirmCallback.bind(this));
    } else {
      Blockly.Events.setGroup(true);
      for (var i = 0; i < uses.length; i++) {
        uses[i].dispose(true, false);
      }
      Blockly.Events.setGroup(false);
      this.variableList.splice(variableIndex, 1);
    }
  }
};
