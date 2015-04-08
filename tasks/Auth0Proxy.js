var qs = require('querystring');
var request = require('request');

return function(context, req, res) {
  var data = context.data;
  var path = data.path;

  var url = 'https://' + data.auth0_domain + path;

  if (data.query) {
    var query = JSON.parse(data.query);
    url = url + '?' + qs.stringify(query);
  }

  var options = {
    url: url,
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + data.auth0_api_key
    }
  };


  var getBody = function(callback) {
    var body = '';
    req.on('data', function (chunk) { body += chunk; });
    req.on('end', function () {
        return callback(null, body);
    });
    req.on('error', callback);
  };

  var executeRequest = function(options) {
    request(options, function(error, response, body) {
      if (error || response.statusCode !== 200) {
        res.writeHead(response.statusCode, { 'Content-Type': 'application/json'});
        if (error) {
          res.end(JSON.stringify(error));
        } else {
          res.end();
        }
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json'});
        if (body) {
          res.end(body);
        } else {
          res.end();
        }
      }
    });
  }

  if (req.method === 'GET' || req.method == 'DELETE') {
    executeRequest(options);
  } else {
    getBody(function(err, body) {
      options.body = body;
      executeRequest(options);
    });
  }

}
