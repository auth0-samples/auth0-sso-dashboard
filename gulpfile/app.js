var del = require('del');
var gutil = require('gulp-util');
var cloudfront = require('gulp-cloudfront');
var RevAll = require('gulp-rev-all');
var awspublish = require('gulp-awspublish');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('../webpack.config');


var aws = {
  key: process.env.AWS_ACCESS_KEY_ID,
  secret: process.env.AWS_SECRET_ACCESS_KEY,
  bucket: process.env.AWS_S3_BUCKET,
  region: process.env.AWS_REGION,
  distributionId: process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID
};

module.exports = function(gulp) {

  gulp.task('app:clean', function(cb) {
    return del(['./dist/app'], cb);
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

    // Start a webpack-dev-server
    new WebpackDevServer(webpack(myConfig), {
      contentBase: './app/html',
      publicPath: '/' + myConfig.output.publicPath,
      stats: {
        colors: true
      }
    }).listen(3000, 'localhost', function(err) {
      if (err) {
        throw new gutil.PluginError('webpack-dev-server', err);
      }
      gutil.log('[webpack-dev-server]', 'http://localhost:3000/webpack-dev-server/index.html');
    });
  });

  gulp.task('html:build', ['app:clean', 'webpack:build'], function() {
    return gulp.src('./app/html/index.html')
      .pipe(gulp.dest('./dist/app'));
  });

  gulp.task('app:build', ['html:build', 'webpack:build']);

  gulp.task('app:watch', ['webpack:dev-server']);

  gulp.task('app:publish', ['app:build'], function() {
    var publisher = awspublish.create(aws);

    // define custom headers
    var headers = {
      'Cache-Control': 'max-age=315360000, no-transform, public'
    };

    var revAll = new RevAll({
      dontRenameFile: ['\.woff', '\.woff2', '\.svg', '\.ttf', '\.eot']
    });

    return gulp.src('./dist/app/**/*.*')
      .pipe(revAll.revision())
      .pipe(awspublish.gzip())
      .pipe(publisher.publish(headers))
      .pipe(publisher.cache())
      .pipe(awspublish.reporter())
      .pipe(cloudfront(aws));
  });

};
