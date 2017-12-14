let target;

const edit = require('./editor').edit;

const { get, post } = require('../helper');

const controller = require('../controller');

const __project = require('../model/project');

const targetSelector = '#preview-inner';

const vte = require('velocity-template-engine');

const update = async _ => {
    const iframeStyle = {};
    switch (curDevice) {
        case 'mobile':
            Object.assign(iframeStyle, {
                width: '375px',
                height: '667px',
                margin: '16px auto',
                border: '1px #ccc solid',
                'box-shadow': '0px 0px 15px #ddd'
            });
            break;
        default:
            break;
    }
    let { style, html } = await vTree.html();
    let iframe = document.createElement('iframe');
    iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(
        vte.render(presetDevices[curDevice], {
            style: __project.style + style,
            body: html
        })
    );
    $(iframe).css(iframeStyle);
    $(targetSelector).empty().append(iframe);
};

window.previewHtml = update;

const vTree = require('./treeview');

let presetDevices;
let curDevice;

const init = function (el) {
    target = el;

    if (controller.checkStatus()) {
        get('presetdevices').then(data => {
            console.log('presetdevices', data);
            presetDevices = data.data;
            $(el).find('#preset-device')
                .html(Object.keys(presetDevices).map(v => `<option value=${v}>${v}</option>`).join(''))
                .change(function () {
                    // let v = $(this).find('option:selected').text();
                    document.dispatchEvent(new CustomEvent(`preset-device-change`, {
                        detail: $(this).val()
                    }));
                })
                .val(Object.keys(presetDevices).pop())
                .change();
        }).catch(err => {
            console.error(err);
        });
    }

    document.addEventListener('preset-device-change', function (e) {
        curDevice = e.detail;
        update();
    });

    document.addEventListener('preview-update', function (e) {
        update();
    });

    $(el).find('.ctrl-preset').click(function () {
        edit(__project.style, 'css')
            .then(text => {
                __project.style = text;
                document.dispatchEvent(new CustomEvent(`preview-update`));
            })
            .catch(err => console.log(err));
    });
};

module.exports = {
    init,
    update
};