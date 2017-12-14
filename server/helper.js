const md5File = require('md5-file');

const util = require('./util');

const fs = require('fs');
const path = require('path');

const thumb = require('node-thumbnail').thumb;

const thumbpath = async filepath => {
    let filemd5 = md5File.sync(filepath);
    let filedir = path.dirname(filepath);
    console.log('thumb path:', filedir);
    let dir = path.resolve(filedir, '.thumb');
    util.ensureDir(dir);
    let tpath = path.resolve(dir, filemd5) + '.' + filepath.split('.').pop();
    if (!fs.existsSync(tpath)) {
        await thumb({
            suffix: '',
            source: filepath,
            basename: filemd5,
            destination: dir
        });
    }
    return tpath;
};

module.exports = {
    thumbpath
};