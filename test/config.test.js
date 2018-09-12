'use strict';

const path = require('path');
const expect = require('chai').expect;
const Config = require('../').Config;

describe('settings-config', () => {
  let config;

  beforeEach(() => {
    process.chdir(path.join(__dirname, 'fixtures/app'));
    delete process.env.NODE_ENV;
    delete process.env.CONFIG_DIR;
  });

  it('config dir does not exist', () => {
    expect(() => {
      config = new Config('/foo/bar/baz');
    }).throw(Error, 'The config dir does not exists.');
  });

  it('application.js', () => {
    process.chdir(path.join(__dirname, 'fixtures/application-js'));

    config = new Config();

    expect(config.value).to.equal('application-js');
  });

  it('application.json', () => {
    process.chdir(path.join(__dirname, 'fixtures/application-json'));

    config = new Config();

    expect(config.value).to.equal('application-json');
  });

  it('no application file', () => {
    process.chdir(path.join(__dirname, 'fixtures/no-application'));

    config = new Config();

    expect(config).to.be.an('object');
  });

  it('basic', () => {
    config = new Config();

    expect(config.value).to.equal('production');
    expect(config.foo).to.equal('bar');
  });

  it('external storage feature', () => {
    process.env.NODE_ENV = 'develop';

    config = new Config();

    expect(config.value).to.equal('develop');
    expect(config.foo).to.equal('bar');
  });

  it('external storage feature (external values do not override file system values)', () => {
    process.env.NODE_ENV = 'master';

    config = new Config();

    expect(config.value).to.equal('master');
  });

  it('using env.NODE_ENV', () => {
    process.env.NODE_ENV = 'test';

    config = new Config();

    expect(config.value).to.equal('test');
    expect(config.foo).to.equal('bar');
  });

  it('using env.CONFIG_DIR with absolute path', () => {
    process.env.NODE_ENV = 'staging';
    process.env.CONFIG_DIR = path.join(__dirname, 'fixtures/app/config');

    config = new Config();

    expect(config.value).to.equal('staging');
    expect(config.foo).to.equal('bar');
  });

  it('using env.CONFIG_DIR with relative path', () => {
    process.chdir(path.join(__dirname));

    process.env.NODE_ENV = 'staging';
    process.env.CONFIG_DIR = 'fixtures/app/config';

    config = new Config();

    expect(config.value).to.equal('staging');
    expect(config.foo).to.equal('bar');
  });

  it('using env.EXTERNAL_STORAGE', () => {
    process.env.NODE_ENV = 'develop';
    process.env.EXTERNAL_STORAGE = path.join(__dirname, 'fixtures/server.json');

    config = new Config();

    expect(config.value).to.equal('develop');
    expect(config.foo).to.equal('bar');
  });

  it('using env.NODE_ENV for non existing configuration', () => {
    process.env.NODE_ENV = 'foobar';

    config = new Config();

    expect(config.value).to.equal('production');
    expect(config.foo).to.equal('bar');
  });

  it('using consturctor parameters', () => {
    const configDir = path.join(__dirname, 'fixtures/app/config');
    const env = 'staging';

    config = new Config(configDir, env);

    expect(config.value).to.equal('staging');
    expect(config.foo).to.equal('bar');
  });
});
