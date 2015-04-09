var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');

module.exports = function(gulp, is_production) {

  gulp.task('styles-bundle', ['app-clean'], function() {
    return gulp.src('./app/styles/main.less')
      .pipe(less())
      .pipe(rename(function(path) {
        path.basename = "bundle"
      }))
      .pipe(gulp.dest('./dist/app'));
  });

  gulp.task('styles-watch', ['styles-bundle'], function() {
    var watcher = gulp.watch('./app/styles/*.*', ['styles-bundle']);
    watcher.on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
  });

  gulp.task('styles-minify', ['styles-bundle'], function() {
    return gulp.src('./dist/app/bundle.css')
      .pipe(minifyCSS())
      .pipe(rename(function(path) {
        path.extname = '.min.css';
      }))
      .pipe(gulp.dest('./dist/app'))
  });

  gulp.task('styles-build', ['styles-minify']);

}
