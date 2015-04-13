var del = require('del');
var handlebars = require('gulp-compile-handlebars');
var minifyHTML = require('gulp-minify-html');
var serve = require('gulp-serve');
var cloudfront = require('gulp-cloudfront');
var RevAll = require('gulp-rev-all');
var awspublish = require('gulp-awspublish');

// var s3Upload = require('gulp-s3-upload')({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION
// });

var aws = {
    key: process.env.AWS_ACCESS_KEY_ID,
    secret: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: process.env.AWS_S3_BUCKET,
    region: process.env.AWS_REGION,
    distributionId: process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID
};

module.exports = function(gulp, is_production) {

  require('./scripts')(gulp, is_production);
  require('./styles')(gulp, is_production);

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
    };

    var data = {
      bundle_js_path: is_production ? '/bundle.min.js' : '/bundle.js',
      bundle_css_path: is_production ? '/bundle.min.css' : '/bundle.css',
      config: JSON.stringify(config)
    };

    return gulp.src('./app/html/index.html')
      .pipe(handlebars(data))
      .pipe(minifyHTML())
      .pipe(gulp.dest('./dist/app'));
  });

  gulp.task('app-build', ['scripts-build', 'styles-build', 'app-html', 'app-fonts', 'app-images']);

  gulp.task('app-publish', ['app-build'], function() {
    var publisher = awspublish.create(aws);

    // define custom headers
    var headers = {
       'Cache-Control': 'max-age=315360000, no-transform, public'
    };

   var revAll = new RevAll({
     dontRenameFile: ['\/fonts\/.*', '\/img\/.*']
   });

    return gulp.src('./dist/app/**/*.*')
      .pipe(revAll.revision())
      .pipe(awspublish.gzip())
      .pipe(publisher.publish(headers))
      .pipe(publisher.cache())
      .pipe(awspublish.reporter())
      .pipe(cloudfront(aws));
  });

  gulp.task('app-serve', serve(['app', './dist/app']));

};
