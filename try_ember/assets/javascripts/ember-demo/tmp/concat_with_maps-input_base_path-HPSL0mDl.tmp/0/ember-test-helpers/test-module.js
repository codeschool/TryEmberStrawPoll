define('ember-test-helpers/test-module', ['exports', 'ember', './test-context', 'klassy', './test-resolver', './build-registry', './has-ember-version', './wait'], function (exports, _ember, _testContext, _klassy, _testResolver, _buildRegistry, _hasEmberVersion, _wait) {
  'use strict';

  exports['default'] = _klassy.Klass.extend({
    init: function init(subjectName, description, callbacks) {
      // Allow `description` to be omitted, in which case it should
      // default to `subjectName`
      if (!callbacks && typeof description === 'object') {
        callbacks = description;
        description = subjectName;
      }

      this.subjectName = subjectName;
      this.description = description || subjectName;
      this.name = description || subjectName;
      this.callbacks = callbacks || {};

      if (this.callbacks.integration && this.callbacks.needs) {
        throw new Error("cannot declare 'integration: true' and 'needs' in the same module");
      }

      if (this.callbacks.integration) {
        if (this.isComponentTestModule) {
          this.isLegacy = callbacks.integration === 'legacy';
          this.isIntegration = callbacks.integration !== 'legacy';
        } else {
          if (callbacks.integration === 'legacy') {
            throw new Error('`integration: \'legacy\'` is only valid for component tests.');
          }
          this.isIntegration = true;
        }

        delete callbacks.integration;
      }

      this.initSubject();
      this.initNeeds();
      this.initSetupSteps();
      this.initTeardownSteps();
    },

    initSubject: function initSubject() {
      this.callbacks.subject = this.callbacks.subject || this.defaultSubject;
    },

    initNeeds: function initNeeds() {
      this.needs = [this.subjectName];
      if (this.callbacks.needs) {
        this.needs = this.needs.concat(this.callbacks.needs);
        delete this.callbacks.needs;
      }
    },

    initSetupSteps: function initSetupSteps() {
      this.setupSteps = [];
      this.contextualizedSetupSteps = [];

      if (this.callbacks.beforeSetup) {
        this.setupSteps.push(this.callbacks.beforeSetup);
        delete this.callbacks.beforeSetup;
      }

      this.setupSteps.push(this.setupContainer);
      this.setupSteps.push(this.setupContext);
      this.setupSteps.push(this.setupTestElements);
      this.setupSteps.push(this.setupAJAXListeners);

      if (this.callbacks.setup) {
        this.contextualizedSetupSteps.push(this.callbacks.setup);
        delete this.callbacks.setup;
      }
    },

    initTeardownSteps: function initTeardownSteps() {
      this.teardownSteps = [];
      this.contextualizedTeardownSteps = [];

      if (this.callbacks.teardown) {
        this.contextualizedTeardownSteps.push(this.callbacks.teardown);
        delete this.callbacks.teardown;
      }

      this.teardownSteps.push(this.teardownSubject);
      this.teardownSteps.push(this.teardownContainer);
      this.teardownSteps.push(this.teardownContext);
      this.teardownSteps.push(this.teardownTestElements);
      this.teardownSteps.push(this.teardownAJAXListeners);

      if (this.callbacks.afterTeardown) {
        this.teardownSteps.push(this.callbacks.afterTeardown);
        delete this.callbacks.afterTeardown;
      }
    },

    setup: function setup() {
      var self = this;
      return self.invokeSteps(self.setupSteps).then(function () {
        self.contextualizeCallbacks();
        return self.invokeSteps(self.contextualizedSetupSteps, self.context);
      });
    },

    teardown: function teardown() {
      var self = this;
      return self.invokeSteps(self.contextualizedTeardownSteps, self.context).then(function () {
        return self.invokeSteps(self.teardownSteps);
      }).then(function () {
        self.cache = null;
        self.cachedCalls = null;
      });
    },

    invokeSteps: function invokeSteps(steps, _context) {
      var context = _context;
      if (!context) {
        context = this;
      }
      steps = steps.slice();
      function nextStep() {
        var step = steps.shift();
        if (step) {
          // guard against exceptions, for example missing components referenced from needs.
          return new _ember['default'].RSVP.Promise(function (ok) {
            ok(step.call(context));
          }).then(nextStep);
        } else {
          return _ember['default'].RSVP.resolve();
        }
      }
      return nextStep();
    },

    setupContainer: function setupContainer() {
      if (this.isIntegration || this.isLegacy) {
        this._setupIntegratedContainer();
      } else {
        this._setupIsolatedContainer();
      }
    },

    setupContext: function setupContext() {
      var subjectName = this.subjectName;
      var container = this.container;

      var factory = function factory() {
        return container.lookupFactory(subjectName);
      };

      _testContext.setContext({
        container: this.container,
        registry: this.registry,
        factory: factory,
        dispatcher: null,
        register: function register() {
          var target = this.registry || this.container;
          return target.register.apply(target, arguments);
        },
        inject: {}
      });

      var context = this.context = _testContext.getContext();

      if (_ember['default'].setOwner) {
        _ember['default'].setOwner(context, this.container.owner);
      }

      if (_ember['default'].inject) {
        var keys = (Object.keys || _ember['default'].keys)(_ember['default'].inject);
        keys.forEach(function (typeName) {
          context.inject[typeName] = function (name, opts) {
            var alias = opts && opts.as || name;
            _ember['default'].set(context, alias, context.container.lookup(typeName + ':' + name));
          };
        });
      }
    },

    setupTestElements: function setupTestElements() {
      if (_ember['default'].$('#ember-testing').length === 0) {
        _ember['default'].$('<div id="ember-testing"/>').appendTo(document.body);
      }
    },

    setupAJAXListeners: function setupAJAXListeners() {
      _wait._setupAJAXHooks();
    },

    teardownSubject: function teardownSubject() {
      var subject = this.cache.subject;

      if (subject) {
        _ember['default'].run(function () {
          _ember['default'].tryInvoke(subject, 'destroy');
        });
      }
    },

    teardownContainer: function teardownContainer() {
      var container = this.container;
      _ember['default'].run(function () {
        container.destroy();
      });
    },

    teardownContext: function teardownContext() {
      var context = this.context;
      this.context = undefined;
      _testContext.unsetContext();

      if (context.dispatcher && !context.dispatcher.isDestroyed) {
        _ember['default'].run(function () {
          context.dispatcher.destroy();
        });
      }
    },

    teardownTestElements: function teardownTestElements() {
      _ember['default'].$('#ember-testing').empty();

      // Ember 2.0.0 removed Ember.View as public API, so only do this when
      // Ember.View is present
      if (_ember['default'].View && _ember['default'].View.views) {
        _ember['default'].View.views = {};
      }
    },

    teardownAJAXListeners: function teardownAJAXListeners() {
      _wait._teardownAJAXHooks();
    },

    defaultSubject: function defaultSubject(options, factory) {
      return factory.create(options);
    },

    // allow arbitrary named factories, like rspec let
    contextualizeCallbacks: function contextualizeCallbacks() {
      var callbacks = this.callbacks;
      var context = this.context;

      this.cache = this.cache || {};
      this.cachedCalls = this.cachedCalls || {};

      var keys = (Object.keys || _ember['default'].keys)(callbacks);

      for (var i = 0, l = keys.length; i < l; i++) {
        this._contextualizeCallback(context, keys[i]);
      }
    },

    _contextualizeCallback: function _contextualizeCallback(context, key) {
      var _this = this;
      var callbacks = this.callbacks;
      var factory = context.factory;

      context[key] = function (options) {
        if (_this.cachedCalls[key]) {
          return _this.cache[key];
        }

        var result = callbacks[key].call(_this, options, factory());

        _this.cache[key] = result;
        _this.cachedCalls[key] = true;

        return result;
      };
    },

    _setupContainer: function _setupContainer(isolated) {
      var resolver = _testResolver.getResolver();

      var items = _buildRegistry['default'](!isolated ? resolver : Object.create(resolver, {
        resolve: {
          value: function value() {}
        }
      }));

      this.container = items.container;
      this.registry = items.registry;

      if (_hasEmberVersion['default'](1, 13)) {
        var thingToRegisterWith = this.registry || this.container;
        var router = resolver.resolve('router:main');
        router = router || _ember['default'].Router.extend();
        thingToRegisterWith.register('router:main', router);
      }
    },

    _setupIsolatedContainer: function _setupIsolatedContainer() {
      var resolver = _testResolver.getResolver();
      this._setupContainer(true);

      var thingToRegisterWith = this.registry || this.container;

      for (var i = this.needs.length; i > 0; i--) {
        var fullName = this.needs[i - 1];
        var normalizedFullName = resolver.normalize(fullName);
        thingToRegisterWith.register(fullName, resolver.resolve(normalizedFullName));
      }

      if (!this.registry) {
        this.container.resolver = function () {};
      }
    },

    _setupIntegratedContainer: function _setupIntegratedContainer() {
      this._setupContainer();
    }

  });
});