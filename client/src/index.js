require('./index.scss');

require('jquery');

require('jstree');

const auth = require('./auth');

const { post } = require('./helper');

post('test', {
    user: 'world'
})
    .then(res => res.json())
    .then(data => {
        console.log(data);
    });