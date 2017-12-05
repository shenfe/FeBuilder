const API = require('./api');

const util = require('./util');

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
    post
};