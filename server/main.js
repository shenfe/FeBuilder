const fs = require('fs');
const path = require('path');
const util = require('./util');

const uiInterface = require('ui-interface');

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const cors = require('@koa/cors');
const router = new Router();

const multer = require('koa-multer');

const uploadDir = '../uploads';

const uploadStorage = multer.diskStorage({
    // 文件保存路径
    destination: function (req, file, cb) {
        let projname = util.parseCookies(req)[cookies.projid];
        let savePath;
        if (!projname) {
            savePath = path.resolve(__dirname, uploadDir);
        } else {
            savePath = path.resolve(__dirname, `${uploadDir}/${projname}`);
        }
        util.ensureDir(savePath);
        cb(null, savePath);
    },
    // 修改文件名称
    filename: function (req, file, cb) {
        let projname = util.parseCookies(req)[cookies.projid];
        let filename = file.originalname;
        while (fs.existsSync(path.resolve(__dirname, `${uploadDir}/${projname}/${filename}`))) {
            filename = util.newFileName(filename);
            // console.log(filename);
        }
        cb(null, filename);
    }
});
const upload = multer({ storage: uploadStorage });

const serve = require('koa-static');

const session = require('koa-session');

const md5 = require('md5');

const { validation, cookies } = require('../client/src/const');

const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
util.ensureDir(path.resolve(__dirname, '../db'));

const dbProjAuth = new PouchDB('db/proj_auth');
// const dbProjInfo = new PouchDB('db/proj_info');
// const dbProjData = new PouchDB('db/proj_data');

dbProjAuth.createIndex({
    index: {
        fields: ['name']
    }
});

const API = require('../client/src/api');

app.keys = ['some secret for febuilder server'];

/**
 * Set browser cookies in the context object
 */
const setClientCookie = (ctx, obj) => {
    for (let p in obj) {
        if (!obj.hasOwnProperty(p)) continue;
        ctx.cookies.set(cookies[p], obj[p], {
            httpOnly: false
        });
    }
};

/**
 * API: test
 */
router.post(API.apis.test, async function (ctx, next) {
    ctx.response.header['Access-Control-Allow-Origin'] = ctx.request.origin;
    ctx.response.header['Content-Type'] = 'application/json; charset=utf-8';
    console.log('response.header', ctx.response.header);
    let data = ctx.request.body;
    console.log('request body', data);
    ctx.status = 200;
    ctx.body = {
        hello: data.user
    };
    await next();
});

/**
 * API: upload
 */
router.post(API.apis.upload, upload.array('file[]'), async (ctx, next) => {
    /**
     * https://github.com/expressjs/multer/blob/master/doc/README-zh-cn.md
     */
    ctx.status = 200;
    ctx.body = {
        msg: 'success',
        data: ctx.req.files
    };
});

/**
 * API: open a project
 */
router.post(API.apis.open, async function (ctx, next) {
    ctx.response.header['Content-Type'] = 'application/json; charset=utf-8';
    let data = ctx.request.body;
    let projInCookie = ctx.cookies.get(cookies.projid);
    console.log('projInCookie', projInCookie);
    if ('projname' in data) {
        if (!validation.projname(data.projname) || !validation.password(data.password)) {
            ctx.status = 200;
            ctx.body = {
                msg: 'wrong',
                desc: 'Name or password of the project is invalid.'
            };
            return await next();
        }
    } else {
        data.projname = projInCookie;
    }
    let projname = data.projname;
    await dbProjAuth.find({
        selector: (data.projname !== projInCookie) ? {
            name: projname,
            password: data.password
        } : {
            name: projname
        }
    })
        .then(res => {
            // console.log(res);
            ctx.status = 200;
            if (res.docs.length) {
                setClientCookie(ctx, {
                    projid: projname,
                    token: md5(projname)
                });
                ctx.body = {
                    msg: 'success',
                    data: res.docs[0]
                };
            } else {
                ctx.body = {
                    msg: 'failure',
                    desc: 'Project name or password is wrong.'
                };
            }
        })
        .catch(err => {
            console.log(err);
            ctx.status = 500;
            ctx.body = {
                msg: 'error',
                desc: 'Fail to find the project.'
            };
        });
    await next();
});

