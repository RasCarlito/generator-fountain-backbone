const test = require('ava');
const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
chai.use(spies);
const TestUtils = require('fountain-generator').TestUtils;

let context;

test.before(() => {
  context = TestUtils.mock('app');
  context.composeWith = () => {};
  require('../../generators/app/index');
});

test(`Call this.composeWith twice and add no prefix when sample is different of 'todoMVC'`, () => {
  const spy = chai.spy.on(context, 'composeWith');
  context.props = {modules: 'modules', sample: 'techs'};
  TestUtils.call(context, 'composing', {modules: context.props.modules, sample: context.props.sample, router: 'router'});
  const options = {
    framework: context.props.framework,
    modules: context.props.modules,
    js: context.props.js,
    ci: context.props.ci,
    css: context.props.css,
    router: context.props.router,
    sample: context.props.sample,
    skipInstall: context.props.skipInstall,
    skipCache: context.props.skipCache
  };
  expect(spy).to.have.been.called.twice();
  expect(spy).to.have.been.called.with(`fountain-react:techs`, {options}, {local: require.resolve('../../generators/techs')});
  expect(spy).to.have.been.called.with(`fountain-gulp`, {options}, {local: require.resolve('generator-fountain-gulp/generators/app')});
});
