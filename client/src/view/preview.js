let target;

const edit = require('./editor').edit;

const __project = require('../model/project');

const targetSelector = '#preview-inner';

const update = html => {
    let iframe = document.createElement('iframe');
    html = `<body>${html}</body>`;
    iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(html);
    $(targetSelector).empty().append(iframe);
};

window.previewHtml = update;

const init = function (el) {
    target = el;

    $(el).find('.ctrl-preset').click(async function () {
        __project.style = await edit(__project.style);
    });

    update('ready');
};

module.exports = {
    init,
    update
};