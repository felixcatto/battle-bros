const gulp = require('gulp');
const babel = require('gulp-babel');
const del = require('del');
const { spawn } = require('child_process');
const WebSocket = require('ws');
const convert = require('koa-connect');
const proxy = require('http-proxy-middleware');
const serve = require('webpack-serve');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');


const serverJsPath = [
  '*/**/*.js',
  '!client/**',
  '!node_modules/**',
  '!dist/**',
  '!__tests__/**',
  '!public/**',
];

const bundler = webpack(webpackConfig);

let reloadDevServer = done => done();


const startDevServer = (done) => {
  const config = {
    config: {
      ...webpackConfig,
      serve: {
        port: 3000,
        devMiddleware: {
          logLevel: 'silent',
        },
        hotClient: {
          host: 'localhost',
          port: 8090,
          logLevel: 'error',
        },
        add: async (app, middleware) => {
          await middleware.webpack();
          middleware.content();
          app.use(convert(proxy('/', { target: 'http://localhost:4000' })));
        },
        on: {
          listening() {
            const socket = new WebSocket('ws://localhost:8090');
            reloadDevServer = (doneCb) => {
              socket.send(JSON.stringify({
                type: 'broadcast',
                data: {
                  type: 'window-reload',
                  data: {},
                },
              }));
              doneCb();
            };
          },
          'build-finished': () => reloadDevServer(() => {}),
        },
      },
    },
  };

  serve({}, config).then(() => done());
};


let node;
const startServer = (done) => {
  if (node) node.kill();
  node = spawn('node', ['dist/bin/server.js'], { stdio: 'inherit' });
  setTimeout(done, 200);
};
process.on('exit', () => node && node.kill());


const copyViews = () => gulp.src('main/index.html').pipe(gulp.dest('dist/main'));


const copyMisc = gulp.series(
  () => gulp.src('public/img/*').pipe(gulp.dest('dist/public/img')),
);


const bundleClientJs = done => bundler.run(done);


const transpileServerJs = () => gulp.src(serverJsPath)
  .pipe(babel())
  .pipe(gulp.dest('dist'));


const clean = () => del(['dist']);


const watch = () => {
  gulp.watch('main/index.html', gulp.series(copyViews, startServer, reloadDevServer));
};


const dev = gulp.series(
  clean,
  copyMisc,
  copyViews,
  transpileServerJs,
  startServer,
  startDevServer,
  watch,
);

const prod = gulp.series(
  clean,
  copyMisc,
  copyViews,
  bundleClientJs,
  transpileServerJs,
);

module.exports = { dev, prod };
