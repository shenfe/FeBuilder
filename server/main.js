const fs = require('fs');
const path = require('path');

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

const dbUserAuth = new PouchDB('db/user_auth');
const dbUserInfo = new PouchDB('db/user_info');
const dbUserData = new PouchDB('db/user_data');

const API = require('../client/src/api');

app.keys = ['some secret for febuilder server'];

const cookies = {
    'userid': 'febuilder:userid',
    'token': 'febuilder:token'
};

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
 * API: sign-in
 */
router.post(API.apis.signin, async function (ctx, next) {
    ctx.response.header['Content-Type'] = 'application/json; charset=utf-8';
    let data = ctx.request.body;
    if (!validation.username(data.username) || !validation.password(data.password)) {
        ctx.status = 200;
        ctx.body = {
            msg: 'wrong'
        };
        return await next();
    }
    let username = data.username;
    await dbUserAuth.get(username)
        .then(({ password }) => {
            ctx.status = 200;
            if (password === data.password) {
                setClientCookie(ctx, {
                    userid: username,
                    token: md5(username)
                });
                ctx.body = {
                    msg: 'success'
                };
            } else {
                ctx.body = {
                    msg: 'failure'
                };
            }
        })
        .catch(err => {
            return dbUserAuth.post(data).then(res => {
                setClientCookie(ctx, {
                    userid: username,
                    token: md5(username)
                });
                ctx.status = 200;
                ctx.body = {
                    msg: 'success'
                };
            }).catch(err => {
                ctx.status = 500;
                ctx.body = {
                    msg: 'error'
                };
            });
        });
    await next();
});

/**
 * API: sign-out
 */
router.get(API.apis.signout, async function (ctx, next) {
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
