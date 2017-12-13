let editor;
let container;

const init = function (el) {
    container = el;
    editor = ace.edit('editor-inner');
    // editor.setTheme('ace/theme/monokai');
};

const edit = async function (text, type) {
    editor.getSession().setMode('ace/mode/javascript');
    editor.setValue(text || '');
    return new Promise(function (resolve) {
        $(container).show().on('click', function handler(e) {
            if ($(e.target).is('#editor-inner') || $(e.target).parents('#editor-inner').length) return;
            $(container).hide().off('click', handler);
            resolve(editor.getValue());
        });
    });
};

module.exports = {
    init,
    edit
};

// window.setTimeout(async function () {
//     let data = await edit('test');
//     console.log(data);
// }, 2000);