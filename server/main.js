const fs = require('fs');
const path = require('path');
const util = require('./util');

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const cors = require('@koa/cors');
const router = new Router();

const serve = require('koa-static');

const session = require('koa-session');

const md5 = require('md5');

const { validation } = require('../client/src/const');

const PouchDB = require('pouchdb');

const dbProjAuth = new PouchDB('db/proj_auth');
const dbProjInfo = new PouchDB('db/proj_info');
const dbProjData = new PouchDB('db/proj_data');

dbProjAuth.createIndex({
    index: {
        fields: ['projname']
    }
});

const API = require('../client/src/api');

app.keys = ['some secret for febuilder server'];

const cookies = {
    'projid': 'febuilder:projid',
    'token': 'febuilder:token'
};

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
 * API: open a project
 */
router.post(API.apis.open, async function (ctx, next) {
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
        name: projname,
        password: data.password
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
                    msg: 'success'
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
            ctx.status = 200;
            ctx.body = {
                msg: 'error',
                desc: 'Fail to open the project. Maybe it doesn\'t exist.'
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
            name: projname
        })
        .then(res => {
            console.log(res);
            ctx.status = 500;
            ctx.body = {
                msg: 'failure',
                desc: 'Project already exists.'
            };
        })
        .catch(err => {
            console.log(err);
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
        });
    await next();
});

/**
 * API: assets
 */
router.get(API.apis.assets, async function (ctx, next) {
    ctx.response.header['Content-Type'] = 'application/json; charset=utf-8';
    ctx.status = 200;
    ctx.body = {
        data: util.readDir(path.resolve(__dirname, '../base/preset')),
        msg: 'success'
    };
    await next();
})

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
