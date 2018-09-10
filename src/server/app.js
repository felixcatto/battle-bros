import Koa from 'koa';
import serve from 'koa-static';
import Router from 'koa-router';
import path from 'path';
import fs from 'fs';


const app = new Koa();
const router = new Router();
const template = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

app.use(serve(path.join(__dirname, '../public')));

router.get('/', (ctx) => {
  ctx.body = template;
});

app
  .use(router.routes())
  .use(router.allowedMethods());

export default app;
