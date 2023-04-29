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
 * @fileoverview Screenshot instance.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React, { createRef } from 'react';
import PropTypes from 'prop-types';

import styles from './style.module.css';

/**
 *
 */
export class Screenshot extends React.PureComponent {
  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
    this.screenshotIframe = createRef();
  }

  /**
   * @param {event} event
   */
  handleScreenshotIframeError(event) {
    console.error(
      `Screenshot Content Error with url ${this.props.url}:`,
      event
    );
    this.setState({ show: false });
  }

  /**
   * @return {Object}
   */
  render() {
    return (
      <React.StrictMode>
        {this.props.url && (
          <iframe
            className={styles.screenshotIframe}
            ref={this.screenshotIframe}
            src={this.props.url}
            allow="geolocation; encrypted-media; xr-spatial-tracking;"
            onError={this.handleScreenshotIframeError.bind(this)}
            sandbox="allow-scripts allow-modals allow-forms allow-same-origin allow-top-navigation-by-user-activation"
            title="Screenshot Container"
            width="1080"
            height="720"
          ></iframe>
        )}
      </React.StrictMode>
    );
  }
}

Screenshot.propTypes = {
  url: PropTypes.string,
};
