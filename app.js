var feed = require('feed-read');
var http = require('http');
var async = require('async');
var request = require('request');

var LIMIT = 10;
var UNABLE_TO_CONNECT = "Unable to connect.";
var BBC_URL = 'http://feeds.bbci.co.uk/news/rss.xml';
var SKY_URL = 'http://news.sky.com/feeds/rss/home.xml';

var server = http.createServer(onRequest);
server.listen(9000);

function onRequest(req, res) {
    res.writeHead(200, {
        'Content-Type' : 'text/html; charset=utf-8'
    });

    async.parallel([ function(callback) {
        feed(BBC_URL, onRssFetched);
        // TODO: where to call callback()?
    }, function(callback) {
        feed(SKY_URL, onRssFetched);
        // TODO: where to call callback()?
    } ], function done(err, results) {
        console.log("Done");
        if (err) {
            throw err;
        }
    });
}

function onRssFetched(err, articles) {
    console.log("RSS fetched");
    var html = [];
    if (err) {
        html.push("<p>", UNABLE_TO_CONNECT = "</p>");
    } else {
        html.push("<ol>");
        var i = 0;
        articles.forEach(function(entry) {
            if (i == LIMIT) {
                return;
            }
            html.push("<li><a href='" + entry.link + "'>" + entry.title
                    + "</a></li>");
            i++;
        });
    }
    console.log(html.join(""));
}

console.log("RSS Server listening on http://localhost:9000");