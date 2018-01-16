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

const copyNodeData = (fromtree, from, totree, to, recurse) => {
    to.data = $.extend(true, {}, from.data);
    to.data['_id'] = '' + Date.now() + '_' + (Math.ceil(Math.random() * 10000)); // realloc id
    if (from && from.children_d && recurse) {
        for (let i = 0, j = from.children_d.length; i < j; i++) {
            copyNodeData(fromtree, fromtree.get_node(from.children_d[i]), totree, totree.get_node(to.children_d[i]), recurse);
        }
    }
};

const varsDecoder = function (varObj) {
    let re = [];
    for (let p in varObj) {
        if (!varObj.hasOwnProperty(p)) continue;
        re.push({
            name: p,
            type: varObj[p].type,
            desc: varObj[p].value
        });
    }
    return re;
};

module.exports = {
    get,
    post,
    input,
    copyNodeData,
    varsDecoder
};