require('./index.scss');

require('jquery');

require('jstree');

const auth = require('./auth');

const { post } = require('./helper');

(function onSignIn() {
    if (auth.signStatus()) {
        // fetch user data
    } else {
        auth.signIn()
            .then(onSignIn)
            .catch(() => {
                window.location.reload();
            });
    }
})();
