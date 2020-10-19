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
 * @author mbordihn@google.com (Markus Bordihn)
 *
 * @fileoverview Screen for the Coding with Chrome suite.
 */

import './Screen.css';

/**
 * Screen class
 */
export class Screen {
  /**
   * @constructor
   */
  constructor() {
    /** @type {string} */
    this.nodeId = 'cwc-screen';

    /** @type {HTMLElement|null} */
    this.node = document.getElementById(this.nodeId);

    /** @type {Map} */
    this.screen = new Map();

    /** @type {string} */
    this.prefix = 'cwc-screen-';
  }

  /**
   *
   */
  init() {
    if (this.node) {
      return;
    }
    if (document.getElementById(this.nodeId)) {
      this.node = document.getElementById(this.nodeId);
    } else {
      this.node = document.createElement('div');
      this.node.id = this.nodeId;
      const bodyNode = document.querySelector('body');
      if (bodyNode) {
        bodyNode.appendChild(this.node);
      } else {
        console.error('Unable to add screen node to body element!');
      }
    }
  }

  /**
   * @param {string} id
   * @param {string} name
   * @param {boolean} hidden
   * @return {HTMLElement}
   */
  add(id, name = '', hidden = false) {
    if (!this.node) {
      this.init();
    }
    if (this.screen.has(id)) {
      console.error(`Screen with ${id} already exists!`);
      return this.screen.get(id);
    }
    console.debug(`Add screen ${name} with id ${id}`);
    const screenElement =
      document.getElementById(this.prefix + id) ||
      document.createElement('div');
    if (!screenElement.id) {
      screenElement.id = this.prefix + id;
    }
    screenElement.classList.add(this.nodeId);
    if (name) {
      screenElement.dataset.name = name;
    }
    if (this.node) {
      this.node.appendChild(screenElement);
    }
    this.screen.set(id, screenElement);
    if (hidden) {
      screenElement.style.display = 'none';
    } else {
      this.show(id);
    }
    return screenElement;
  }

  /**
   * @param {*} id
   */
  show(id) {
    if (!this.screen.has(id)) {
      return;
    }
    for (const [nodeId, node] of this.screen) {
      if (nodeId == id) {
        node.style.display = 'block';
      } else if (node.style.display !== 'none') {
        node.style.display = 'none';
      }
    }
  }

  /**
   * @param {*} id
   */
  hide(id) {
    const node = this.screen.get(id);
    if (!node) {
      return;
    }
    console.debug('Hide screen', id, node);
    node.style.display = 'none';
  }

  /**
   * @param {*} id
   */
  remove(id) {
    const node = this.screen.get(id);
    if (!node) {
      return;
    }
    console.debug('Remove screen', id, node);
    this.screen.delete(id);
    if (this.node) {
      this.node.removeChild(node);
    }
  }
}

export const screen = new Screen();
