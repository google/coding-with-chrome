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
 * @fileoverview Window Manager for the Coding with Chrome suite.
 */

import React from 'react';

import WinBox from 'react-winbox';

/**
 * Window Manager
 */
export class WindowManager extends React.PureComponent {
  static component;

  /**
   * @param {*} infos
   */
  static addWindow(infos) {
    console.info('Adding window ...', infos, WindowManager.component);
  }

  /**
   * @param {function} callback
   */
  static test(callback) {
    console.info('Adding test window ...', WindowManager.component);
    WindowManager.component.setState(
      {
        windows: [
          {
            id: 'test_123',
            title: 'test_123',
            width: 500,
            height: 300,
            x: 'center',
            y: 50,
            noClose: false,
          },
        ],
      },
      () => {
        WindowManager.component.forceUpdate();
        setTimeout(function () {
          callback(document.querySelector('#test_123 .wb-body'));
        });
      }
    );
  }

  /**
   * @param {*} props
   * @constructor
   */
  constructor(props) {
    super(props);
    this.state = { windows: [] };
    WindowManager.component = this;
  }

  /**
   * @param {*} force
   * @param {*} id
   */
  handleClose(force, id) {
    console.log('Closed windows with index', id);
  }

  /**
   * @return {Object}
   */
  render() {
    return (
      <React.StrictMode>
        {this.state.windows.map((info) => (
          <WinBox
            key={info.id}
            id={info.id}
            x={info.x}
            y={info.y}
            title={info.title}
            width={info.width}
            height={info.height}
            top={50}
            onclose={(force) => this.handleClose(force, info.id)}
          ></WinBox>
        ))}
      </React.StrictMode>
    );
  }
}
