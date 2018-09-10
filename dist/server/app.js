"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _koa = _interopRequireDefault(require("koa"));

var _koaStatic = _interopRequireDefault(require("koa-static"));

var _koaRouter = _interopRequireDefault(require("koa-router"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = new _koa.default();
const router = new _koaRouter.default();

const template = _fs.default.readFileSync(_path.default.join(__dirname, 'index.html'), 'utf8');

app.use((0, _koaStatic.default)(_path.default.join(__dirname, '../public')));
router.get('/', ctx => {
  ctx.body = template;
});
app.use(router.routes()).use(router.allowedMethods());
var _default = app;
exports.default = _default;