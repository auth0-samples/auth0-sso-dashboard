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

  if (req.method !== 'GET') {
    data.json = context.body;
  }
  request(options, function(error, response, body) {
    if (error) {
      res.writeHead(500, { 'Content-Type': 'application/json'});
      res.end(JSON.stringify(error));
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json'});
      res.end(body);
    }
  });
}
