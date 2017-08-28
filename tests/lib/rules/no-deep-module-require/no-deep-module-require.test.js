const { RuleTester } = require('eslint');
const rule = require('../../../../lib/rules/no-deep-module-require');
const path = require('path')

const config = {
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  }
};

const normalizePath = filePath => {
  return path.resolve(filePath)
}

const ruleOptions = [{ moduleFolderName: 'module' }];

const tester = new RuleTester(config);

const invalid = testConfig => {
  testConfig.errors = [{ message: 'Cannot request module thats too deep!' }];

  return testConfig;
};

const valid = (code, filename, options) => {
  return {
    code,
    filename,
    options
  };
};

tester.run('no-deep-module-require', rule, {
  valid: [
    {
      code: 'import foo from "./module/story"',
      filename: normalizePath('src/app'),
      options: ruleOptions
    },
    {
      code: 'import foo from "../../module/story"',
      filename: normalizePath('module/party/index.js'),
      options: ruleOptions
    },
    {
      code: 'const foo = require("../../module/story")',
      filename: normalizePath('module/party/index.js'),
      options: ruleOptions
    },
    {
      code: 'const foo = require("../../module/party/foo")',
      filename: normalizePath('module/party/index.js'),
      options: ruleOptions
    },
    {
      code: 'const foo = require("./reducer/test/test.js")',
      filename: normalizePath('module/party/index.js'),
      options: ruleOptions
    },
    {
      code: 'const foo = require("../../feature/party")',
      filename: normalizePath('feature/something/index.js'),
      options: [{ moduleFolderName: 'feature' }]
    },
    {
      code: 'const foo = require("module/this/is/long/but/fine")',
      filename: normalizePath('module/something'),
      options: ruleOptions
    },
    {
      code: 'const foo = require("./module")',
      filename: normalizePath('src'),
      options: ruleOptions
    },
    {
      code: 'const foo = require("./module/party/index.js")',
      filename: normalizePath('src'),
      options: ruleOptions
    },
    {
      code: 'const foo = require("./module/party/index")',
      filename: normalizePath('src'),
      options: ruleOptions
    }
  ],
  invalid: [
    invalid({
      code: 'const foo = require("../../module/story/foo")',
      filename: normalizePath('module/party/index.js'),
      options: ruleOptions
    }),
    invalid({
      code: 'const reducer = require("./module/story/foo")',
      filename: normalizePath('src/app'),
      options: ruleOptions
    }),
    invalid({
      code: 'const foo = require("../feature/party/reducer")',
      filename: normalizePath('feature/something/index.js'),
      options: [{ moduleFolderName: 'feature' }]
    }),
    invalid({
      code: 'const foo = require("../feature/party/inde")',
      filename: normalizePath('feature/something/index.js'),
      options: [{ moduleFolderName: 'feature' }]
    }),
    invalid({
      code: 'const foo = require("../party/foo")',
      filename: normalizePath('src/module/awesome/index.js'),
      options: ruleOptions
    })
  ]
});
