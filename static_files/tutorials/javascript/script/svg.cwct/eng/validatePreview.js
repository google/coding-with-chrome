/**
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
 * @author carheden@google.com (Adam Carheden)
 */


let validatePreview = function() {
  let getPoints = function(line) {
    return [
      {x: line.x1.baseVal.value, y: line.y1.baseVal.value},
      {x: line.x2.baseVal.value, y: line.y2.baseVal.value}];
  };
  let slope = function(line) {
    return (line[1].y - line[0].y) / (line[1].x - line[0].x);
  };
  let angle = function(l1, l2) {
    let a = Math.abs(
      (Math.PI - Math.abs(
        Math.atan(slope(l2)) - Math.atan(slope(l1))))* 180 / Math.PI);
    if (a > 90) a = a - 90;
    return a;
  };
  let sharedPoint = function(l1, l2) {
    if (l1[0].x == l2[0].x && l1[0].y == l2[0].y) {
      return {
        shared: {x: l1[0].x, y: l1[0].y},
        other1: {x: l1[1].x, y: l1[1].y},
        other2: {x: l2[1].x, y: l2[1].y},
      };
    }
    if (l1[0].x == l2[1].x && l1[0].y == l2[1].y) {
      return {
        shared: {x: l1[0].x, y: l1[0].y},
        other1: {x: l1[1].x, y: l1[1].y},
        other2: {x: l2[0].x, y: l2[0].y},
      };
    }
    if (l1[1].x == l2[0].x && l1[1].y == l2[0].y) {
      return {
        shared: {x: l1[1].x, y: l1[1].y},
        other1: {x: l1[0].x, y: l1[0].y},
        other2: {x: l2[1].x, y: l2[1].y},
      };
    }
    if (l1[1].x == l2[1].x && l1[1].y == l2[1].y) {
      return {
        shared: {x: l1[1].x, y: l1[1].y},
        other1: {x: l1[0].x, y: l1[0].y},
        other2: {x: l2[0].x, y: l2[0].y},
      };
    }
    return false;
  };
  let found = false;
  Array.from(document.getElementsByTagName('svg')).forEach(function(svg) {
    let lines = Array.from(svg.getElementsByTagName('line'));
    lines.forEach(function(line1, i) {
      lines.forEach(function(line2, j) {
        if (i <= j) return;
        let l1 = getPoints(line1);
        let l2 = getPoints(line2);
        if (angle(l1, l2) != 90) return;
        let sp = sharedPoint(l1, l2);
        if (!sp) return;
        // Find another line to complete the triangle
        lines.forEach(function(line3) {
          let l3 = getPoints(line3);
          if ((sp.other1.x == l3[0].x && sp.other1.y == l3[0].y &&
               sp.other2.x == l3[1].x && sp.other2.y == l3[1].y) ||
              (sp.other1.x == l3[1].x && sp.other1.y == l3[1].y &&
               sp.other2.x == l3[0].x && sp.other2.y == l3[0].y)) {
            found = true;
            return;
          }
        });
        if (found) return;
      });
      if (found) return;
    });
    if (found) return;
  });
  return found;
};

validatePreview();
