require('dotenv').load();
var fs = require('fs');
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
var AWS = require('aws-sdk');
var cp = require('child_process');
var crypto = require('crypto');
var s3Upload = require('gulp-s3-upload')({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});
var s3 = new AWS.S3({params: {Bucket: process.env.AWS_S3_BUCKET }});
s3.config.credentials = new AWS.Credentials(
  process.env.AWS_ACCESS_KEY_ID,
  process.env.AWS_SECRET_ACCESS_KEY);

var PROD = process.env.NODE_ENV === 'production';

gulp.task('serve', serve(['app', 'build/app']));

gulp.task('clean', function(cb) {
  return del(['build/app'], cb);
});

gulp.task('rules-clean', function(cb) {
  return del(['build/rules'], cb);
});

gulp.task('webtasks-clean', function(cb) {
  return del(['build/tasks'], cb);
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
  bundler = browserify('./app/lib/Main.js', {
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
  return gulp.src('./app/img/**/*.*').pipe(gulp.dest('./build/app/img'));
});

gulp.task('font', ['clean'], function() {
  return gulp.src('./app/fonts/**/*.*').pipe(gulp.dest('./build/app/fonts'));
});

gulp.task('html', ['clean', 'js-minify', 'css-minify'], function() {
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
    debug: !PROD
  }

  var checksumPath = function(file) {
    var fullPath = path.join(__dirname, 'build/app', file);
    var text = fs.readFileSync(fullPath);
    var hash = crypto.createHash('md5').update(text, 'utf8').digest('hex');
    return file + '?v=' + hash;
  }

  var data = {
    bundle_js_path: PROD ? checksumPath('/bundle.min.js') : '/bundle.js',
    bundle_css_path: PROD ? checksumPath('/bundle.min.css') : '/bundle.css',
    config: JSON.stringify(config)
  }
  return gulp.src('./app/html/index.html')
  .pipe(handlebars(data))
  .pipe(gulp.dest('build/app'));
});

gulp.task('create-bucket', function(cb) {
  var params = {
    Bucket: process.env.AWS_S3_BUCKET,
    ACL: 'public-read',
    CreateBucketConfiguration: {
      LocationConstraint: process.env.AWS_REGION
    }
  };
  s3.createBucket(params, cb);
});

gulp.task('set-cors', function(cb) {
  var params = {
    Bucket: process.env.AWS_S3_BUCKET,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedHeaders: [
            '*',
          ],
          AllowedMethods: [
            'GET',
            'PUT'
          ],
          AllowedOrigins: [
            '*',
          ],
          // ExposeHeaders: [
          //   '*',
          // ],
          MaxAgeSeconds: 0
        },
      ]
    }
  };
  s3.putBucketCors(params, cb);
});

gulp.task('app-publish', ['build', 'webtasks', 'rules', 'set-cors'], function() {
  return gulp.src("./build/app/**/*.*")
  .pipe(s3Upload({
      Bucket: process.env.AWS_S3_BUCKET,
      ACL:    'public-read'
  }));
});

gulp.task('webtasks-build', ['webtasks-clean'], function() {
  return gulp.src("tasks/*.js")
    .pipe(babel())
    .pipe(gulp.dest("build/tasks"));
});

gulp.task('webtasks-publish', ['webtasks-build'], function() {
  return gulp.src("./build/tasks/**/*.js")
  .pipe(s3Upload({
      Bucket: process.env.AWS_S3_BUCKET,
      ACL:    'public-read',
      keyTransform: function(relative_filename) {
          return 'tasks/' + relative_filename;
      }
  }));
});

gulp.task('webtasks-watch', ['webtasks-publish'], function() {
  var watcher = gulp.watch("./tasks/**/*.js", ['webtasks-publish']);
  watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
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
  }
  return gulp.src("rules/*.js")
    .pipe(handlebars(data))
    .pipe(gulp.dest("build/rules"));
});

gulp.task('rules-publish', ['rules-build'], function() {
  return gulp.src('./build/rules/**/*.js');
});

gulp.task('rules-watch', ['rules-publish'], function() {
  var watcher = gulp.watch("./rules/**/*.js", ['rules-publish']);
  watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
});


gulp.task('webtasks', ['webtasks-publish']);
gulp.task('rules', ['rules-publish']);

gulp.task('data-publish', ['set-cors'], function(cb) {
  var createObjectIfNotExists = function(obj) {
    return new Promise(function(resolve, reject) {
      var params = {
        Key: obj
      }
      s3.getObject(params, function(err, data) {
        if (err) {
          params.Body = '{ "result": [] }';
          params.ContentType = 'application/json';
          s3.putObject(params, function(err, data) {
            if (err) {
              console.log(err);
              reject(err);
            }
            else {
              console.log('Uplaoded ' + obj);
              resolve(data);
            }
          })
        } else {
          console.log('Data file already exists at ' + obj);
          resolve();
        }
      });
    });
  };

  var objs = ['data/apps.json', 'data/roles.json'];
  return Promise.all(objs.map(createObjectIfNotExists));
});


gulp.task('start', ['css-watch', 'js-watch', 'webtasks-watch', 'rules-watch', 'html', 'data-publish', 'serve']);
gulp.task('build', ['clean', 'css-minify', 'js-minify', 'html', 'img', 'font']);
gulp.task('publish', ['app-publish', 'webtasks', 'rules', 'data-publish']);
