const treeSelector = '#treeview-inner';

const controller = require('../controller');
const helper = require('../helper');

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
                // if (operation === 'create_node') return false;
                if (['rename_node', 'delete_node', 'move_node', 'copy_node', 'edit'].includes(operation) &&
                    node.data && node.data.isSlot) return false;
                if (node_parent.data && node_parent.data.type === 'slotter' && !(node.data && node.data.isSlot))
                    return false;
                if (node_parent.id === '#') return true;
                if (node_parent.data && (node_parent.data.type !== 'slotter' && !node_parent.data.isSlot))
                    return false;
                return true;
            }
        },
        plugins: [
            'dnd',
            'contextmenu'
        ]
    });

    window.setTimeout(function () {
        $(treeSelector).find('.jstree-anchor.jstree-clicked').click();
    }, 200);
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

    $(treeSelector).bind('move_node.jstree', function (e, data) {
        console.log('move_node', data);
        document.dispatchEvent(new CustomEvent(`preview-update`));
    });

    $(treeSelector).bind('delete_node.jstree', function (e, data) {
        console.log('delete_node', data);
        document.dispatchEvent(new CustomEvent(`preview-update`));
    });

    $(treeSelector).bind('rename_node.jstree', function (e, data) {
        console.log('rename_node', data);
        document.dispatchEvent(new CustomEvent(`preview-update`));
    });

    $(treeSelector).bind('create_node.jstree', function (e, data) {
        console.log('create_node', data);
        document.dispatchEvent(new CustomEvent(`preview-update`));
    });

    $(treeSelector).bind('select_node.jstree', function (e, data) {
        console.log('select_node', data);
        document.dispatchEvent(new CustomEvent(`treenode-select`, {
            detail: data.node.data
        }));
    });

    $(treeSelector).bind('copy_node.jstree', function (e, data) {
        helper.copyNodeData(data.old_instance, data.original, data.new_instance, data.node, true);
        console.log('copy_node', data);
        if (data.node.data.slots) {
            data.node.data.slots.forEach(slot => {
                data.instance.create_node(data.node, {
                    text: `[${slot.name}]`,
                    data: {
                        ['_id']: slot['_id'] || helper.genId(),
                        isSlot: true,
                        name: slot.name,
                        text: slot.text,
                        nodes: slot.nodes
                    }
                });
            });
        }
        document.dispatchEvent(new CustomEvent(`preview-update`));
        return true;
    });
};

const json = () => {
    return $(treeSelector).jstree('get_json');
};

const tree = () => {
    let roots = json();
    if (!(roots instanceof Array)) return Promise.reject('Not array for tree.');
    let trans = node => {
        let data = JSON.parse(JSON.stringify(node.data));
        node.children.forEach((child, i) => {
            data.slots[i].nodes = child.children.map(trans);
        });
        if (data.style && data.style.vars instanceof Object) {
            data.style.vars = helper.varsDecoder(data.style.vars);
        }
        return data;
    };
    return controller.html(roots.map(trans));
};

const html = async () => {
    try {
        let re = await tree();
        return re;
    } catch (e) {
        return {};
    }
};

module.exports = {
    init,
    json,
    html
};
