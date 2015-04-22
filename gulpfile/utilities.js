var AWS = require('aws-sdk');
var s3 = new AWS.S3({params: {Bucket: process.env.AWS_S3_BUCKET }});
s3.config.credentials = new AWS.Credentials(
  process.env.AWS_ACCESS_KEY_ID,
  process.env.AWS_SECRET_ACCESS_KEY);

module.exports = function(gulp) {

  gulp.task('util:create-s3-bucket', function(cb) {
    var params = {
      Bucket: process.env.AWS_S3_BUCKET,
      ACL: 'public-read',
      CreateBucketConfiguration: {
        LocationConstraint: process.env.AWS_REGION
      }
    };
    s3.createBucket(params, cb);
  });

};
