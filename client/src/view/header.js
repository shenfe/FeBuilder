const controller = require('../controller');

const editor = require('./editor');

const init = function (el) {
    const $el = $(el);
    $el.find('#op-close').click(function (e) {
        controller.close().then(() => {
            window.location.reload();
        });
    });

    $el.find('#op-open').click(function (e) {
        controller.open();
    });

    $el.find('#op-create').click(function (e) {
        controller.create();
    });
};

module.exports = {
    init
};