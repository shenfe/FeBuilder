let target;

const targetSelector = '#setting-inner';

const fromform = require('fromform').default;

const init = function (el) {
    target = el;

    document.addEventListener(`treenode-select`, function (e) {
        console.log('treenode-select event:', e.detail);
        $(targetSelector).empty();
        e.detail.style && $(targetSelector).append(fromform(e.detail.style.vars));
    });
};

module.exports = {
    init
};