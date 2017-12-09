const auth = require('../auth');

$('#op-exit').click(function (e) {
    auth.signOut().then(() => {
        window.location.reload();
    });
});
