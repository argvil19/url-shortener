var express = require('express');
var router = express.Router();
var host = "https://argvil-urlshort.herokuapp.com/";

router.get('/:id', function(req, res) {
    var id = req.params.id;
    req.db.collection('urls').find({short_url:host+id}).toArray(function(err, data) {
        if (err) throw err;
        if (data.length) {
            res.set('Location', data[0].original);
            res.status(301);
            res.end();
        } else {
            res.send(JSON.stringify({error:"that short url doesn't exist"}));
        }
    });
});

module.exports = router;