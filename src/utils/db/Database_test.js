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
 * @author mbordihn@google.com (Markus Bordihn)
 *
 * @fileoverview Database tests.
 */
import { Database } from './Database';

beforeAll(() => {
  indexedDB.databases().then((dbs) =>
    dbs.forEach((db) => {
      if (db.name.startsWith('test')) {
        indexedDB.deleteDatabase(db.name);
      }
    })
  );
});

describe('Database', function () {
  it('constructor', function () {
    const db = new Database('test');
    expect(typeof db).toEqual('object');
  });

  it('.setObjectStoreName', function () {
    const db = new Database('test').setObjectStoreName('__test__');
    expect(db.getObjectStoreName()).toEqual('__test__');
  });

  it('.open', function (done) {
    const db = new Database('test_open');
    db.open().then((result) => {
      expect(typeof result).toEqual('object');
      done();
    });
  });

  it('.add', function (done) {
    const db = new Database('test_add');
    db.open().then(() => {
      db.add('test', 1234).then(() => {
        done();
      });
    });
  });

  it('.add (group)', function (done) {
    const db = new Database('test_add_group');
    db.open({
      objectStoreNames: ['__test__1__', '__test__2__', '__test__3__'],
    }).then(() => {
      db.add('test', 1234, '__test__2__').then(() => {
        done();
      });
    });
  });

  it('.add (group) failed', function (done) {
    const db = new Database('test_add_group_failed');
    db.open({
      objectStoreNames: ['__test__1__', '__test__2__', '__test__3__'],
    }).then(() => {
      db.add('test', 1234, '__test__4__').then(null, (error) => {
        console.error(error);
        done();
      });
    });
  });

  it('.put', function (done) {
    const db = new Database('test_put');
    db.open()
      .then(() => {
        db.put('test', 1234).then();
      })
      .then(() => {
        db.put('test', 4321).then();
      })
      .then(() => {
        db.put('test2', 1234).then(() => {
          done();
        });
      });
  });

  it('.get', function (done) {
    const db = new Database('test_get');
    const dbValue = Math.random();
    db.open().then(() => {
      db.add('test', dbValue).then(() => {
        db.get('test').then((value) => {
          expect(value).toEqual(dbValue);
          done();
        });
      });
    });
  });

  it('.get (not existing name)', function (done) {
    const db = new Database('test_get_failed');
    db.open().then(() => {
      db.get('test2')
        .then((value) => {
          expect(value).toEqual(undefined);
          done();
        })
        .catch((error) => {
          console.error(error);
        });
    });
  });

  it('.getAll', function (done) {
    const db = new Database('test_get_all');
    db.open()
      .then(() => db.add('test1', 1))
      .then(() => db.add('test2', 2))
      .then(() => db.add('test3', 3))
      .then(() => db.add('test4', 4))
      .then(() => db.add('test5', 5))
      .then(() => {
        db.getAll().then((value) => {
          expect(value).toEqual([1, 2, 3, 4, 5]);
          done();
        });
      })
      .catch((error) => {
        console.error(error);
      });
  });

  it('.getAllKeys', function (done) {
    const db = new Database('test_get_all_keys');
    db.open()
      .then(() => db.add('test1', 1))
      .then(() => db.add('test2', 2))
      .then(() => db.add('test3', 3))
      .then(() => db.add('test4', 4))
      .then(() => db.add('test5', 5))
      .then(() => {
        db.getAllKeys().then((value) => {
          expect(value).toEqual(['test1', 'test2', 'test3', 'test4', 'test5']);
          done();
        });
      })
      .catch((error) => {
        console.error(error);
      });
  });

  it('.getAllWithKeys', function (done) {
    const db = new Database('test_get_all_with_keys');
    const result = new Map([
      ['test1', 1],
      ['test2', 2],
      ['test3', 3],
    ]);
    db.open()
      .then(() => db.add('test1', 1))
      .then(() => db.add('test2', 2))
      .then(() => db.add('test3', 3))
      .then(() => {
        db.getAllWithKeys().then((value) => {
          expect(value).toEqual(result);
          done();
        });
      })
      .catch((error) => {
        console.error(error);
      });
  });

  it('.delete', function (done) {
    const db = new Database('test_delete');
    const result = new Map([
      ['test1', 1],
      ['test3', 3],
    ]);
    db.open()
      .then(() => db.add('test1', 1))
      .then(() => db.add('test2', 2))
      .then(() => db.add('test3', 3))
      .then(() => db.delete('test2'))
      .then(() => {
        db.getAllWithKeys().then((value) => {
          expect(value).toEqual(result);
          done();
        });
      })
      .catch((error) => {
        console.error(error);
      });
  });

  it('.clear', function (done) {
    const db = new Database('test_clear');
    db.open()
      .then(() => db.add('test1', 1))
      .then(() => db.add('test2', 2))
      .then(() => db.add('test3', 3))
      .then(() => db.clear())
      .then(() => {
        db.getAllKeys().then((value) => {
          expect(value).toEqual([]);
          done();
        });
      })
      .catch((error) => {
        console.error(error);
      });
  });

  it('.setVersion', function () {
    const db = new Database('test_open');
    db.setVersion(1);
    expect(db.version_).toEqual(1);
    db.setVersion('1.4');
    expect(db.version_).toEqual(1);
    db.setVersion('2.44444444444444');
    expect(db.version_).toEqual(2);
    db.setVersion('2a');
    expect(db.version_).toEqual(2);
  });

  it('.getVersion', function () {
    const db = new Database('test_open');
    db.setVersion(1);
    expect(db.getVersion()).toEqual(1);
    db.setVersion('1.4');
    expect(db.getVersion()).toEqual(1);
    db.setVersion('2.44444444444444');
    expect(db.getVersion()).toEqual(2);
  });
});
