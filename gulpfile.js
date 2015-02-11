var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('develop', function () {
  nodemon({
    script: 'bin/www',
    ext: 'hbs js less',
    env: { 'NODE_ENV': 'development' }
  })
    .on('restart', function () {
      console.log('restarted!')
    })
});
