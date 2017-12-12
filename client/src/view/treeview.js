const treeSelector = '#treeview-inner';

const controller = require('../controller');

let target;

const render = data => {
    $(treeSelector).jstree({
        core: {
            data,
            themes: {
                dots: false,
                icons: false
            },
            check_callback: function (operation, node, node_parent, node_position, more) {
                // `operation` can be 'create_node', 'rename_node', 'delete_node', 'move_node', 'copy_node' or 'edit'
                // in case of 'rename_node' node_position is filled with the new node name
                if (more && more.is_foreign) return false;
                return true;
            }
        },
        plugins: [
            'dnd',
            'contextmenu'
        ]
    });
};

const update = () => {
    if (controller.checkStatus()) {
        controller.open(true).then(data => {
            console.log('project', data);
            render(data.data.content);
        });
    }
};

const init = function (el) {
    target = el;

    update();

    $(treeSelector).bind('move_node.jstree copy_node.jstree', function (e, data) {
        console.log(data);
    });
};

const json = () => {
    return $(treeSelector).jstree('get_json');
};

module.exports = {
    init,
    json
};
