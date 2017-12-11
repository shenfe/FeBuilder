require('../common/flex-panel');

const header = require('./header');
const resource = require('./resource');
const treeview = require('./treeview');
const setting = require('./setting');
const preview = require('./preview');
// const status = require('./status');
const editor = require('./editor');

const { d } = require('../util');

header.init(d('#header'));
resource.init(d('#resource'));
treeview.init(d('#treeview'));
setting.init(d('#setting'));
preview.init(d('#preview'));
// status.init(d('#status'));
editor.init(d('#editor'));

// window.setTimeout(async function () {
//     let data = await editor.edit('test');
//     console.log(data);
// }, 2000);
