const gulp = require('gulp');
const del = require('del');
const webpack = require('webpack');
const babel = require('gulp-babel');
const EventEmitter = require('events');
const { spawn } = require('child_process');
const waitOn = require('wait-on');
const readline = require('readline');
const { makeServer, listen } = require('blunt-livereload');
const webpackConfig = require('./webpack.config.js');
const babelConfig = require('./babelconfig.js');

const { series, parallel } = gulp;

const paths = {
  public: {
    src: 'public/**/*',
    dest: 'dist/public',
  },
  serverJs: {
    src: ['*/**/*.js', '!public/**', '!node_modules/**', '!dist/**', '!client/**', '!__tests__/**'],
    dest: 'dist',
  },
  client: {
    components: 'client/**/*.js',
    css: 'client/css/*',
    dest: 'dist/client',
  },
};

let server;
let isWaitonListening = false;
const startServer = async () => {
  server = spawn('node', ['dist/bin/server.js'], { stdio: 'inherit' });

  if (!isWaitonListening) {
    isWaitonListening = true;
    await waitOn({
      resources: ['http-get://localhost:4000'],
      delay: 500,
      interval: 1000,
      validateStatus: status => status !== 503,
    });
    isWaitonListening = false;
  }
};

const restartServer = async () => {
  server.kill();
  await startServer();
};
process.on('exit', () => server && server.kill());

const webpackEmitter = new EventEmitter();
const compiler = webpack(webpackConfig);
const startWebpack = done => {
  compiler.hooks.done.tap('done', () => webpackEmitter.emit('webpackDone'));
  compiler.watch({}, done);
};
const bundleClient = done => compiler.run(done);
const waitBundleClient = async () =>
  new Promise(resolve => webpackEmitter.once('webpackDone', resolve));

const devServer = makeServer();
const startDevServer = async () => listen(devServer);
const reloadBrowser = async () => devServer.reloadBrowser();

const clean = async () => del(['dist']);

const copyPublic = () => gulp.src(paths.public.src).pipe(gulp.dest(paths.public.dest));
const copyPublicDev = () =>
  gulp
    .src(paths.public.src, { since: gulp.lastRun(copyPublicDev) })
    .pipe(gulp.symlink(paths.public.dest, { overwrite: false }));
const copyMisc = () => gulp.src('package.json').pipe(gulp.dest('dist'));

const transpileServerJs = () =>
  gulp
    .src(paths.serverJs.src, { since: gulp.lastRun(transpileServerJs) })
    .pipe(babel(babelConfig.server))
    .pipe(gulp.dest(paths.serverJs.dest));

const transpileCC = () =>
  gulp
    .src(paths.client.components, {
      since: gulp.lastRun(transpileCC),
    })
    .pipe(babel(babelConfig.server))
    .pipe(gulp.dest(paths.client.dest));

const trackChangesInDist = () => {
  const watcher = gulp.watch('dist/**/*');
  watcher
    .on('add', pathname => console.log(`File ${pathname} was added`))
    .on('change', pathname => console.log(`File ${pathname} was changed`))
    .on('unlink', pathname => console.log(`File ${pathname} was removed`));
};

const watchManualRestart = async () => {
  const terminal = readline.createInterface({ input: process.stdin });
  terminal.on('line', input => {
    if (input === 'rs') {
      series(parallel(transpileServerJs, transpileCC), restartServer)();
    }
  });
};

const watch = async () => {
  gulp.watch(paths.public.src, series(copyPublicDev, restartServer, reloadBrowser));
  gulp.watch(paths.serverJs.src, series(transpileServerJs, restartServer));
  gulp
    .watch(paths.client.components)
    .on('change', series(parallel(waitBundleClient, transpileCC), reloadBrowser));
  gulp.watch(paths.client.css).on('change', series(waitBundleClient, reloadBrowser));
  trackChangesInDist();
};

const dev = series(
  clean,
  copyMisc,
  watchManualRestart,
  copyPublicDev,
  transpileServerJs,
  transpileCC,
  startDevServer,
  startWebpack,
  startServer,
  watch
);

const build = series(
  clean,
  copyMisc,
  parallel(copyPublic, transpileServerJs, transpileCC, bundleClient)
);

module.exports = {
  dev,
  build,
};
