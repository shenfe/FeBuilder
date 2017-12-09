const auth = require('../auth');

module.exports = function init(el) {
    const $el = $(el);
    $el.find('#op-exit').click(function (e) {
        auth.signOut().then(() => {
            window.location.reload();
        });
    });
};