const port = 3000;
const hostname = 'localhost';

const host = `//${hostname}:${port}`;

const apis = {
    test: '/hello',
    signin: '/user/signin',
    signup: '/user/signup',
    backup: '/proj/backup'
};

module.exports = {
    port,
    hostname,
    host,
    apis
};