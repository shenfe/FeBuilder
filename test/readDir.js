const path = require('path');

const { readDir } = require('../server/util');

console.log(JSON.stringify(readDir(path.resolve(__dirname, '../base')), null, 4));