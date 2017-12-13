const fs = require('fs');
const path = require('path');

const readData = absFilePath => {
    let data;
    try {
        data = fs.existsSync(absFilePath) ?
            JSON.parse(read(absFilePath)) :
            {};
    } catch (e) {
        data = {};
    }
    return data;
};

const isEmpty = obj => {
    if (typeof obj === 'string') return obj === '';
    if (!obj) return true;
    if (obj instanceof Array) return obj.length === 0;
    return !!Object.keys(obj).length;
};

const readDir = (absDirPath, {
    onlyDir
} = {}) => {
    onlyDir = onlyDir === false ? false : true;
    try {
        if (!fs.lstatSync(absDirPath).isDirectory()) return null;
    } catch (e) {
        return null;
    }
    let folders = fs.readdirSync(absDirPath)
        .filter(file => onlyDir ? fs.lstatSync(path.resolve(absDirPath, file)).isDirectory() : true)
        .map(folder => path.basename(folder));
    let result = [];
    folders.forEach(f => {
        let rd = readDir(path.resolve(absDirPath, f));
        if (onlyDir && rd instanceof Array && !rd.length) rd = null;
        result.push(rd === null ? f : {
            text: f,
            children: rd
        });
    });
    return result;
}

const ensureDir = dir => {
    let dirs = dir.split('/');
    let p = [];
    while (true) {
        if (!dirs.length) break;
        p.push(dirs.shift());
        let d = p.join('/');
        if (fs.existsSync(d) && fs.statSync(d).isDirectory()) continue;
        fs.mkdirSync(d);
    }
};

const parseCookies = function (request) {
    let list = {},
        rc = request.headers.cookie;
    rc && rc.split(';').forEach(function (cookie) {
        let parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    return list;
};

const newFileName = filename => {
    if (typeof filename !== 'string') {
        throw new Error('Invalid file name.');
        return;
    }
    let parts = filename.split('.');
    let match = /\((\d+)\)$/.exec(parts[0]);
    if (match) {
        parts[0] = parts[0].substr(0, match.index) + match[0].replace(match[1], String(parseInt(match[1]) + 1));
        return parts.join('.');
    } else {
        return parts[0] + '(1).' + parts.slice(1).join('.');
    }
};

module.exports = {
    readData,
    readDir,
    ensureDir,
    parseCookies,
    newFileName
};