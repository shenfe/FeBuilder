let target;

const targetSelector = '#setting-inner';

const fromform = require('fromform').default;

const converter = varObj => {
    let re = {};
    for (let p in varObj) {
        if (!varObj.hasOwnProperty(p)) continue;
        re[p] = varObj[p].value;
    }
    debugger
    return re;
};

const init = function (el) {
    target = el;

    document.addEventListener(`treenode-select`, function (e) {
        // console.log('treenode-select event:', e.detail);
        $(targetSelector).empty();
        e.detail.style && $(targetSelector).append(fromform(converter(e.detail.style.vars)));
    });

    $(targetSelector).on('change', 'input', function () {
        document.dispatchEvent(new CustomEvent(`preview-update`));
    });
};

module.exports = {
    init
};