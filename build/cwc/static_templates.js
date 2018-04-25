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
 * @author carheden@google.com (Adam Carheden)
 */
require('closure-builder');
let fs = require('fs');
let path = require('path');

let mkdir = function(dir) {
  if (fs.existsSync(dir)) {
    return;
  }
  try {
    fs.mkdirSync(dir);
  } catch (e) {
    let p = path.dirname(dir);
    mkdir(p);
    fs.mkdirSync(dir);
  }
};

let procTemplates = function(dir, callback) {
  fs.readdir(dir, function(err, list) {
    if (err) {
      throw err;
    }
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          procTemplates(file, callback);
        } else {
          if (file.search(/\.cwct\.template$/i) >= 0) {
            callback(file);
          }
        }
      });
    });
  });
};

let replace = function(obj, pwd) {
  if (obj === null || typeof obj !== 'object') {
    return;
  }
  for (let k in obj) {
    if (k.match(/^___TEMPLATE___:/)) {
      obj[k.replace('___TEMPLATE___:', '')] = fs.readFileSync(pwd+'/'+obj[k],
        'utf8');
      delete obj[k];
    } else {
      replace(obj[k], pwd);
    }
  }
};

let inDir = fs.realpathSync(__dirname+'/../../static_templates');
let outDir = fs.realpathSync(__dirname+'/../../genfiles/core');
procTemplates(inDir, function(template) {
  fs.readFile(template, 'utf8', function(err, data) {
    if (err) {
      throw err;
    }
    let cwc = JSON.parse(data);

    replace(cwc, path.dirname(template));

    let target = template.replace(inDir, outDir).replace(/\.template$/, '');
    mkdir(path.dirname(target));
    fs.writeFile(target, JSON.stringify(cwc, null, '  '), function(err) {
      if (err) {
        throw err;
      }
      let base = fs.realpathSync(inDir+'/..')+'/';
      console.log(template.replace(base, '') + ' -> ' +
        target.replace(base, ''));
    });
  });
});
