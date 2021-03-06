const { get, post } = require('../helper');

const controller = require('../controller');

const treeSelector = '#fileassets';

let target;

const treeSettings = {
    core: {
        themes: {
            dots: false,
            icons: true
        },
        check_callback: function (operation, node, node_parent, node_position, more) {
            return operation === 'copy_node';
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
        $(treeSelector).jstree(treeSettings);
    }
    $(treeSelector).jstree(true).settings.core.data = data;
    $(treeSelector).jstree(true).refresh();
};

let lastUpdateTime;
const update = () => {
    if (lastUpdateTime) {
        if (Date.now() - lastUpdateTime < 100) return;
    }
    lastUpdateTime = Date.now();
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

    uploader($(treeSelector)[0], {
        apiUrl: API.apis.upload,
        data: {
            test: 'fileupload'
        },
        ondragover: function () { $(this).addClass('ondragover'); console.log('ondragover') },
        ondragend: function () { console.log('ondragend') },
        ondrop: function () { $(this).removeClass('ondragover'); console.log('ondrop') },
        onprogress: function (v) {
            if (v === 100) {
                window.setTimeout(function () {
                    update();
                }, 200);
            }
            console.log('onprogress', v);
        },
        onread: function () { console.log('onread') }
    });

    $(treeSelector).bind('select_node.jstree', function (e, data) {
        console.log('select_node', data);
        $('#fileasset-detail').html(`<div><img src="${data.node.icon}"></div>`);
    });
};

module.exports = {
    init
};