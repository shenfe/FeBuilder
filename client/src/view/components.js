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