'use strict';

var path = require('path');
var fs = require('fs');
var glob = require('glob');
var Settings = require('settings');

function exists() {
  var p = path.join.apply(path, arguments);

  try {
    fs.statSync(p);
    return true;
  } catch (err) {
    return false;
  }
}

function parse(p) {
  //0.12+
  if (path.parse) {
    return path.parse(p).name;
  }

  //0.10
  if (path.basename) {
    return path.basename(p, path.extname(p));
  }
}

function Config(configDir, env) {
  this._configDir = path.normalize(process.env.CONFIG_DIR || configDir || path.join(process.cwd(), 'config'));
  this._env = (process.env.NODE_ENV || env || 'production').toLowerCase().trim();

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
  var commonConfigFile;

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
  var self = this;
  var name;

  if (exists(this._configDir, 'environments')) {
    glob.sync('!(common).+(js|json)', {
      cwd: path.join(this._configDir, 'environments')
    }).forEach(function (filename) {
      name = parse(filename);

      if (!self._config[name]) {
        self._config[name] = require(path.join(self._configDir, 'environments', filename));
      }
    });
  }  
};

Config.prototype._loadExternalEnvironments = function () {
  var extFile = process.env.EXTERNAL_STORAGE || path.join(process.cwd(), '..', 'server.json');
  var extConfig;
  var prop;

  if (exists(extFile)) {
    extConfig = require(extFile);

    for (prop in extConfig) {
      if (extConfig.hasOwnProperty(prop)) {
        if (!this._config[prop]) {
            this._config[prop] = extConfig[prop];
        }
      }
    }
  }
};

module.exports = Config;
