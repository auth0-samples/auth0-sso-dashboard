require('dotenv').load();
var gulp = require('gulp');
var del = require('del');
var gutil = require('gulp-util');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config');
var nodemon = require('nodemon');

gulp.task('app:clean', function(cb) {
  return del(['./build'], cb);
});

gulp.task('serve', function() {
  nodemon({
      script: 'bin/www',
      ext: 'js',
      ignore: ['gulpfile/*', 'build/*', 'app/*', 'gulpfile.js'],
      env: {
        'NODE_ENV': 'development'
      }
    })
    .on('restart', function() {
      console.log('restarted!');
    });
});

gulp.task('webpack:build', ['app:clean'], function(callback) {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig);
  myConfig.plugins = myConfig.plugins.concat(
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  );

  // run webpack
  webpack(myConfig, function(err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack:build', err);
    }
    gutil.log('[webpack:build]', stats.toString({
      colors: true
    }));
    callback();
  });
});

// modify some webpack config options
var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = 'sourcemap';
myDevConfig.debug = true;

// create a single instance of the compiler to allow caching
var devCompiler = webpack(myDevConfig);

gulp.task('webpack:build-dev', function(callback) {
  // run webpack
  devCompiler.run(function(err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack:build-dev', err);
    }
    gutil.log('[webpack:build-dev]', stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task('webpack:dev-server', function() {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig);
  myConfig.devtool = 'eval';
  myConfig.debug = true;
  myConfig.entry.app = ['webpack-dev-server/client?http://localhost:8080/', './Main.js'];

  // Start a webpack-dev-server
  new WebpackDevServer(webpack(myConfig), {
    contentBase: './app/html',
    publicPath: '/' + myConfig.output.publicPath,
    proxy: {
      '*': 'http://localhost:3000'
    },
    stats: {
      colors: true
    }
  }).listen(8080, 'localhost', function(err) {
    if (err) {
      throw new gutil.PluginError('webpack-dev-server', err);
    }
    gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html');
  });
});

gulp.task('html:build', ['app:clean', 'webpack:build'], function() {
  return gulp.src('./app/html/index.html')
    .pipe(gulp.dest('./build'));
});

gulp.task('default', ['data:publish', 'webpack:dev-server', 'serve']);
gulp.task('build', ['html:build', 'webpack:build']);
