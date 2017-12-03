const jscookie = require('js-cookie');

const cookies = {
    'userId': 'febuilder_userid',
    'token': 'febuilder_token'
};

const api = require('./api');

const signStatus = () => {
    let userId = jscookie.get(cookies.userId);
    let token = jscookie.get(cookies.token);
    let isValid = _ => (_ && _ !== '' && _ !== 'null');
    return isValid(userId) && isValid(token);
};

const signOut = () => {
    for (let k in cookies) {
        jscookie.remove(cookies[k]);
    }
};

const getToken = async (username) => {};

const signIn = async (username, password) => {};

const signUp = async (username, password) => {};

module.exports = {
    signStatus,
    signOut
};