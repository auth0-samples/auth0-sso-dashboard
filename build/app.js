var crypto = require('crypto');
var del = require('del');
var fs = require('fs');
var handlebars = require('gulp-compile-handlebars');
var minifyHTML = require('gulp-minify-html');
var path = require('path');
var serve = require('gulp-serve');

var s3Upload = require('gulp-s3-upload')({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

module.exports = function(gulp, is_production) {

  require('./scripts')(gulp);
  require('./styles')(gulp);

  gulp.task('app-clean', function(cb) {
    return del(['./dist/app'], cb);
  });

  gulp.task('app-images', ['app-clean'], function() {
    return gulp.src('./app/img/**/*.*').pipe(gulp.dest('./dist/app/img'));
  });

  gulp.task('app-fonts', ['app-clean'], function() {
    return gulp.src('./app/fonts/**/*.*').pipe(gulp.dest('./dist/app/fonts'));
  });

  gulp.task('app-html', ['app-clean', 'scripts-build', 'styles-build'], function() {
    var config = {
      title: process.env.SITE_TITLE,
      logo_url: process.env.LOGO_URL,
      auth0_domain: process.env.AUTH0_DOMAIN,
      auth0_client_id: process.env.AUTH0_CLIENT_ID,
      auth0_connection: process.env.AUTH0_CONNECTION,
      aws_s3_bucket: process.env.AWS_S3_BUCKET,
      aws_iam_principal: process.env.AWS_IAM_PRINCIPAL,
      aws_iam_user: process.env.AWS_IAM_USER,
      aws_iam_admin: process.env.AWS_IAM_ADMIN,
      debug: !is_production
    }

    var checksumPath = function(file) {
      var fullPath = path.join(__dirname, '../dist/app', file);
      var text = fs.readFileSync(fullPath);
      var hash = crypto.createHash('md5').update(text, 'utf8').digest('hex');
      return file + '?v=' + hash;
    }

    var data = {
      bundle_js_path: is_production ? checksumPath('/bundle.min.js') : '/bundle.js',
      bundle_css_path: is_production ? checksumPath('/bundle.min.css') : '/bundle.css',
      config: JSON.stringify(config)
    }
    return gulp.src('./app/html/index.html')
      .pipe(handlebars(data))
      .pipe(minifyHTML())
      .pipe(gulp.dest('./dist/app'));
  });

  gulp.task('app-build', ['scripts-build', 'styles-build', 'app-html', 'app-fonts', 'app-images']);

  gulp.task('app-publish', ['app-build'], function() {
    return gulp.src("./dist/app/**/*.*")
      .pipe(s3Upload({
        Bucket: process.env.AWS_S3_BUCKET,
        ACL: 'public-read'
      }));
  });

  gulp.task('app-serve', serve(['app', './dist/app']));

}
