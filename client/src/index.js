require('./index.scss');

require('jquery');

const controller = require('./controller');

const { get, post } = require('./helper');

require('./view/init');

const header = require('./view/header');
const components = require('./view/components');
const fileassets = require('./view/fileassets');
const treeview = require('./view/treeview');
const setting = require('./view/setting');
const preview = require('./view/preview');
const editor = require('./view/editor');

const { d } = require('./util');

$(function () {
    header.init(d('#header'));
    components.init(d('#components-outer'));
    fileassets.init(d('#fileassets-outer'));
    treeview.init(d('#treeview'));
    setting.init(d('#setting'));
    preview.init(d('#preview'));
    editor.init(d('#editor'));
});
