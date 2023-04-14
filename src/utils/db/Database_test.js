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

describe('Database', function () {
  it('constructor', function (done) {
    const db = new Database('test');
    expect(typeof db).toEqual('object');
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

  it('constructor (group)', function (done) {
    const db = new Database('test_group', 'group');
    expect(typeof db).toEqual('object');
    expect(db.getObjectStoreName()).toEqual('group');
    expect(db.getObjectStoreName()).not.toEqual('__data__');
    expect(typeof db).toEqual('object');
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

  it('constructor (group) auto-version', function (done) {
    // Pre-connection (to catch edge case)
    const db = new Database('test_group_auto_version');
    expect(typeof db).toEqual('object');
    expect(db.getObjectStoreName()).toEqual('__data__');
    const dbValue = Math.random();
    db.open().then(() => {
      db.add('test', dbValue).then(() => {
        db.get('test').then((value) => {
          expect(value).toEqual(dbValue);
          db.close();
        });
      });
    });

    // Real connection
    const dbReconnect = new Database('test_group_auto_version', 'group');
    expect(typeof dbReconnect).toEqual('object');
    expect(dbReconnect.getObjectStoreName()).toEqual('group');
    expect(db.getObjectStoreName()).toEqual('__data__');
    const dbValueReconnect = Math.random();
    dbReconnect.open().then(() => {
      dbReconnect.add('test', dbValueReconnect).then(() => {
        dbReconnect.get('test').then((value) => {
          expect(value).toEqual(dbValueReconnect);
          done();
        });
      });
    });
  });

  it('.setObjectStoreName', function () {
    const db = new Database('test').setObjectStoreName('__test__');
    expect(db.getObjectStoreName()).toEqual('__test__');
  });

  it('.execute (not existing group)', function (done) {
    const db = new Database('test_execute');
    db.open().then(() => {
      db.execute('test', '__test__').then(null, (error) => {
        expect(error);
        done();
      });
    });
  });

  it('.execute (not existing command)', function (done) {
    const db = new Database('test_execute_not_existing_command');
    db.open().then(() => {
      db.execute('test', '__data__').then(null, (error) => {
        expect(error);
        done();
      });
    });
  });

  it('.open', function (done) {
    const db = new Database('test_open');
    db.open().then((result) => {
      expect(typeof result).toEqual('object');
      done();
    });
  });

  it('.open (failed)', function (done) {
    window.TestIndexedDBDisabled = true;
    const db = new Database('test_open_fail');
    db.open().then(null, (error) => {
      expect(error);
      delete window.TestIndexedDBDisabled;
      done();
    });
  });

  it('.close', function () {
    const db = new Database('test_close');
    db.close();
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
        expect(error);
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
          expect(!error);
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
        expect(!error);
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
        expect(!error);
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
        expect(!error);
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
        expect(!error);
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
        expect(!error);
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

  it('.handleOnBlocked', function (done) {
    const db = new Database('test_handle_on_blocked');
    db.open().then(() => {
      db.handleOnBlocked().then(() => {
        done();
      });
    });
  });

  it('.handleOnSuccess', function (done) {
    const db = new Database('test_handle_on_success');
    db.open().then(() => {
      db.handleOnSuccess().then(null, (error) => {
        expect(error);
        done();
      });
    });
  });

  it('.handleOnSuccess (blocked)', function (done) {
    const db = new Database('test_handle_on_success_blocked', null, 1);
    const db2 = new Database('test_handle_on_success_blocked', null, 2);
    db2.open().then(() => {
      db2.handleOnSuccess().then(null, (error) => {
        expect(error);
        expect(db).not.toEqual(db2);
        done();
      });
    });
  });

  it('.handleOnError', function (done) {
    const db = new Database('test_handle_on_error');
    db.open().then(() => {
      db.handleOnError().then(() => {
        done();
      });
    });
  });
});
