require('./index.scss');

require('jquery');

require('jstree');

const interact = require('interactjs');

const auth = require('./auth');

const { get, post } = require('./helper');

(function onSignIn() {
    if (auth.signStatus()) {
        /* fetch user data */
        get('assets').then(data => console.log(data));
    } else {
        auth.signIn()
            .then(onSignIn)
            .catch(() => {
                window.location.reload();
            });
    }
})();

require('./view/index');

/* 面板尺寸控制 */
(function () {
    const resizableConf = {
        // resize from all edges and corners
        edges: { right: true },

        // keep the edges inside the parent
        restrictEdges: {
            outer: 'parent',
            endOnly: true
        },

        // minimum size
        restrictSize: {
            min: { width: 20 }
        },

        inertia: false
    };

    const panels = [
        'resource',
        'treeview',
        'setting',
        'preview'
    ];

    panels.slice(0, -1).forEach((p, i) => {
        interact(`#${p}`)
            .resizable(resizableConf)
            .on('resizemove', function (event) {
                let target = event.target;
                let next = $(`#${panels[i + 1]}`)[0];
                let tw = target.getBoundingClientRect().width;
                let nw = next.getBoundingClientRect().width;
                target.style.width = (tw + event.dx) + 'px';
                next.style.width = (nw - event.dx) + 'px';
            });
    });

    $(function () {
        panels.forEach(p => {
            $(`#${p}`).width($(`#${p}`).width());
        });
    });

    $(window).resize(function () {
        $(`#${panels.slice(-1)[0]}`).width($(window).width() - panels.slice(0, -1).map(p => $(`#${p}`).width()).reduce((prev, next) => prev + next));
    });
})();
