# settings-config

A Node.js tool to load configuration depending on your environment


## Install

```
npm install settings-config

```


## Features

 * Supports `.js` and `.json` formats (`.js` has precedence on `.json`).
 * Supports external storage.


## Usage

```javascript
'use strict';
var config = require('settings-config')

console.log(config.foo.bar);

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

The `application.js` file is a root configuration. Additional environments are located in `environments` folder as a separate file with the same name.


### Using external storage

The external storage feature is useful when you use branch deploy for your application and don't want to keep too much confuguration in your `environments` folder. In this case you can create a simple JSON file with the following structure:
```json
{
  "master": {
    "db": 0
  },
  "develop": {
    "db": 1
  }
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
