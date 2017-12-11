const jscookie = require('js-cookie');

const api = require('./api');

const { get, post, input } = require('./helper');

const cookies = {
    'token': 'febuilder:token'
};

const vTreeview = require('./view/treeview');

const checkStatus = () => {
    let token = jscookie.get(cookies.token);
    let isValid = _ => (_ && _ !== '' && _ !== 'null');
    let result = isValid(token);
    if (result) {
        $('.show-as-auth').show();
    } else {
        $('.show-as-auth').hide();
    }
    console.log('check status: ', result);
    return result;
};

const closeProj = () => {
    let ask = confirm('要离开项目吗？上次保存后的修改将被舍弃。');
    if (!ask) return Promise.reject();
    return get('close')
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.log(err);
        });
};

const openProj = async (omitted) => {
    let projname, password;
    if (!omitted) {
        try {
            let inputs = await input([
                { key: 'projname', name: '名称', desc: '[0-9a-zA-Z]{6,12}' },
                { key: 'password', name: '密码', desc: '[0-9a-zA-Z]{6,12}' }
            ]);
            projname = inputs.projname;
            password = inputs.password;
        } catch (err) {
            alert('输入不符合要求');
            return;
        }
    }
    return post('open', omitted ? undefined : { projname, password })
        .then(data => {
            if (data.msg === 'success') {
                if (!omitted) window.location.reload();
                else {
                    return data;
                }
            } else {
                alert(`${data.msg}: ${data.desc}`);
            }
        })
        .catch(err => {
            console.log(err);
        });
};

const createProj = async () => {
    let projname, password;
    try {
        let inputs = await input([
            { key: 'projname', name: '名称', desc: '[0-9a-zA-Z]{6,12}' },
            { key: 'password', name: '密码', desc: '[0-9a-zA-Z]{6,12}' }
        ]);
        projname = inputs.projname;
        password = inputs.password;
    } catch (err) {
        alert('输入不符合要求');
        return;
    }
    return post('create', { projname, password })
        .then(data => {
            if (data.msg === 'success') {
                window.location.reload();
            } else {
                alert(`${data.msg}: ${data.desc}`);
            }
        })
        .catch(err => {
            console.log(err);
        });
};

const uploadFile = async (file, options) => {
    return post('upload', { file, options }, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
        .then(data => {
            if (data.msg === 'success') {
                window.location.reload();
            } else {
                alert(`${data.msg}: ${data.desc}`);
            }
        })
        .catch(err => {
            console.log(err);
        });
};

const saveProj = async () => {
    return post('save', {
        content: vTreeview.json()
    })
        .then(data => {
            if (data.msg === 'success') {
                console.log(data);
            } else {
                alert(`${data.msg}: ${data.desc}`);
            }
        })
        .catch(err => {
            console.log(err);
        });
};

module.exports = {
    checkStatus,
    close: closeProj,
    open: openProj,
    create: createProj,
    upload: uploadFile,
    save: saveProj
};