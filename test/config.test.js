/* globals beforeEach, describe, it */

'use strict';

var path = require('path');
var expect = require('chai').expect;
var Config = require('../lib/config');

describe('settings-config', function () {
  var config;

  beforeEach(function () {
    process.chdir(path.join(__dirname, 'fixtures/app'));
    delete process.env.NODE_ENV;
    delete process.env.CONFIG_DIR;
  });

  it('application.js', function () {
    process.chdir(path.join(__dirname, 'fixtures/application-js'));
    config = new Config();
    expect(config.value).to.equal('application-js');
  });

  it('application.json', function () {
    process.chdir(path.join(__dirname, 'fixtures/application-json'));
    config = new Config();
    expect(config.value).to.equal('application-json');
  });

  it('basic', function () {
    config = new Config();
    expect(config.value).to.equal('production');
    expect(config.foo).to.equal('bar');
  });

  it('external storage feature', function () {
    process.env.NODE_ENV = 'develop';
    config = new Config();
    expect(config.value).to.equal('develop');
    expect(config.foo).to.equal('bar');
  });

  it('using env.NODE_ENV', function () {
    process.env.NODE_ENV = 'test';
    config = new Config();
    expect(config.value).to.equal('test');
    expect(config.foo).to.equal('bar');
  });

  it('using env.CONFIG_DIR', function () {
    process.env.NODE_ENV = 'staging';
    process.env.CONFIG_DIR = path.join(__dirname, 'fixtures/app/config');
    config = new Config();
    expect(config.value).to.equal('staging');
    expect(config.foo).to.equal('bar');
  });

  it('using env.EXTERNAL_STORAGE', function () {
    process.env.NODE_ENV = 'develop';
    process.env.EXTERNAL_STORAGE = path.join(__dirname, 'fixtures/server.json');
    config = new Config();
    expect(config.value).to.equal('develop');
    expect(config.foo).to.equal('bar');
  });
});
