define('ember-qunit/module-for-model', ['exports', './qunit-module', 'ember-test-helpers'], function (exports, _qunitModule, _emberTestHelpers) {
  'use strict';

  exports['default'] = moduleForModel;

  function moduleForModel(name, description, callbacks) {
    _qunitModule.createModule(_emberTestHelpers.TestModuleForModel, name, description, callbacks);
  }
});