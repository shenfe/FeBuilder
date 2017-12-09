const port = 3000;
const hostname = 'localhost';

const host = `//${hostname}:${port}`;

const apis = {
    test: '/hello',
    signin: '/user/signin',
    signout: '/user/signout',
    backup: '/proj/backup',
    assets: '/asset/list'
};

module.exports = {
    port,
    hostname,
    host,
    apis
};