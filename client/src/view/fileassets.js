const { get, post } = require('../helper');

const controller = require('../controller');

let target;

const treeSettings = {
    core: {
        themes: {
            dots: false,
            icons: false
        }
    },
    checkbox: {
        keep_selected_style: false
    },
    plugins: [
        'dnd'
    ]
};

let treeInitialized = false;

const render = data => {
    if (!treeInitialized) {
        treeInitialized = true;
        $('#fileassets').jstree(treeSettings);
    }
    $('#fileassets').jstree(true).settings.core.data = data;
    $('#fileassets').jstree(true).refresh();
};

const update = () => {
    if (controller.checkStatus()) {
        get('fileassets').then(data => {
            console.log('fileassets', data);
            render(data.data);
        });
    }
};

let initialized = false;

const API = require('../api');

const uploader = require('dnd-upload');

const init = function (el) {
    if (initialized) return;
    initialized = true;

    target = el;

    document.addEventListener(`fileassets-update`, function () {
        update();
    });

    update();

    uploader($('#fileassets')[0], {
        apiUrl: API.apis.upload,
        data: {
            test: 'fileupload'
        },
        ondragover: () => { console.log('ondragover') },
        ondragend: () => { console.log('ondragend') },
        ondrop: () => { console.log('ondrop') },
        onprogress: (v) => { console.log('onprogress', v) },
        onread: () => { console.log('onread') }
    });
};

module.exports = {
    init
};