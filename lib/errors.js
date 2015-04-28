
module.exports = function(app) {

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) { // jshint ignore:line
      console.log(err);
      res.status(err.status || 500);
      var data = {
        message: err.message,
        error: err
      };
      handleError(data, req, res);
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) { // jshint ignore:line
    res.status(err.status || 500);
    var data = {
      message: err.message,
      error: {}
    };
    handleError(data, req, res);
  });

  var handleError = function(err, req, res) {
    res.json(err);
  };

};
