require('dotenv').load();
var gulp = require('gulp');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var less = require('gulp-less');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var del = require('del');
var path = require('path');
var pkg = require('./package');
var handlebars = require('gulp-compile-handlebars');
var serve = require('gulp-serve');
var babel = require("gulp-babel");
var through = require('through2');
var Stream = require('stream');
var s3 = require('gulp-s3-upload')({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

var PROD = process.env.NODE_ENV === 'production';

gulp.task('serve', serve(['app', 'build/app']));

gulp.task('clean', function(cb) {
  del(['build/app'], cb);
});

gulp.task('rules-clean', function(cb) {
  del(['build/rules'], cb);
});

gulp.task('webtasks-clean', function(cb) {
  del(['build/tasks'], cb);
});

gulp.task('css', function () {
  return gulp.src('app/styles/main.less')
    .pipe(less())
    .pipe(rename(function(path) {
      path.basename = "bundle"
    }))
    .pipe(gulp.dest('build/app'));
});

gulp.task('css-watch', ['css'], function() {
  var watcher = gulp.watch('app/styles/*.*', ['css']);
  watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
});

gulp.task('css-minify', ['css'], function() {
  return gulp.src('./build/app/bundle.css')
    .pipe(minifyCSS())
    .pipe(rename(function(path) {
      path.extname = '.min.css';
    }))
    .pipe(gulp.dest('build/app'))
});

function scripts(watch) {
  var bundler, rebundle;
  bundler = browserify('./app/lib/app.js', {
    basedir: __dirname,
    debug: !PROD,
    cache: {}, // required for watchify
    packageCache: {}, // required for watchify
    fullPaths: watch // required to be true only for watchify
  });
  if(watch) {
    bundler = watchify(bundler)
  }

  // bundler.external('lodash')
  // bundler.external('react')

  //bundler.transform('reactify', {"es6": true});
  bundler.transform('babelify')
  bundler.transform('envify');

  rebundle = function() {
    console.log('bundling scripts...')
    return bundler.bundle()
      .on('error', function(err) { console.log(err) })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
      .pipe(sourcemaps.write('./')) // writes .map file
      .pipe(gulp.dest('./build/app'));
  };

  bundler.on('update', rebundle);
  return rebundle();
}

gulp.task('js-watch', scripts.bind(null, true));
gulp.task('js', scripts.bind(null, false));
gulp.task('js-minify', ['js'], function() {
  return gulp.src('./build/app/bundle.js')
    .pipe(uglify())
    .pipe(rename(function(path) {
      path.extname = '.min.js'
    }))
    .pipe(gulp.dest('./build/app'));
});

gulp.task('img', ['clean'], function() {
  gulp.src('./app/img/**/*.*').pipe(gulp.dest('./build/app/img'));
});

gulp.task('font', ['clean'], function() {
  gulp.src('./app/fonts/**/*.*').pipe(gulp.dest('./build/app/fonts'));
});

gulp.task('html', ['clean'], function() {
  var config = {
    title: process.env.SITE_TITLE,
    logo_url: process.env.LOGO_URL,
    auth0_domain: process.env.AUTH0_DOMAIN,
    auth0_client_id: process.env.AUTH0_CLIENT_ID,
    auth0_connection: process.env.AUTH0_CONNECTION
  }
  var data = {
    bundle_js_path: PROD ? '/bundle.min.js' : '/bundle.js',
    bundle_css_path: PROD ? '/bundle.min.css' : '/bundle.css',
    config: JSON.stringify(config)
  }
  gulp.src('./app/html/index.html')
  .pipe(handlebars(data))
  .pipe(gulp.dest('build/app'));
});

gulp.task('app-publish', ['build', 'webtasks', 'rules'], function() {
  gulp.src("./build/app/**/*.*")
  .pipe(s3({
      Bucket: process.env.AWS_S3_BUCKET,
      ACL:    'public-read'
  }));
})

gulp.task('webtasks-build', ['webtasks-clean'], function() {
  return gulp.src("tasks/*.js")
    .pipe(babel())
    .pipe(gulp.dest("build/tasks"));
});

gulp.task('webtasks-publish', ['webtasks-build'], function() {
  gulp.src("./build/tasks/**/*.js")
  .pipe(s3({
      Bucket: process.env.AWS_S3_BUCKET,
      ACL:    'public-read',
      keyTransform: function(relative_filename) {
          return 'tasks/' + relative_filename;
      }
  }));
});

gulp.task('rules-build', ['rules-clean'], function() {
  var data = {
    auth0_client_id: process.env.AUTH0_CLIENT_ID,
    admin_group: process.env.SSO_DASHBOARD_ADMIN_GROUP,
    auth0_domain: process.env.AUTH0_DOMAIN,
    aws_region: process.env.AWS_REGION,
    aws_s3_bucket: process.env.AWS_S3_BUCKET
  }
  return gulp.src("rules/*.js")
    .pipe(handlebars(data))
    .pipe(gulp.dest("build/rules"));
});

gulp.task('rules-publish', ['rules-build'], function() {
  gulp.src('./build/rules/**/*.js');
});

gulp.task('webtasks', ['webtasks-publish']);
gulp.task('rules', ['rules-publish']);




gulp.task('start', ['css-watch', 'js-watch', 'html', 'serve']);
gulp.task('build', ['clean', 'css-minify', 'js-minify', 'html', 'img', 'font']);
gulp.task('publish', ['app-publish', 'webtasks', 'rules']);
