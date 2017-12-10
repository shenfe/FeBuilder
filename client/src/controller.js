const jscookie = require('js-cookie');

const api = require('./api');

const { get, post, input } = require('./helper');

const cookies = {
    'token': 'febuilder:token'
};

const checkStatus = () => {
    let token = jscookie.get(cookies.token);
    let isValid = _ => (_ && _ !== '' && _ !== 'null');
    let result = isValid(token);
    if (result) {
        $('.show-as-auth').show();
    } else {
        $('.show-as-auth').hide();
    }
    console.log('check status: ', result);
    return result;
};

const closeProj = () => {
    let ask = confirm('would you?');
    if (!ask) return Promise.reject();
    return get('close')
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.log(err);
        });
};

const openProj = async () => {
    let { projname, password } = await input([
        { key: 'projname', name: '名称', desc: '[0-9a-zA-Z]{6,12}' },
        { key: 'password', name: '密码', desc: '[0-9a-zA-Z]{6,12}' }
    ]);
    return post('open', { projname, password })
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.log(err);
        });
};

const createProj = async () => {
    let { projname, password } = await input([
        { key: 'projname', name: '名称', desc: '[0-9a-zA-Z]{6,12}' },
        { key: 'password', name: '密码', desc: '[0-9a-zA-Z]{6,12}' }
    ]);
    return post('create', { projname, password })
        .then(data => {
            console.log(data);
            // window.location.reload();
        })
        .catch(err => {
            console.log(err);
        });
};

module.exports = {
    checkStatus,
    close: closeProj,
    open: openProj,
    create: createProj
};