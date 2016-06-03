define('ember-qunit/module-for', ['exports', './qunit-module', 'ember-test-helpers'], function (exports, _qunitModule, _emberTestHelpers) {
  'use strict';

  exports['default'] = moduleFor;

  function moduleFor(name, description, callbacks) {
    _qunitModule.createModule(_emberTestHelpers.TestModule, name, description, callbacks);
  }
});