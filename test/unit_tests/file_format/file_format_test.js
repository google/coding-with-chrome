/**
 * @fileoverview File format tests.
 *
 * @license Copyright 2017 The Coding with Chrome Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author mbordihn@google.com (Markus Bordihn)
 */
goog.require('cwc.fileFormat.File');


describe('File format', function() {
  let fileFormat = new cwc.fileFormat.File();
  let content1 = Math.random().toString(36);
  let content2 = Math.random().toString(36);
  let content3 = Math.random().toString(36);
  let version = Math.random();
  let legacyFormat = {
    'author': 'Markus Bordihn',
    'content': {
      'javascript': 'command.write("Hello World");',
    },
    'description': 'Legancy file format',
    'files': {
      'image.jpg': {
        'name': 'image.jpg',
        'type': 'image/jpeg',
        'size': 23,
        'content': 'Image data ...',
        'group': '',
        'version': 1,
        'filename': 'image.jpg',
      },
      'text.txt': {
        'name': 'text.txt',
        'type': 'text/plain',
        'size': 32,
        'content': 'Hello World',
        'group': '',
        'version': 1,
        'filename': 'text.txt',
      },
    },
    'flags': {
      '__editor__': {},
    },
    'format': 'Coding with Chrome File Format 1.0',
    'frameworks': {},
    'history': '',
    'type': 'basic',
    'mode': 'basic',
    'model': '',
    'title': 'Untitled Basic file',
    'ui': 'default',
    'version': '1.0',
  };
  let metadataKeyRandom = Math.random().toString(36);
  let metadataKey1 = Math.random().toString(36);
  let metadataValue1 = Math.random().toString(36);
  let metadataNamespace = Math.random().toString(36);
  let metadataKey2 = Math.random().toString(36);
  let metadataInnerKey = Math.random().toString(36);
  let metadataValue2 = {};
  metadataValue2[metadataInnerKey] = Math.random().toString(36);

  it('constructor', function() {
    expect(typeof fileFormat).toEqual('object');
  });

  it('getFileHeaderVersion', function() {
    expect(cwc.fileFormat.File.getFileHeaderVersion(legacyFormat['format']))
      .toEqual(1);
  });

  it('setAuthor', function() {
    expect(fileFormat.setAuthor('Markus Bordihn').getAuthor())
      .toEqual('Markus Bordihn');
  });

  it('getAuthor', function() {
    fileFormat.setAuthor('Markus Bordihn');
    expect(fileFormat.getAuthor()).toEqual('Markus Bordihn');
  });

  it('setContent', function() {
    expect(fileFormat.setContent('test1', 3).hasContent('test1')).toEqual(true);
    expect(fileFormat.setContent('test2', 2).hasContent('test2')).toEqual(true);
    expect(fileFormat.setContent('test3', 1).hasContent('test3')).toEqual(true);
  });

  it('hasContent', function() {
    fileFormat.setContent('test1', 1);
    fileFormat.setContent('test2', 2);
    fileFormat.setContent('test3', 3);
    expect(fileFormat.hasContent('test1')).toEqual(true);
    expect(fileFormat.hasContent('test2')).toEqual(true);
    expect(fileFormat.hasContent('test3')).toEqual(true);
    expect(fileFormat.hasContent('test1_no_exists')).toEqual(false);
    expect(fileFormat.hasContent('test2_no_exists')).toEqual(false);
    expect(fileFormat.hasContent('test3_no_exists')).toEqual(false);
  });

  it('getContent', function() {
    fileFormat.setContent('test1', content1);
    fileFormat.setContent('test2', content2);
    fileFormat.setContent('test3', content3);
    expect(fileFormat.getContent('test1')).toEqual(content1);
    expect(fileFormat.getContent('test2')).toEqual(content2);
    expect(fileFormat.getContent('test3')).toEqual(content3);
  });


  it('setDescription', function() {
    fileFormat.setDescription('This is a test!');
  });

  it('getDescription', function() {
    fileFormat.setDescription('This is a test!');
    expect(fileFormat.getDescription()).toEqual('This is a test!');
  });

  it('setTitle', function() {
    fileFormat.setTitle('This is a title!');
  });

  it('getTitle', function() {
    fileFormat.setTitle('This is a title!');
    expect(fileFormat.getTitle()).toEqual('This is a title!');
  });

  it('setVersion', function() {
    fileFormat.setVersion(version);
  });

  it('getVersion', function() {
    fileFormat.setVersion(version);
    expect(fileFormat.getVersion()).toEqual(version);
  });

  it('hasFiles', function() {
    expect(fileFormat.hasFiles()).toEqual(false);
  });

  it('getMetadata (unset, default namespace)', function() {
    expect(fileFormat.getMetadata(metadataKeyRandom)).toEqual('');
  });

  it('getMetadata (unset, non-default namespace)', function() {
    expect(fileFormat.getMetadata(metadataKeyRandom,
      metadataNamespace)).toEqual('');
  });

  it('setMetadata (default namespace, value)', function() {
    expect(() => {
      fileFormat.setMetadata(metadataKey1, metadataValue1);
    }).not.toThrow();
  });

  it('getMetadata (default namespace, set)', function() {
    fileFormat.setMetadata(metadataKey1, metadataValue1);
    expect(fileFormat.getMetadata(metadataKey1)).toEqual(metadataValue1);
  });

  it('setMetadata (non-default namespace)', function() {
    expect(() => {
      fileFormat.setMetadata(metadataKey2, metadataValue2, metadataNamespace);
    }).not.toThrow();
  });

  it('getMetadata (non-default namespace, wrong key)', function() {
    expect(fileFormat.getMetadata(metadataKey1,
      metadataNamespace)).toEqual('');
  });

  it('getMetadata (non-default namespace, correct key)', function() {
    fileFormat.setMetadata(metadataKey2, metadataValue2, metadataNamespace);
    expect(fileFormat.getMetadata(metadataKey2,
      metadataNamespace)).toEqual(metadataValue2);
  });

  it('getMetadata (default namespace, wrong key)', function() {
    expect(fileFormat.getMetadata(metadataKey2)).toEqual('');
  });

  let defaultLanguage = 'eng';
  it('tutorial (default language)', function() {
    let tutorial = {
      'content': 'Hello, world!',
    };
    expect(fileFormat.getTutorial()).toBe(null);
    expect(() => {
      fileFormat.setMetadata(defaultLanguage, tutorial, '__tutorial__');
    }).not.toThrow();
    expect(fileFormat.getTutorial()).toEqual(tutorial);
  });

  it('tutorial (non-default language)', function() {
    let otherLanguage = 'deu';
    let tutorialDefaultLanguage = {
      'content': 'Hello, world!',
    };
    let tutorialOtherLanguage = {
      'content': 'Hallo, Welt!',
    };
    expect(() => {
      fileFormat.setMetadata(defaultLanguage, tutorialDefaultLanguage, '__tutorial__');
    }).not.toThrow();
    expect(() => {
      fileFormat.setMetadata(otherLanguage, tutorialOtherLanguage, '__tutorial__');
    }).not.toThrow();
    expect(fileFormat.getTutorial(otherLanguage)).toEqual(tutorialOtherLanguage);
    expect(fileFormat.getTutorial(defaultLanguage)).toEqual(tutorialDefaultLanguage);
    expect(fileFormat.getTutorial()).toEqual(tutorialDefaultLanguage);
  });

  it('tour (default language)', function() {
    let tour = {
      'description': 'Test tour',
      'data': [{
        'title': 'Test',
        'text': 'Testing tour',
      }],
    };
    expect(fileFormat.getTour()).toBe(null);
    expect(() => {
      fileFormat.setMetadata(defaultLanguage, tour, '__tour__');
    }).not.toThrow();
    expect(fileFormat.getTour()).toEqual(tour);
  });

  it('tour (non-default language)', function() {
    let otherLanguage = 'swe';
    let tourDefaultLanguage = {
      'description': 'Test tour',
      'data': [{
        'title': 'Test',
        'text': 'Testing tour',
      }],
    };
    let tourOtherLanguage = {
      'description': 'Testa tur',
      'data': [{
        'title': 'Testa',
        'text': 'Testning tur',
      }],
    };

    expect(() => {
      fileFormat.setMetadata(defaultLanguage, tourDefaultLanguage, '__tour__');
    }).not.toThrow();
    expect(() => {
      fileFormat.setMetadata(otherLanguage, tourOtherLanguage, '__tour__');
    }).not.toThrow();
    expect(fileFormat.getTour(otherLanguage)).toEqual(tourOtherLanguage);
    expect(fileFormat.getTour(defaultLanguage)).toEqual(tourDefaultLanguage);
    expect(fileFormat.getTour()).toEqual(tourDefaultLanguage);
  });

  describe('Legacy format', function() {
    let file = new cwc.fileFormat.File();

    it('loadJSON', function() {
      file.loadJSON(legacyFormat);
      expect(file.getAuthor()).toEqual('Markus Bordihn');
      expect(file.hasFiles()).toEqual(true);
      expect(file.getContent('__javascript__')).toEqual(
        legacyFormat['content']['javascript']);
      expect(file.getFileContent('image.jpg')).toEqual(
        legacyFormat['files']['image.jpg']['content']);
      expect(file.getFileContent('text.txt')).toEqual(
        legacyFormat['files']['text.txt']['content']);
    });
  });
});
