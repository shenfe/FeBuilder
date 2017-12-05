const API = require('./api');

const util = require('./util');

const get = (apiName, data = {}, options = {}) =>
    fetch(`${API.host}${API.apis[apiName]}?${util.querify(data)}`, util.cast({
        credentials: 'include'
    }, options));

const post = (apiName, data = {}, options = {}) =>
    fetch(`${API.host}${API.apis[apiName]}`, util.cast({
        method: 'post',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }, options));

module.exports = {
    get,
    post
};