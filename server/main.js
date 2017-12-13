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
            console.log(filename);
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
            console.log(res);
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
            console.log(res);
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
                    console.log(res);
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

/**
 * API: save the project
 */
router.post(API.apis.save, async function (ctx, next) {
    ctx.response.header['Content-Type'] = 'application/json; charset=utf-8';
    let data = ctx.request.body;
    console.log('save project with data: ', data);

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
            console.log(res);
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

    await dbProjAuth.put(Object.assign(data, {
        name: projname,
        _id: doc._id,
        _rev: doc._rev,
    })).then(res => {
        console.log(res);
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

/**
 * API: components
 */
router.get(API.apis.components, async function (ctx, next) {
    ctx.response.header['Content-Type'] = 'application/json; charset=utf-8';
    ctx.status = 200;
    ctx.body = {
        data: util.readDir(path.resolve(__dirname, '../base/preset'), {
            data: function (dirPath) {
                let idata = uiInterface.parse(dirPath, {
                    converter: function (varArr) {
                        let re = {};
                        varArr.forEach(v => {
                            let obj = {};
                            re[v.name] = obj;
                            obj._type = (function (p) {
                                // TODO
                                return 'text';
                            })(v.name);
                            obj._value = v.value;
                        });
                        return re;
                    }
                });
                console.log(dirPath, idata);
                return idata;
            }
        }),
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
    ctx.body = {
        data: util.readDir(path.resolve(__dirname, `${uploadDir}/${projname}`), {
            onlyDir: false
        }),
        msg: 'success'
    };
    await next();
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