/**
 * API: close the project
 */
router.get(API.apis.close, async function (ctx, next) {
    for (let p in cookies) {
        ctx.cookies.set(cookies[p], '', {
            httpOnly: false
        });
    }
    ctx.response.header['Content-Type'] = 'application/json; charset=utf-8';
    ctx.status = 200;
    ctx.body = {
        msg: 'success'
    };
    await next();
});

/**
 * API: create a project
 */
router.post(API.apis.create, async function (ctx, next) {
    ctx.response.header['Content-Type'] = 'application/json; charset=utf-8';
    let data = ctx.request.body;
    if (!validation.projname(data.projname) || !validation.password(data.password)) {
        ctx.status = 200;
        ctx.body = {
            msg: 'wrong',
            desc: 'Name or password of the project is invalid.'
        };
        return await next();
    }
    let projname = data.projname;
    await dbProjAuth.find({
        selector: {
            name: projname
        }
    })
        .then(res => {
            // console.log(res);
            if (res.docs.length) {
                ctx.status = 200;
                ctx.body = {
                    msg: 'failure',
                    desc: 'Project already exists.'
                };
            } else {
                return dbProjAuth.post({
                    name: projname,
                    password: data.password
                }).then(res => {
                    // console.log(res);
                    setClientCookie(ctx, {
                        projid: projname,
                        token: md5(projname)
                    });
                    ctx.status = 200;
                    ctx.body = {
                        msg: 'success',
                        desc: 'Create the project successfully.'
                    };
                }).catch(err => {
                    console.log(err);
                    ctx.status = 500;
                    ctx.body = {
                        msg: 'error',
                        desc: 'Fail to create the project.'
                    };
                });
            }
        })
        .catch(err => {
            console.log(err);
            ctx.status = 500;
            ctx.body = {
                msg: 'error',
                desc: 'Fail to create the project.'
            };
        });
    await next();
});

const fixInterfaceData = data => {
    let nodeArr = data.content;
    const objToArr = obj => {
        if (!('0' in obj)) return obj;
        let a = [];
        let i = 0;
        while (i in obj) {
            a.push(obj[i]);
            i++;
        }
        return a;
    };
    const traverse = (obj, path) => {
        for (let p in obj) {
            if (!obj.hasOwnProperty(p)) continue;
            if (!obj[p] || typeof obj[p] !== 'object') continue;
            if (p === '_options') {
                obj[p] = objToArr(obj[p]);
                continue;
            }
            traverse(obj[p], path.slice(0).concat(p));
        }
    };
    nodeArr.forEach(node => traverse(node, []));
};

/**
 * API: save the project
 */
router.post(API.apis.save, async function (ctx, next) {
    ctx.response.header['Content-Type'] = 'application/json; charset=utf-8';
    let data = ctx.request.body;
    // console.log('save project with data: ', data);

    let projname = ctx.cookies.get(cookies.projid);
    if (!projname) {
        ctx.status = 500;
        ctx.body = {
            msg: 'error',
            desc: 'Unknown project.'
        };
        return await next();
    }

    let doc;
    try {
        doc = await dbProjAuth.find({
            selector: {
                name: projname
            }
        }).then(res => {
            // console.log(res);
            if (res.docs.length) {
                return res.docs[0];
            } else {
                throw new Error('Project not found.');
            }
        }).catch(err => {
            console.log(err);
            ctx.status = 500;
            ctx.body = {
                msg: 'error',
                desc: 'Fail to find the project.'
            };
        });
    } catch (e) {
        return await next();
    }
    // console.log(doc);

    fixInterfaceData(data);

    await dbProjAuth.put(Object.assign(data, {
        name: projname,
        _id: doc._id,
        _rev: doc._rev,
    })).then(res => {
        // console.log(res);
        ctx.status = 200;
        ctx.body = {
            msg: 'success',
            desc: 'Save the project successfully.'
        };
    }).catch(err => {
        console.log(err);
        ctx.status = 500;
        ctx.body = {
            msg: 'error',
            desc: 'Fail to save the project.'
        };
    });

    await next();
});

