const { get, post } = require('../helper');

const controller = require('../controller');

let target;

const treeSelector = '#components';

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
        $(treeSelector).jstree(treeSettings);
    }
    $(treeSelector).jstree(true).settings.core.data = data;
    $(treeSelector).jstree(true).refresh();
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

    $(treeSelector).bind('select_node.jstree', function (e, data) {
        console.log(data);
    });

    update();
};

module.exports = {
    init
};