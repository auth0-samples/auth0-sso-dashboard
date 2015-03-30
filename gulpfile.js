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
var nodemon = require('nodemon');
var minifyCSS = require('gulp-minify-css');
var del = require('del');
var path = require('path');
var pkg = require('./package');

gulp.task('serve', function () {
  nodemon({
    script: 'bin/www',
    ext: 'js',
    ignore: ['public/*', 'build/*', 'app/*', 'gulpfile.js'],
    env: { 'NODE_ENV': 'development' }
  })
    .on('restart', function () {
      console.log('restarted!')
    })
});


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

  bundler.transform('reactify', {"es6": true});
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

gulp.task('start', ['css-watch', 'js-watch', 'serve']);
gulp.task('build', ['clean', 'css', 'js']);
gulp.task('dist', ['clean', 'css-minify', 'js-minify'])
