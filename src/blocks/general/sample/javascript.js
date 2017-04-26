/**
 * @fileoverview JavaScript for the general blocks.
 *
 * @license Copyright 2016 The Coding with Chrome Authors.
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



/**
 * Sample image: 50px_red.png
 */
Blockly.JavaScript['general_sample_image_50px_red'] = function() {
  var image = 'iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAn1BMVEUAAAAAAI' +
    'AAgAAAgICAAACAAICAgADAwMBkZGQJCQkAAP8A/wD/AAD//wD/AP8A///v7+/h4eHU1NTGxs' +
    'a5ubmrq6udnZ2QkJCCgoJ1dXVnZ2dZWVlMTEw+Pj4xMTEjIyP/AADyAADmAADZAADMAAC/AA' +
    'CzAACmAACZAACMAACAAABzAABmAABZAABNAABAAAD/2tr/u7v/nJz/fX3/XV3pGHVwAAAAW0' +
    'lEQVRIie3RywkAIAwDUMfJANl/Ng+V2kNRKuLFBPxUeFi0oZwGFiMiIiIiIvIjAQDYMs6tpo' +
    '2U0Oe5xQkZ6haht06vQ5USbz1euL7lGlm+mLUe/mVLKnlGyum+je8shDgFkgAAAABJRU';
  return ['data:image/png;base64,' + image, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Sample image: 50px_green.png
 */
Blockly.JavaScript['general_sample_image_50px_green'] = function() {
  var image = 'iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAABCFBMVEUAAAAAAI' +
    'AAgAAAgICAAACAAICAgADAwMBkZGQJCQkAAP8A/wD/AAD//wD/AP8A///v7+/h4eHU1NTGxs' +
    'a5ubmrq6udnZ2QkJCCgoJ1dXVnZ2dZWVlMTEw+Pj4xMTEjIyP/AADyAADmAADZAADMAAC/AA' +
    'CzAACmAACZAACMAACAAABzAABmAABZAABNAABAAAD/2tr/u7v/nJz/fX3/XV3/Pj7/Hx//AA' +
    'D8qFzum0/hjkLTgTXFcye3ZhqqWQ2cTAD8/Njv78rj47vW1q3Kyp69vZCxsYKkpHOYmGWLi1' +
    'Z/f0hycjpmZitZWR1NTQ5AQADQ/FzA7k+w4UKg0zWQxSeAtxpwqg1gnADHFUx9AAAAW0lEQV' +
    'RIie3ROwoAIAwDUI+YLfe/iUOldihKRVxMwE+Fh0Uby2lEMSIiIiIiIj8SkqQt49xq2EgJfJ' +
    '5bnpChbhF46/A6VCnx1uOF61uukeWLWevhX7akkmeknA5DtxTXptVz0wAAAA';
  return ['data:image/png;base64,' + image, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Sample image: 50px_blue.png
 */
Blockly.JavaScript['general_sample_image_50px_blue'] = function() {
  var image = 'iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAABmFBMVEUAAAAAAI' +
    'AAgAAAgICAAACAAICAgADAwMBkZGQJCQkAAP8A/wD/AAD//wD/AP8A///v7+/h4eHU1NTGxs' +
    'a5ubmrq6udnZ2QkJCCgoJ1dXVnZ2dZWVlMTEw+Pj4xMTEjIyP/AADyAADmAADZAADMAAC/AA' +
    'CzAACmAACZAACMAACAAABzAABmAABZAABNAABAAAD/2tr/u7v/nJz/fX3/XV3/Pj7/Hx//AA' +
    'D8qFzum0/hjkLTgTXFcye3ZhqqWQ2cTAD8/Njv78rj47vW1q3Kyp69vZCxsYKkpHOYmGWLi1' +
    'Z/f0hycjpmZitZWR1NTQ5AQADQ/FzA7k+w4UKg0zWQxSeAtxpwqg1gnADY/Ni5/Lma/Jp7/H' +
    'td/F0+/D4f/B8A/AAA/wAA8gAB5gAB2QABzAABvwACswACpgACmQACjAADgAADcwADZgADWQ' +
    'AETQAEQADo///Z8vLJ5ua62dmqzMybv7+Ls7N8pqZsmZldjIxNgIA+c3MuZmYfWVkPTU0AQE' +
    'BcvPxPru5CoeE1k9MnhcUad7cNaqoAXJzdS1G8AAAAWklEQVRIie3ROwoAIAwDUI+eLdd2qN' +
    'QORamIiwn4qfCwaGM5jShGRERERETkR0KStGWcWw0bKYHPc8sTMtQtAm8dXocqJd56vHB9yz' +
    'WyfDFrPfzLllTyjJTTAWTI6aZHjs';
  return ['data:image/png;base64,' + image, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Sample image: bg/bg_01.png
 */
Blockly.JavaScript['general_sample_image_bg_01'] = function() {
  var image = 'data:image/png;base64,' +
    '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' +
    'sShH7UwAAAAASUVORK5CYII=';
  return [image, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Sample image: bg/bg_02.png
 */
Blockly.JavaScript['general_sample_image_bg_02'] = function() {
  var image = 'data:image/png;base64,' +
    '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'
  ;
  return [image, Blockly.JavaScript.ORDER_NONE];
};
