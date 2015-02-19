var express = require('express');
var router = express.Router();


router.get('/api/ping', function(req, res) {
  res.send(200, {text: "All good. You only get this message if you're authenticated"});
})

module.exports = router;