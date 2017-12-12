const controller = require('../controller');

let target;

const init = function (el) {
    target = el;

    let $el = $(el);
    $el.find('#op-close').click(function (e) {
        controller.close()
            .then(() => {
                window.location.reload();
            })
            .catch(() => {});
    });

    $el.find('#op-open').click(function (e) {
        controller.open();
    });

    $el.find('#op-create').click(function (e) {
        controller.create();
    });

    $el.find('#op-save').click(function (e) {
        controller.save();
    });
};

module.exports = {
    init
};