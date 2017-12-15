/* global test expect, describe */

// environment.js expects to find config/webpacker.yml and resolved modules from
// the root of a Rails project
const cwd = process.cwd();
const chdirApp = () => process.chdir('test/test_app')
const chdirCwd = () => process.chdir(cwd)
chdirApp();

const { resolve, join } = require('path')
const { sync } = require('glob')
const assert = require('assert')

const { ConfigList, ConfigObject } = require('../config_types')

const Environment = require('../environment')

describe('Environment', () => {
  afterAll(chdirCwd);

  let environment;

  describe('toWebpackConfig', () => {
    beforeEach(() => {
      environment = new Environment()
    })

    test('should return entry', () => {
      const config = environment.toWebpackConfig()
      expect(config.entry.application).toEqual(resolve('app', 'javascript', 'packs', 'application.js'))
    })

    test('should return output', () => {
      const config = environment.toWebpackConfig()
      expect(config.output.filename).toEqual('[name]-[chunkhash].js')
      expect(config.output.chunkFilename).toEqual('[name]-[chunkhash].chunk.js')
      expect(config.output.path).toEqual(resolve('public', 'packs-test'))
      expect(config.output.publicPath).toEqual('/packs-test/')
    })

    test('should return default loader rules for each file in config/loaders', () => {
      const config = environment.toWebpackConfig()
      const rules = Object.keys(require('../rules'))
      const [{ oneOf: configRules }] = config.module.rules;

      expect(rules.length).toBeGreaterThan(1)
      expect(configRules.length).toEqual(rules.length)
    })

    test('should return default plugins', () => {
      const config = environment.toWebpackConfig()
      expect(config.plugins.length).toEqual(4)
    })

    test('should return default resolveLoader', () => {
      const config = environment.toWebpackConfig()
      expect(config.resolveLoader.modules).toEqual(['node_modules'])
    })

    test('should return default resolve.modules with additions', () => {
      const config = environment.toWebpackConfig()
      expect(config.resolve.modules).toEqual([
        resolve('app', 'javascript'),
        'node_modules',
        'app/assets',
        '/etc/yarn',
      ])
    })

    test('returns plugins property as Array', () => {
      const config = environment.toWebpackConfig()

      expect(config.plugins).toBeInstanceOf(Array)
      expect(config.plugins).not.toBeInstanceOf(ConfigList)
    })
  })
})
