/**
 * @fileoverview Launches the Coding with Chrome editor.
 *
 * @license Copyright 2015 The Coding with Chrome Authors.
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


chrome.app.runtime.onLaunched.addListener(
  function(launchData) {
    if (launchData) {
      if (launchData.items) {
        console.log('Found file:', launchData.items[0]);
      }
      console.log('launchData', launchData);
    }

    let screenWidth = screen.availWidth;
    let screenHeight = screen.availHeight;
    console.log('Screen-size', screenWidth, 'x', screenHeight);
    let editorWidth = 1280;
    let editorHeight = 720;
    let editorConfig = {
      frame: 'none',
      id: 'editor',
      innerBounds: {
        width: editorWidth,
        height: editorHeight,
        minWidth: 800,
        minHeight: 600,
      },
      hidden: false,
    };

    chrome.app.window.create('index.html', editorConfig, function(editor) {
      if (editor) {
        editor.outerBounds.setPosition(
          Math.round((screenWidth - editorWidth) / 2),
          Math.round((screenHeight - editorHeight) / 2)
        );
        editor.contentWindow.addEventListener('load', () => {
          if (chrome.mdns) {
            let mDNS = editor.contentWindow.CWC_BUILDER.mDNS.bind(
              editor.contentWindow.CWC_BUILDER);
            chrome.mdns.onServiceList.addListener((data) => {
                mDNS('_cros_p2p._tcp.local', data);
              }, {serviceType: '_cros_p2p._tcp.local'});
            chrome.mdns.onServiceList.addListener((data) => {
                mDNS('_ssh._tcp.local', data);
              }, {serviceType: '_ssh._tcp.local'});
          }
        });
        editor.drawAttention();
      } else {
        console.warn('Loaded inside sand-boxed window!');
      }
    });
  }
);

chrome.runtime.onInstalled.addListener(function() {
  console.log('Thanks for installing Coding with Chrome!');
});
