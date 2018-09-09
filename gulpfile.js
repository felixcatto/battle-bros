const path = require('path');
const gulp = require('gulp');
const del = require('del');
const WebSocket = require('ws');
const serve = require('webpack-serve');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');


const bundler = webpack(webpackConfig);

let reloadDevServer = done => done();


const startDevServer = (done) => {
  const config = {
    config: {
      ...webpackConfig,
      serve: {
        content: path.resolve(__dirname, 'dist'),
        port: 3000,
        hotClient: {
          host: 'localhost',
          port: 8090,
          logLevel: 'error',
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



const copyLayout = () => gulp.src('src/index.html').pipe(gulp.dest('dist'));


const copyAssets = () => gulp.src('src/public/**/*').pipe(gulp.dest('dist/public'));


const bundleClientJs = done => bundler.run(done);


const clean = () => del(['dist']);


const watch = () => {
  gulp.watch('src/index.html', gulp.series(copyLayout, reloadDevServer));
};


const dev = gulp.series(
  clean,
  copyLayout,
  copyAssets,
  startDevServer,
  watch,
);


const prod = gulp.series(
  clean,
  copyLayout,
  copyAssets,
  bundleClientJs,
);


module.exports = { dev, prod };
