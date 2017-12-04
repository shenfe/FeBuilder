const path = require('path');

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const cors = require('@koa/cors');
const router = new Router();

const serve = require('koa-static');

const session = require('koa-session2');

router.post('/open', async function (ctx, next) {
    ctx.response.header['Access-Control-Allow-Origin'] = ctx.request.origin;
    ctx.response.header['Content-Type'] = 'application/json; charset=utf-8';
    console.log('response.header', ctx.response.header);
    let data = ctx.request.body;
    console.log('data', data);
    ctx.status = 200;
    ctx.body = ({
        hello: 'world'
    });
    await next();
});

app
    .use(serve(path.resolve(process.cwd(), 'client/dist')))
    .use(cors({
        // origin: '*',
        credentials: true
    }))
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods())
;

const port = 3000;
app.listen(port, function () {
    require('open')(`http://localhost:${port}`);
});
