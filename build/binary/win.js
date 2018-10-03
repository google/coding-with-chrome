/**
 * @fileoverview BUILD configuration for Coding with Chrome (win app).
 *
 * @license Copyright 2018 The Coding with Chrome Authors.
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
let mv = require('mv');


/**
 * Windows 32 bit
 */
mv('dist/binary/win32/binary.exe',
   'dist/binary/win32/Coding with Chrome.exe',
   {mkdirp: false}, function() {});

/**
 * Windows 64 bit
 */
mv('dist/binary/win64/binary.exe',
   'dist/binary/win64/Coding with Chrome.exe',
   {mkdirp: false}, function() {});
