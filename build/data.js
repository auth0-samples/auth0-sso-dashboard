var AWS = require('aws-sdk');
var chalk = require('chalk');
var moment = require('moment');
var s3 = new AWS.S3({params: {Bucket: process.env.AWS_S3_BUCKET }});
s3.config.credentials = new AWS.Credentials(
  process.env.AWS_ACCESS_KEY_ID,
  process.env.AWS_SECRET_ACCESS_KEY);

module.exports = function(gulp) {

  gulp.task('set-cors', function(cb) {
    var params = {
      Bucket: process.env.AWS_S3_BUCKET,
      CORSConfiguration: {
        CORSRules: [{
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
        }, ]
      }
    };
    s3.putBucketCors(params, cb);
  });

  gulp.task('data-publish', ['set-cors'], function() {
    var createObjectIfNotExists = function(obj) {
      return new Promise(function(resolve, reject) {
        var params = {
          Key: obj
        };
        s3.getObject(params, function(err) {
          if (err) {
            params.Body = '{ "result": [] }';
            params.ContentType = 'application/json';
            s3.putObject(params, function(err) {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                console.log('Uplaoded ' + obj);
                resolve();
              }
            });
          } else {
            console.log('[' + chalk.gray(moment().format('HH:mm:ss')) + '] ' + chalk.grey('No change ..... ') + obj);
            resolve();
          }
        });
      });
    };

    var objs = ['data/clients.json', 'data/roles.json'];
    return Promise.all(objs.map(createObjectIfNotExists));
  });

};
