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
    return path.basename(p);
  }
}

function Config() {
  this._configDir = process.env.CONFIG_DIR || path.join(process.cwd(), 'config');

  if (!exists(this._configDir)) {
    throw new Error('The config dir does not exists.');
  }

  this._config = {};
  this._loadCommonConfig();
  this._loadEnvironments();
  this._loadExternalEnvironments();

  this._config.production = this._config.production || {};

  return new Settings(this._config, {
    env: process.env.NODE_ENV || 'production'
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
  else {
    throw new Error('Please check existence of application.js or application.json file in your config folder.');
  }

  this._config = {
      common: require(commonConfigFile)
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
