var http = require('http');
var validateUrl = require('valid-url');
var mongo = require('mongodb').MongoClient;
var fs = require('fs');
var randomNum = require('./random-number');
var port = process.env.PORT || 3000;
var host = "https://argvil-urlshort.herokuapp.com/";

mongo.connect("mongodb://argvil19:argenisjavier@ds011228.mongolab.com:11228/argvil-urlshort", function(err, db) {
    if (err) throw err;
    http.createServer(function(req, res) {
        var path = req.url.substr(1);
        if (req.url === '/') {
    		res.setHeader('Content-Type', 'text/html');
    		fs.createReadStream('./index.html').pipe(res);
    		return;
    	}
    	if (req.url.substr(0,5) === '/new/') {
    	    var newUrl = req.url.substr(5);
    	    var randomId = randomNum(10);
    	    if (!validateUrl.isUri(newUrl)) {
    	        res.end(JSON.stringify({error:'The URL is invalid'}));
    	        return;
    	    }
    	    res.setHeader('Content-Type', 'application/json');
	        var urls = db.collection("urls");
	        urls.find({original:newUrl}, {_id:0}).toArray(function(err, data) {
	            if (err)
	                throw err;
	            if (data.length != 0) {
	                res.end(JSON.stringify(data[0]));
	                return;
	            } else {
    	            urls.insert({original:newUrl, short_url:host + randomId}, function(err, data) {
    	            if (err) throw err;
    	            res.end(JSON.stringify({original:newUrl, short_url:host + randomId}));
	                });
	            }
    	    });
    	} else {
    	    db.collection("urls").find({short_url:host+path}, {_id:0}).toArray(function(err, data) {
    	        if (err) throw err;
    	        if (data.length) {
    	            res.writeHead(301, {Location:data[0].original});
    	            res.end();
    	        } else {
    	            res.end(JSON.stringify({error:"that short url doesn't exist"}));
    	        }
    	    })
    	}
    }).listen(port);
});