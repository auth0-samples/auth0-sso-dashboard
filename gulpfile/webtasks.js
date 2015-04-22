
var babel = require('gulp-babel');
var del = require('del');
var s3Upload = require('gulp-s3-upload')({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

module.exports = function(gulp) {

  gulp.task('webtasks:clean', function(cb) {
    return del(['./dist/tasks'], cb);
  });

  gulp.task('webtasks:build', ['webtasks:clean'], function() {
    return gulp.src('./tasks/*.js')
      .pipe(babel())
      .pipe(gulp.dest('./dist/tasks'));
  });

  gulp.task('webtasks:publish', ['webtasks:build'], function() {
    return gulp.src('./dist/tasks/**/*.js')
      .pipe(s3Upload({
        Bucket: process.env.AWS_S3_BUCKET,
        ACL: 'public-read',
        keyTransform: function(relative_filename) {
          return 'tasks/' + relative_filename;
        }
      }));
  });

  gulp.task('webtasks:watch', ['webtasks:publish'], function() {
    var watcher = gulp.watch('./tasks/**/*.js', ['webtasks:publish']);
    watcher.on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
  });

};
