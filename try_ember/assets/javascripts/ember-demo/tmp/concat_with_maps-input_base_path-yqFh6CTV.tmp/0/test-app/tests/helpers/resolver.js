define('test-app/tests/helpers/resolver', ['exports', 'ember/resolver', 'test-app/config/environment'], function (exports, _emberResolver, _testAppConfigEnvironment) {

  var resolver = _emberResolver['default'].create();

  resolver.namespace = {
    modulePrefix: _testAppConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _testAppConfigEnvironment['default'].podModulePrefix
  };

  exports['default'] = resolver;
});