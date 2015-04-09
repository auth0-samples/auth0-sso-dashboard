require('dotenv').load();
var gulp = require('gulp');

var is_production = process.env.NODE_ENV === 'production';


require('./build/app')(gulp, is_production);
require('./build/data')(gulp, is_production);
require('./build/rules')(gulp, is_production);
require('./build/utilities')(gulp, is_production);
require('./build/webtasks')(gulp, is_production);

gulp.task('start', ['styles-watch', 'scripts-watch', 'webtasks-watch', 'rules-watch', 'data-publish', 'app-build', 'app-serve']);
gulp.task('build', ['app-build', 'rules-build', 'webtasks-build']);
gulp.task('publish', ['app-publish', 'webtasks-publish', 'rules-publish', 'data-publish']);
