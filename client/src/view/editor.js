let editor;
let container;

const init = function (el) {
    container = el;
    editor = ace.edit('editor-inner');
    // editor.setTheme('ace/theme/monokai');
};

const typeTrans = type => {
    const t = {
        'js': 'javascript',
        'css': 'css',
        'html': 'html'
    };
    return t[type] || 'javascript';
};

const edit = async function (text, type) {
    editor.getSession().setMode('ace/mode/' + typeTrans(type));
    editor.setValue(text || '');
    return new Promise(function (resolve, reject) {
        $(container).show().on('click', function handler(e) {
            if ($(e.target).is('.ctrl-save') || $(e.target).is('.ctrl-close')) {
                $(container).hide().off('click', handler);
                if ($(e.target).is('.ctrl-save')) resolve(editor.getValue());
                else reject('close');
                $(container).hide();
                return;
            }
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