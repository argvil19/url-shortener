var express = require('express');
var router = express.Router();
var validateUrl = require('valid-url');
var randomNum = require('./modules/random-number');
var host = "https://argvil-urlshort.herokuapp.com/";

router.get('/*', function(req, res) {
    var newUrl = req.url.substr(1);
    var randomId = randomNum(10);
    var urls = req.db.collection("urls");
    if (!validateUrl.isUri(newUrl)) {
        res.send(JSON.stringify({error:'The URL is invalid'}));
    	return;
    }
    urls.find({original:newUrl}, {_id:0, }).toArray(function(err, data) {
        if (err) throw err;
        if (data.length) {
            res.send(JSON.stringify(data[0]));
            return;
        }
        urls.insert({original:newUrl, short_url:host+randomId}, function(err, data) {
            if (err) throw err;
            res.send(JSON.stringify({original:newUrl, short_url:host+randomId}));
        });
    });
});

module.exports = router;