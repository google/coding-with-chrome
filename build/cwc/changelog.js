/**
 * @fileoverview BUILD configuration for Coding with Chrome satic files.
 *
 * @license Copyright 2017 The Coding with Chrome Authors.
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
 * @author gau@google.com (Ashley Gau)
 */
const fs = require('fs');

const date = new Date(Date.now()).toLocaleString();
const version = '5.10.16';
const commits = require('child_process').execSync('git --no-pager log -10');

fs.writeFile('CHANGELOG.md',
`New Major Coding With Chrome Update
====================================

${date} -v${version}

Recent Changelog
----------------

${commits}
[Show all](https://github.com/google/coding-with-chrome/commits/master)
`,
  function(err) {
    if (err) {
        return console.log(err);
    }

    console.log('The file was saved!');
});
