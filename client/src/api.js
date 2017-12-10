const port = 3000;
const hostname = 'localhost';

const host = `//${hostname}:${port}`;

const apis = {
    test: '/hello',
    open: '/proj/open',
    close: '/proj/close',
    save: '/proj/save',
    create: '/proj/create',
    assets: '/asset/list'
};

module.exports = {
    port,
    hostname,
    host,
    apis
};