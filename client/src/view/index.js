const header = require('./header');
const resource = require('./resource');
const treeview = require('./treeview');
const setting = require('./setting');
const preview = require('./preview');
const status = require('./status');

const { d } = require('../util');

header(d('#header'));
resource(d('#resource'));
treeview(d('#treeview'));
setting(d('#setting'));
preview(d('#preview'));
status(d('#status'));
