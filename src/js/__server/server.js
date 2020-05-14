const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const Router = require('koa-router');
const uuid = require('uuid');
const faker = require('faker');

const app = new Koa();
const router = new Router();

app.use(koaBody({
  urlencoded: true,
  multipart: true,
  json: true,
}));

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());

const unreadMessages = [];

function addNewIncomingMessage() {
  const randomEmail = faker.internet.email();
  const randomSubject = faker.lorem.words();
  const mail = {
    id: uuid.v4(), from: randomEmail, subject: randomSubject, body: 'Long message body here', received: +new Date(),
  };
  unreadMessages.push(mail);
}

addNewIncomingMessage();
setInterval(addNewIncomingMessage, 10000);

router.get('/messages/unread', async (ctx) => {
  ctx.response.body = JSON.stringify({ status: 'ok', timestamp: +new Date(), messages: unreadMessages });
});

app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    await next();
    return;
  }
  const headers = { 'Access-Control-Allow-Origin': '*' };
  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({ ...headers });
    try {
      await next();
      return;
    } catch (e) {
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }
  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });
    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Allow-Request-Headers'));
    }
    ctx.response.status = 204;
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

server.listen(port);
