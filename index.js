'use strict';

var Config = require('./lib/config');

exports = module.exports = function () {
  return new Config();
};
exports.Config = Config;
exports.getConfig = function (configDir, env) {
  return new Config(configDir, env);
};