const varsEncoder = function (varArr) {
    let re = {};
    varArr.forEach(v => {
        let obj = {};
        re[v.name] = {
            type: v.type,
            value: obj
        };
        // obj._type = (function (p) {
        //     return 'text';
        // })(v.name);
        // obj._value = v.value;
        Object.assign(obj, v.desc);
    });
    return re;
};

function getComponents() {
    return util.readDir(path.resolve(__dirname, '../base/component'), {
        data: function (dirPath) {
            let idata = uiInterface.parse(dirPath, {
                converter: varsEncoder
            });
            // console.log(dirPath, idata);
            if (idata && idata.slots && idata.slots.length) idata.type = 'slotter';
            return idata;
        }
    })
}

module.exports.getComponents = getComponents;

/**
 * API: components
 */
router.get(API.apis.components, async function (ctx, next) {
    ctx.response.header['Content-Type'] = 'application/json; charset=utf-8';
    ctx.status = 200;
    ctx.body = {
        data: getComponents(),
        msg: 'success'
    };
    await next();
});

/**
 * API: file assets
 */
router.get(API.apis.fileassets, async function (ctx, next) {
    ctx.response.header['Content-Type'] = 'application/json; charset=utf-8';
    
    let projname = ctx.cookies.get(cookies.projid);
    if (!projname) {
        ctx.status = 500;
        ctx.body = {
            msg: 'error',
            desc: 'Unknown project.'
        };
        return await next();
    }

    ctx.status = 200;
    let dirName = path.resolve(__dirname, `${uploadDir}/${projname}`);
    ctx.body = {
        data: util.readDir(dirName, {
            onlyDir: false,
            icon: filepath => {
                return API.apis.filethumb + '?file=' + encodeURIComponent(path.relative(dirName, filepath));
            }
        }),
        msg: 'success'
    };
    await next();
});

/**
 * API: preview presets
 */
router.get(API.apis.presetdevices, async function (ctx, next) {
    ctx.response.header['Content-Type'] = 'application/json; charset=utf-8';
    ctx.status = 200;
    ctx.body = {
        data: util.readDir(path.resolve(__dirname, `../base/device`), {
            onlyDir: false
        })
            .filter(v => /\.html$/.test(v))
            .reduce((pre, nex) => {
                pre[nex.replace(/\.html$/, '')] = util.readFile(path.resolve(__dirname, `../base/device/${nex}`));
                return pre;
            }, {}),
        msg: 'success'
    };
    await next();
});

const { thumbpath } = require('./helper');

/**
 * API: file thumb
 */
router.get(API.apis.filethumb, async function (ctx, next) {
    let { file } = ctx.request.query;
    let projname = ctx.cookies.get(cookies.projid);
    ctx.status = 200;
    ctx.type = util.contentType(file.split('.').pop());
    let thumbFilePath;
    if (ctx.type.startsWith('image/')) {
        thumbFilePath = await thumbpath(path.resolve(__dirname, `${uploadDir}/${projname}/${file}`));
    } else {
        thumbFilePath = path.resolve(__dirname, '../client/src/common/icon/file-unknown.png');
    }
    console.log('thumbFilePath', thumbFilePath);
    ctx.attachment(thumbFilePath);
    ctx.body = util.readData(thumbFilePath, true);
});

/**
 * API: tree to html
 */
router.post(API.apis.html, function (ctx, next) {
    let treedata = ctx.request.body;
    console.log('treedata', treedata);
    ctx.response.header['Content-Type'] = 'application/json; charset=utf-8';
    ctx.status = 200;
    ctx.body = {
        msg: 'success',
        data: uiInterface.stringify({
            html: '<slot>body</slot>',
            slots: [
                {
                    name: 'body',
                    nodes: treedata,
                    text: '<slot>body</slot>'
                }
            ]
        })
    };
});

app
    .use(session({
        key: 'febuilder:sess',
    }, app))
    .use(async (ctx, next) => {
        if (ctx.path === '/hello') {
            let n = ctx.session.views || 0;
            ctx.session.views = ++n;
        }
        await next();
    })
    .use(serve(path.resolve(process.cwd(), 'client/dist')))
    .use(cors({
        // origin: '*',
        credentials: true
    }))
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods())
;

app.listen(API.port, function () {
    require('open')(`http://${API.host}`);
});
