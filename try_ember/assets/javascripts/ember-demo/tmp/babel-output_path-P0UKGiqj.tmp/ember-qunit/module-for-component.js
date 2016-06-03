define('ember-qunit/module-for-component', ['exports', './qunit-module', 'ember-test-helpers'], function (exports, _qunitModule, _emberTestHelpers) {
  'use strict';

  exports['default'] = moduleForComponent;

  function moduleForComponent(name, description, callbacks) {
    _qunitModule.createModule(_emberTestHelpers.TestModuleForComponent, name, description, callbacks);
  }
});