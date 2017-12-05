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

const API = require('../client/src/api');

app.keys = ['some secret for febuilder server'];

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
