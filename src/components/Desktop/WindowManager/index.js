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
 * @fileoverview Window Manager based on react-winbox.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React from 'react';

import WinBox from 'react-winbox';

import { WindowData } from './WindowData';
import { WindowCloseEvent, WindowResizeEvent } from './Events.js';

import 'winbox/dist/css/winbox.min.css';
import 'winbox/dist/css/themes/modern.min.css';

/**
 * Window Manager
 */
export class WindowManager extends React.PureComponent {
  static component;

  static windowsMap = new Map();

  static lastXPosition = 20;

  static lastYPosition = 50;

  static windowManagerEventTarget = new EventTarget();

  static WINDOW_PREFIX = 'window_';

  static DEFAULT_WINDOW_OPTIONS = {
    title: 'Unnamed',
    width: 500,
    height: 400,
    x: 'center',
    y: 50,
    noClose: false,
  };

  /**
   * @param {string} title
   * @return {Promise<String>}
   */
  static addNewWindow(title) {
    return WindowManager.addWindow({
      ...WindowManager.DEFAULT_WINDOW_OPTIONS,
      title: title,
    });
  }

  /**
   * @param {*} infos
   * @return {Promise<String>}
   */
  static addWindow(infos) {
    const windowId = WindowManager.getWindowId(
      infos.id || 'unnamed_' + Math.random().toString(36).substring(2, 5)
    );
    const existingWindow = WindowManager.getWindowNode(windowId);
    return new Promise((resolve, reject) => {
      if (existingWindow) {
        if (existingWindow instanceof HTMLElement) {
          console.warn(
            `Will use existing window with id ${windowId}:`,
            existingWindow
          );
          resolve(windowId);
        } else {
          reject(
            new Error(`Existing element for ${windowId} is no HTMLElement!`)
          );
        }
        return;
      }
      console.info(`Adding new window ${windowId} with:`, infos);

      // Update position for next window.
      if (WindowManager.lastXPosition < 600) {
        WindowManager.lastXPosition += 20;
      } else {
        WindowManager.lastXPosition = 10;
      }
      if (WindowManager.lastYPosition < 400) {
        WindowManager.lastYPosition += 20;
      } else {
        WindowManager.lastYPosition = 50;
      }

      this.updateWindowData(
        windowId,
        new WindowData(
          windowId,
          infos.title,
          500,
          300,
          WindowManager.lastXPosition,
          WindowManager.lastYPosition
        )
      ).then((windowId) => {
        resolve(windowId);
      });
    });
  }

  /**
   *
   * @param {string} windowId
   * @param {WindowData} windowData
   * @return {Promise<String>}
   */
  static updateWindowData(windowId, windowData) {
    return new Promise((resolve, reject) => {
      WindowManager.windowsMap.set(windowId, windowData);

      // Change state for the component and resolve promise if possible.
      WindowManager.component.setState(
        {
          windows: WindowManager.windowsMap,
        },
        () => {
          WindowManager.component.forceUpdate();
          setTimeout(() => {
            const node = WindowManager.getWindowNode(windowId);
            if (node) {
              resolve(windowId);
            } else {
              reject(new Error(`Unable to find element for ${windowId}!`));
            }
          }, 100);
        }
      );
    });
  }

  /**
   * @param {string} windowName
   * @return {string}
   */
  static getWindowId(windowName) {
    return windowName.startsWith(WindowManager.WINDOW_PREFIX)
      ? windowName
      : WindowManager.WINDOW_PREFIX + windowName;
  }

  /**
   * @param {string} windowId
   * @return {HTMLElement?}
   */
  static getWindowNode(windowId) {
    return document.querySelector(
      '#' + WindowManager.getWindowId(windowId) + ' .wb-body'
    );
  }

  /**
   * @param {*} callback
   * @param {boolean} force
   */
  static updateData(callback = undefined, force = false) {
    WindowManager.component.setState(
      {
        windows: WindowManager.windowsMap,
      },
      () => {
        if (force) {
          WindowManager.component.forceUpdate();
        }
        if (typeof callback !== 'undefined') {
          setTimeout(() => {
            callback();
          });
        }
      }
    );
  }

  /**
   * @param {*} props
   * @constructor
   */
  constructor(props) {
    super(props);
    this.state = { windows: new Map() };
    WindowManager.component = this;
  }

  /**
   * @param {string} windowId
   * @param {boolean} force
   */
  handleClose(windowId, force) {
    WindowManager.windowManagerEventTarget.dispatchEvent(
      new WindowCloseEvent(windowId)
    );
    if (!force) {
      console.log('Prepare closing windows with id', windowId, force);
      WindowManager.windowsMap.delete(windowId);
      WindowManager.updateData();
    }
  }

  /**
   * @param {string} windowId
   * @param {number} width
   * @param {number} height
   */
  handleResize(windowId, width, height) {
    console.debug(`Resize request for ${windowId} with ${width} ${height} ...`);
    WindowManager.windowManagerEventTarget.dispatchEvent(
      new WindowResizeEvent(windowId)
    );
  }

  /**
   * @return {Object}
   */
  render() {
    return (
      <React.StrictMode>
        {[...this.state.windows.keys()].map((key) => (
          <WinBox
            key={this.state.windows.get(key).id}
            id={this.state.windows.get(key).id}
            x={this.state.windows.get(key).x}
            y={this.state.windows.get(key).y}
            title={this.state.windows.get(key).title}
            width={this.state.windows.get(key).width}
            height={this.state.windows.get(key).height}
            minHeight={160}
            top={50}
            onclose={(force) => this.handleClose(key, force)}
            onresize={(width, height) => this.handleResize(key, width, height)}
          ></WinBox>
        ))}
      </React.StrictMode>
    );
  }
}
