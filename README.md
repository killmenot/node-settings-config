# settings-config

A Node.js tool to load configuration depending on your environment

[![Build Status](https://travis-ci.org/killmenot/node-settings-config.svg?branch=master)](https://travis-ci.org/killmenot/node-settings-config) [![Coverage Status](https://coveralls.io/repos/github/killmenot/node-settings-config/badge.svg?branch=master)](https://coveralls.io/github/killmenot/node-settings-config?branch=master) [![Dependency Status](https://david-dm.org/killmenot/node-settings-config.svg)](https://david-dm.org/killmenot/node-settings-config) [![npm version](https://img.shields.io/npm/v/settings-config.svg)](https://www.npmjs.com/package/settings-config)


## Install

```
npm install settings-config --save

```


## Features

 * Supports `.js` and `.json` formats (`.js` has precedence on `.json`).
 * Supports external storage.


## Usage

```javascript
'use strict';

var config = require('settings-config')()
console.log(config.foo.bar);
```

Using `NODE_ENV`

```javascript
'use strict';

process.env.NODE_ENV = 'development'
var config = require('settings-config')()
console.log(config.foo.bar); # can be overridden from `config/environments/development.js`
```


## Examples

### Basic

An example of directory structure required by the tool.
```
app/
  config/
    environments/
      staging.js
      test.json
    application.js
  ...
```

The `application.js` file is a root configuration. Additional environments are located in `environments` folder as a separate file with the same name. You can also specify the location of `config` directory directly by using `process.env.CONFIG_DIR`

```
CONFIG_DIR=path/to/config main.js
```

### Using external storage

The external storage feature is useful when you use branch deploy for your application and don't want to keep too much confuguration in your `environments` folder. In this case you can create a simple JSON file with the following structure:
```json
{
  "master": {
    "db": 0
  },
  "develop": {
    "db": 1
  },
  "feature-login": {
    "db": 1
  }
}
```
And place this file in the directory that contains branches

```
www/
  master/
    config/
      application.js
  develop/
    config/
      application.js
  feature-login/
    config/
      application.js
  server.json
```

You can also specify the location of `external storage` file directly by using `process.env.EXTERNAL_STORAGE`


## 0.1.5 -> 0.2.0


```
// 0.1.5.
var config = require('settings-config');
```

```
// 0.2.0.
var config = require('settings-config')();
```


## Licence

    The MIT License (MIT) Alexey Kucherenko

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
