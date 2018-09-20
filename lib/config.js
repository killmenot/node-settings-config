'use strict';

const path = require('path');
const fs = require('fs');
const glob = require('glob');
const Settings = require('settings');

function exists() {
  const p = path.join.apply(path, arguments);

  try {
    fs.statSync(p);
    return true;
  } catch (err) {
    return false;
  }
}

function Config(configDir, env) {
  this._configDir = path.normalize(process.env.CONFIG_DIR || configDir || path.join(process.cwd(), 'config'));
  this._env = (env || process.env.NODE_ENV || 'production').toLowerCase().trim();

  this._configDir = path.isAbsolute(this._configDir) ?
    this._configDir :
    path.join(process.cwd(), this._configDir);

  if (!exists(this._configDir)) {
    throw new Error('The config dir does not exists.');
  }

  this._config = {};
  this._loadCommonConfig();
  this._loadEnvironments();
  this._loadExternalEnvironments();

  // create empty section to avoid errors
  this._config[this._env] = this._config[this._env] || {};

  return new Settings(this._config, {
    env: this._env
  });
}

Config.prototype._loadCommonConfig = function () {
  let commonConfigFile;

  if (exists(this._configDir, 'application.js')) {
    commonConfigFile = path.join(this._configDir, 'application.js');
  }
  else if (exists(this._configDir, 'application.json')) {
    commonConfigFile = path.join(this._configDir, 'application.json');
  }

  this._config = {
    common: commonConfigFile ? require(commonConfigFile) : {}
  };
};

Config.prototype._loadEnvironments = function () {
  if (exists(this._configDir, 'environments')) {
    glob.sync('!(common).+(js|json)', {
      cwd: path.join(this._configDir, 'environments')
    }).forEach((filename) => {
      const name = path.parse(filename).name;

      if (!this._config[name]) {
        this._config[name] = require(path.join(this._configDir, 'environments', filename));
      }
    });
  }  
};

Config.prototype._loadExternalEnvironments = function () {
  const extFile = process.env.EXTERNAL_STORAGE || path.join(process.cwd(), '..', 'server.json');

  if (exists(extFile)) {
    const extConfig = require(extFile);
    Object.keys(extConfig).forEach(prop => {
      if (!this._config[prop]) {
        this._config[prop] = extConfig[prop];
      }
    });
  }
};

module.exports = Config;
