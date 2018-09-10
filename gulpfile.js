const path = require('path');
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


const serverJsPath = ['src/**/*.js', '!src/client/**'];
const bundler = webpack(webpackConfig);

let reloadDevServer = done => done();


const startDevServer = (done) => {
  const config = {
    config: {
      ...webpackConfig,
      serve: {
        port: 3000,
        hotClient: {
          host: 'localhost',
          port: 8090,
          logLevel: 'error',
        },
        add: async (app, middleware, options) => {
          await middleware.webpack();
          middleware.content();
          app.use(convert(proxy('/', { target: 'http://localhost:4000' })));
        },
        on: {
          listening(server) {
            const socket = new WebSocket('ws://localhost:8090');
            reloadDevServer = (done) => {
              socket.send(JSON.stringify({
                type: 'broadcast',
                data: {
                  type: 'window-reload',
                  data: {},
                },
              }));
              done();
            };
          },
          'build-finished': () => reloadDevServer(() => {}),
        },
      },
    },
  };

  serve({}, config).then(() => done());
}


let node;
const startServer = (done) => {
  if (node) node.kill();
  node = spawn('node', ['dist/bin/server.js'], { stdio: 'inherit' });
  setTimeout(done, 200);
};
process.on('exit', () => node && node.kill());


const copyLayout = () => gulp.src('src/server/index.html').pipe(gulp.dest('dist/server'));


const copyAssets = () => gulp.src('src/public/img/**/*').pipe(gulp.dest('dist/public/img'));


const bundleClientJs = done => bundler.run(done);


const transpileServerJs = () => gulp.src(serverJsPath)
  .pipe(babel())
  .pipe(gulp.dest('dist'));


const clean = () => del(['dist']);


const watch = () => {
  gulp.watch('src/server/index.html', gulp.series(copyLayout, startServer, reloadDevServer));
};


const dev = gulp.series(
  clean,
  copyLayout,
  copyAssets,
  transpileServerJs,
  startServer,
  startDevServer,
  watch,
);

const prod = gulp.series(
  clean,
  copyLayout,
  copyAssets,
  bundleClientJs,
  transpileServerJs,
);

module.exports = { dev, prod };
