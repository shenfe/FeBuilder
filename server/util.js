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
    if (!fs.lstatSync(absDirPath).isDirectory()) return null;
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

module.exports = {
    readData,
    readDir
};