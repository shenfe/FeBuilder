const jscookie = require('js-cookie');

const api = require('./api');

const { get, post } = require('./helper');

const cookies = {
    'token': 'febuilder:token'
};

const signStatus = () => {
    let token = jscookie.get(cookies.token);
    let isValid = _ => (_ && _ !== '' && _ !== 'null');
    return isValid(token);
};

const signOut = () => {
    return get('signout')
        .then(res => res.json())
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.log(err);
        });
};

const { validation } = require('./const');

const signIn = async () => {
    let username = prompt('username ([0-9a-zA-Z]{6,12})');
    if (!validation.username(username)) return Promise.reject('invalid username');
    let password = prompt('password ([0-9a-zA-Z]{6,12})');
    if (!validation.password(password)) return Promise.reject('invalid password');
    return post('signin', {
        username,
        password
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.log(err);
        });
};

module.exports = {
    signStatus,
    signOut,
    signIn
};