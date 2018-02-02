/**
 * boot.js is used to transcompile ES6 code
 * Like this we don't need a task runner to transcompile our javascript
 * The configuration of babel-core is done in package.json
 */

require('babel-core/register')
require('babel-polyfill')
require('./server')

module.exports = require('./app')
