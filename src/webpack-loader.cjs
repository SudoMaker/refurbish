// Stackblitz WebContainer requires this file to be cjs
// Its import sends the "file:///" URL directly to its SW and it doesn't know how to handle this thing
module.exports = require('./webpack-loader.js').default;
