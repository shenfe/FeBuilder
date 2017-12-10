const API = require('./api');

const util = require('./util');

const consts = require('./const');

const { validation } = require('./const');

const get = (apiName, data = {}, options = {}) =>
    fetch(`${API.host}${API.apis[apiName]}?${util.querify(data)}`, util.cast({
        credentials: 'include'
    }, options))
        .then(res => res.json());

const post = (apiName, data = {}, options = {}) =>
    fetch(`${API.host}${API.apis[apiName]}`, util.cast({
        method: 'post',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }, options))
        .then(res => res.json());

const input = inputs => {
    let result = {};
    for (let i = 0, len = inputs.length; i < len; i++) {
        let { key, name, desc } = inputs[i];
        result[key] = prompt(`${name} (${desc})`);
        if (!validation[key](result[key])) {
            return Promise.reject(result);
        }
    }
    return Promise.resolve(result);
};

module.exports = {
    get,
    post,
    input
};