require('dotenv').load();
var gulp = require('gulp');

require('./gulpfile/app')(gulp);
require('./gulpfile/data')(gulp);
require('./gulpfile/rules')(gulp);
require('./gulpfile/utilities')(gulp);
require('./gulpfile/webtasks')(gulp);

gulp.task('default', ['webtasks:watch', 'rules:watch', 'data:publish', 'app:watch']);
gulp.task('build', ['app:build', 'rules:build', 'webtasks:build']);
gulp.task('publish', ['app:publish', 'webtasks:publish', 'rules:publish', 'data:publish']);
