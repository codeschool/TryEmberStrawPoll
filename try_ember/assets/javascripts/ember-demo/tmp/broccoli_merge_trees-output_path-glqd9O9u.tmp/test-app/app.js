define('test-app/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'test-app/config/environment'], function (exports, _ember, _emberResolver, _emberLoadInitializers, _testAppConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _testAppConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _testAppConfigEnvironment['default'].podModulePrefix,
    Resolver: _emberResolver['default']
  });

  var oldCreate = App.create;

  App.create = function () {
    window.App = oldCreate.apply(this, arguments);
    return window.App;
  };

  // loadInitializers(App, config.modulePrefix);

  exports['default'] = App;
});