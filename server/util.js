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

module.exports = {
    readData
};