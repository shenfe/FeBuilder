const fs = require('fs');
const path = require('path');

const readFile = absFilePath => {
    if (!fs.existsSync(absFilePath)) return null;
    let re = null;
    try {
        re = fs.readFileSync(absFilePath, 'utf8');
    } catch (e) {
    }
    return re;
};

const readData = (absFilePath, raw) => {
    if (raw) {
        return fs.existsSync(absFilePath) ? fs.readFileSync(absFilePath) : null;
    }
    let data;
    try {
        data = fs.existsSync(absFilePath) ?
            JSON.parse(readFile(absFilePath)) :
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
    onlyDir,
    data,
    icon
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
        let rd = readDir(path.resolve(absDirPath, f), {
            onlyDir,
            data,
            icon
        });
        let isFileInsteadOfDir = rd === null;
        result.push((isFileInsteadOfDir && !icon) ? f : {
            text: f,
            children: rd,
            data: data ? data(path.resolve(absDirPath, f), f) : null,
            icon: (isFileInsteadOfDir && icon) ? icon(path.resolve(absDirPath, f), f) : null
        });
    });
    return result;
};

const ensureDir = dir => {
    let dirs = dir.split('/');
    let p = [];
    while (true) {
        if (!dirs.length) break;
        p.push(dirs.shift());
        let d = p.join('/');
        if (d === '') continue;
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

const contentType = fileformat => {
    switch (fileformat) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'gif':
        case 'png':
            return `image/${fileformat}`
        default:
            return 'text/html';
    }
}

module.exports = {
    readFile,
    readData,
    readDir,
    ensureDir,
    parseCookies,
    newFileName,
    contentType
};