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
const path = require('path');

const date = new Date(Date.now()).toLocaleString();
const version = '6.01.05';
const commits = require('child_process').execSync('git --no-pager log -10')
  .toString('utf8').trim().replace(/[ \t]+$/gm, '');

const whats_new_path = path.join(__dirname, '../../static_files/whats_new',
  `${version}.md`);

let whats_new_md = false;
try {
  fs.accessSync(whats_new_path, fs.constants.F_OK | fs.constants.R_OK);
} catch (err) {
  console.warn(`

'${whats_new_path}' doesn't exist or isn't readable.

Consider writing release notes before releasing.

`);
  whats_new_md = '';
}
if (whats_new_md === false) {
  whats_new_md = fs.readFileSync(whats_new_path, 'utf8').trim();
}

const changelog_md = 'CHANGELOG.md';
fs.writeFile(changelog_md,
`<!-- markdownlint-disable -->
${date} -v${version}

${whats_new_md}

Recent Changelog
----------------

${commits}
[Show all](https://github.com/google/coding-with-chrome/commits/master)
`,
  function(err) {
    if (err) {
        return console.log(err);
    }

    console.log(`Wrote '${changelog_md}'`);
});
