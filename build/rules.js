var del = require('del');
var handlebars = require('gulp-compile-handlebars');

module.exports = function(gulp) {

  gulp.task('rules-clean', function(cb) {
    return del(['./dist/rules'], cb);
  });


  gulp.task('rules-build', ['rules-clean'], function() {
    var data = {
      auth0_client_id: process.env.AUTH0_CLIENT_ID,
      auth0_domain: process.env.AUTH0_DOMAIN,
      auth0_connection: process.env.AUTH0_CONNECTION,
      admin_group: process.env.SSO_DASHBOARD_ADMIN_GROUP,
      aws_region: process.env.AWS_REGION,
      aws_s3_bucket: process.env.AWS_S3_BUCKET,
      aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
      webtask_container: process.env.WEBTASK_CONTAINER
    };
    return gulp.src('./rules/*.js')
      .pipe(handlebars(data))
      .pipe(gulp.dest('./dist/rules'));
  });

  gulp.task('rules-publish', ['rules-build'], function() {
    return gulp.src('./dist/rules/**/*.js');
  });

  gulp.task('rules-watch', ['rules-publish'], function() {
    var watcher = gulp.watch('./rules/**/*.js', ['rules-publish']);
    watcher.on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
  });

};
