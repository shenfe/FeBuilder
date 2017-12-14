const md5File = require('md5-file');

const util = require('./util');

const fs = require('fs');
const path = require('path');

const thumbpath = async filepath => {
    let filemd5 = md5File.sync(filepath);
    let filedir = path.dirname(filepath);
    let tpath = path.join(filedir, '.thumb', filemd5);
    if (!fs.existsSync(tpath)) {
        // TODO
        tpath = path.resolve(__dirname, '../uploads/123123/icon.png');
    }
    return tpath;
};

module.exports = {
    thumbpath
};