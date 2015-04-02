var qs = require('querystring');

return function(context, cb) {
  var data = context.data;
  var url = data.url;
  var method = data.method;
  var query = JSON.parse(data.query);
  var url = 'https://' + data.auth0_domain + url + '?' + qs.stringify(query);

  var options = {
    url: url,
    method: data.method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + data.auth0_api_key
    }
  };

  if (data.method !== 'GET') {
    data.json = context.body;
  }
  request(options, function(error, response, body) {
    if (error) {
      var err = JSON.parse(error);
      cb(err);
    } else {
      var obj = JSON.parse(body);
      cb(null, obj);
    }
  });
}
