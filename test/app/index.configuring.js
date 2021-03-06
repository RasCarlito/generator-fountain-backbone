const test = require('ava');
const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
chai.use(spies);
const TestUtils = require('fountain-generator').TestUtils;

let context;

test.before(() => {
  context = TestUtils.mock('app');
  require('../../generators/app/index');
});

test.beforeEach(() => {
  context.mergeJson['package.json'] = {};
  context.mergeJson['.babelrc'] = {};
  context.config = {
    set: () => {}
  };
});

test('Call this.config.set twice', () => {
  context.config = {
    set: () => {}
  };
  const spy = chai.spy.on(context.config, 'set');
  TestUtils.call(context, 'configuring.config');
  expect(spy).to.have.been.called.twice();
  expect(spy).to.have.been.called.with('version');
  expect(spy).to.have.been.called.with('props');
});

test(`Add 'backbone' to package.json dependencies`, t => {
  context.props = {router: 'none'};
  TestUtils.call(context, 'configuring.pkg');
  t.is(context.mergeJson['package.json'].dependencies.jquery, '^2.2.4');
  t.is(context.mergeJson['package.json'].dependencies.underscore, '^1.8.3');
  t.is(context.mergeJson['package.json'].dependencies.backbone, '^1.3.3');
});

test(`Add 'es2015' to '.babelrc' when modules is 'webpack'`, t => {
  context.props = {js: 'babel', modules: 'webpack'};
  TestUtils.call(context, 'configuring.babel');
  t.deepEqual(context.mergeJson['.babelrc'].env.production.presets, ['es2015']);
});

test(`Add 'es2015' to '.babelrc' when modules is 'systemjs'`, t => {
  context.props = {js: 'babel', modules: 'systemjs'};
  TestUtils.call(context, 'configuring.babel');
  t.deepEqual(context.mergeJson['.babelrc'].presets, ['es2015']);
});
