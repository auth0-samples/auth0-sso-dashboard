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
var config = require('./config.json');
var serve = require('gulp-serve');

gulp.task('serve', serve(['app', 'build']));

gulp.task('clean', function(cb) {
  del(['build'], cb);
});

gulp.task('css', function () {
  return gulp.src('app/styles/main.less')
    .pipe(less())
    .pipe(rename(function(path) {
      path.basename = "bundle"
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('css-watch', ['css'], function() {
  var watcher = gulp.watch('app/styles/*.*', ['css']);
  watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
});

gulp.task('css-minify', ['css'], function() {
  return gulp.src('./build/bundle.css')
    .pipe(minifyCSS())
    .pipe(rename(function(path) {
      path.extname = '.min.css';
    }))
    .pipe(gulp.dest('build'))
});

function scripts(production, watch) {
  var bundler, rebundle;
  bundler = browserify('./app/lib/app.js', {
    basedir: __dirname,
    debug: !production,
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
      .pipe(gulp.dest('./build'));
  };

  bundler.on('update', rebundle);
  return rebundle();
}

gulp.task('js-watch', scripts.bind(null, false, true));
gulp.task('js', scripts.bind(null, true, false));
gulp.task('js-minify', ['js'], function() {
  return gulp.src('./build/bundle.js')
    .pipe(uglify())
    .pipe(rename(function(path) {
      path.extname = '.min.js'
    }))
    .pipe(gulp.dest('./build'));
});

gulp.task('img', ['clean'], function() {
  gulp.src('./app/img/**/*.*').pipe(gulp.dest('./build/img'));
});

gulp.task('font', ['clean'], function() {
  gulp.src('./app/fonts/**/*.*').pipe(gulp.dest('./build/font'));
});

gulp.task('html', ['clean'], function() {
  var data = {
    bundle_js_path: '/bundle.js',
    bundle_css_path: '/bundle.css',
    config: JSON.stringify(config)
  }
  gulp.src('./app/html/index.html')
  .pipe(handlebars(data))
  .pipe(gulp.dest('build'));
});

gulp.task('start', ['css-watch', 'js-watch', 'html', 'serve']);
gulp.task('build', ['clean', 'css-minify', 'js-minify', 'html', 'img', 'font']);
