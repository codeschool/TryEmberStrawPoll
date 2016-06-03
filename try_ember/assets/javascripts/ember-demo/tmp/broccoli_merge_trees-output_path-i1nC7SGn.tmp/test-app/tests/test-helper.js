define('test-app/tests/test-helper', ['exports', 'test-app/tests/helpers/resolver', 'ember-qunit'], function (exports, _testAppTestsHelpersResolver, _emberQunit) {

  (0, _emberQunit.setResolver)(_testAppTestsHelpersResolver['default']);
});