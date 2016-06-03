define('test-app/tests/app.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('app.js should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'app.js should pass jshint.\napp.js: line 16, col 27, Missing semicolon.\napp.js: line 19, col 48, Missing semicolon.\napp.js: line 20, col 20, Missing semicolon.\napp.js: line 21, col 2, Missing semicolon.\napp.js: line 3, col 8, \'loadInitializers\' is defined but never used.\n\n5 errors');
  });
});