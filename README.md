node-parse-rss
==============

A quick node.js RSS feed parser.

Original **quest**ion:
http://stackoverflow.com/questions/20177259/requesting-rss-feeds-from-two-web-sites-in-node-js
Saw this question on Stack Overflow and decided it merited a quick answer.

```javascript
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
```

The author also posted it on LinkedIn:
http://www.linkedin.com/groups/Parse-RSS-feeds-using-Nodejs-2906459.S.5811745652475990020

## Try it yourself

Clone/copy this repo to your local machine:
```sh
git clone https://github.com/nelsonic/node-parse-rss.git
```
Install the modules:
```sh
npm install
```

## Parsing Multiple RSS Feeds Without Async

The async module is the hammer of the node.js world.
I see **async.parallel** used *everywhere* to *force* asynchronous requests
to wait until all responses have returned before performing a final action.

There's another (better?) way of doing it... but it requires more work.

### Create an Array of RSS Feed URls


### Create a Write Stream to Client

http://nodejs.org/api/stream.html#stream_readable_stream
http://nodejs.org/api/http.html#http_http_clientresponse

### Pump Each Result to Client as it Arrives

Example of this: https://gist.github.com/isaacs/723163



## Background

From the original code on StackOverflow Maksim is using the following 
*non-core* node modules: 

1. **async**: https://github.com/caolan/async
2. **request**: https://github.com/mikeal/request
3. **feed-read**: https://github.com/sentientwaffle/feed-read

The firts two (async and request) are *uber* popular node modules that
have been tested by thousands of people and used in many high-profile projects.

feed-read on the other hand ...

![feed-read module page](http://i.imgur.com/Y3oqs0x.png "feed-read module")

only **5 watchers** at the time of writing (*not v. popular*)
and it was *last updated* **2 years ago** ... (might not be compatible with 
the latest version of node.js or its dependencies!)
but it *does* have **unit tests** which is a *good sign* so lets *try* it!

## Read Documentation (Readme & Unit Tests)

Often developers neglect to document their work adequately in the **README.md**
If this is the case, the best way of learning how to use a new module is to
read through the unit tests in the ./**test** folder in the case of feed-read

https://github.com/sentientwaffle/feed-read/blob/master/test/index.test.js

The tests are very clear. And the module is well written.

> I sent a clarifying question on LinkedIn: http://lnkd.in/dY2Xtf6
> Meanwhile @GoloRoden gave an answer on Stack: http://stackoverflow.com/a/20273797/1148249

```javascript
async.parallel({
  bbc: function (callback) {
    feed(BBC_URL, callback);
  },
  sky: function (callback) {
    feed(SKY_URL, callback);
  }
}, function (err, result) {
  if (err) {
    // Somewhere, something went wrong…
  }

  var rssBbc = result.bbc,
      rssSky = result.sky;

  // Merge the two feeds or deliver them to the client or do
  // whatever you want to do with them.
});
```
This answer requires the Async Module...

What if we instead try and write one ***without*** relying on async (for once)?