const { get, post } = require('../helper');

const controller = require('../controller');

let target;

const treeSettings = {
    core: {
        themes: {
            dots: false,
            icons: false
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
        $('#components').jstree(treeSettings);
    }
    $('#components').jstree(true).settings.core.data = data;
    $('#components').jstree(true).refresh();
};

const update = () => {
    if (controller.checkStatus()) {
        get('components').then(data => {
            console.log('components', data);
            render(data.data);
        });
    }
};

let initialized = false;

const init = function (el) {
    if (initialized) return;
    initialized = true;

    target = el;

    document.addEventListener(`components-update`, function () {
        update();
    });

    update();
};

module.exports = {
    init
};