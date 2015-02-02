node-parse-rss
==============

A quick node.js RSS feed parser.

Original **quest**ion:
http://stackoverflow.com/questions/20177259/requesting-rss-feeds-from-two-web-sites-in-node-js
Saw this question on Stack Overflow and decided it merited a *quick* answer.

## Try it yourself

> Visit: https://news-stream.herokuapp.com


### DIY

Clone/copy this repo to your local machine:
```sh
git clone https://github.com/nelsonic/node-parse-rss.git
```
Install the modules:
```sh
npm install
```
Run the node script
```sh
node article-stream.js
```

Point your browser at: [**http://localhost:5000**](http://localhost:5000)

You will expect to see something like:
![RSS News Stream](http://i.imgur.com/3rmmsb2.png "RSS News Stream")

*Yes*, this is not beautiful. But the question was specific to the technical
side of how to parse the RSS feeds not a *full* (attractive) solution.
That is an "*exercise left to the reader*"... :-)

- - -

# Solution

## The Original Question on StackOverflow (async)


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


## Parsing Multiple RSS Feeds *Without* Async

The async module is the *hammer* of the node.js world.
(read: [Law of the Instrument](http://en.wikipedia.org/wiki/Law_of_the_instrument)) <br />
I see **async.parallel** used *everywhere* to *force* asynchronous requests
to ***wait*** until all responses have returned before performing a final action.

There's another (**better**?) way of doing it... but it requires *more work*.

### Create an Array of RSS Feed URls

Rather than having a separate **var**iable for *each* RSS feed,
we put them in an array. This allows us to itterate over the urls array
and fetch each RSS feed. It makes it easy to add/remove feeds without
having to touch the application logic.

```javascript
urls = [
  "http://feeds.bbci.co.uk/news/rss.xml",
  "http://news.sky.com/feeds/rss/home.xml"
]; // Example RSS Feeds
```
### Create an Http Write Stream to Client

Because the node.js **http** (core) module supports **streams** *natively*,
we can stream the news articles to the client individually:

```javascript
http.createServer(function (req, res) {
    // send basic http headers to client
    res.writeHead(200, {
        "Content-Type": "text/html",
        "Transfer-Encoding": "chunked"
    });

    // setup simple html page:
    res.write("<html>\n<head>\n<title>RSS Feeds</title>\n</head>\n<body>");

    // loop through our list of RSS feed urls
    for (var j = 0; j < urls.length; j++) {

        // fetch rss feed for the url:
        feed(urls[j], function(err, articles) {

            // loop through the list of articles returned
            for (var i = 0; i < articles.length; i++) {

                // stream article title (and what ever else you want) to client
                res.write("<h3>"+articles[i].title +"</h3>");

                // check we have reached the end of our list of articles & urls
                if( i === articles.length-1 && j === urls.length-1) {
                    res.end("</body>\n</html>"); // end http response
                } // else still have rss urls to check
            } //  end inner for loop
        }); // end call to feed (feed-read) method
    } // end urls for loop
}).listen(5000);
```

putting it all together we get:

```javascript
var feed = require('feed-read'),  // require the feed-read module
    http = require("http"),
    urls = [
        "http://feeds.bbci.co.uk/news/rss.xml",
        "http://news.sky.com/feeds/rss/home.xml",
        "http://www.techmeme.com/feed.xml"
    ]; // Example RSS Feeds

http.createServer(function (req, res) {
    // send basic http headers to client
    res.writeHead(200, {
        "Content-Type": "text/html",
        "Transfer-Encoding": "chunked"
    });

    // setup simple html page:
    res.write("<html>\n<head>\n<title>RSS Feeds</title>\n</head>\n<body>");

    // loop through our list of RSS feed urls
    for (var j = 0; j < urls.length; j++) {

        // fetch rss feed for the url:
        feed(urls[j], function(err, articles) {

            // loop through the list of articles returned
            for (var i = 0; i < articles.length; i++) {

                // stream article title (and what ever else you want) to client
                res.write("<h3>"+articles[i].title +"</h3>");

                // check we have reached the end of our list of articles & urls
                if( i === articles.length-1 && j === urls.length-1) {
                    res.end("</body>\n</html>"); // end http response
                } // else still have rss urls to check
            } //  end inner for loop
        }); // end call to feed (feed-read) method
    } // end urls for loop
}).listen(5000);
```

> Let me know your thoughts on this! I'd love to hear if you have a <br />
> **better** way of doing it! :-)


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

> I sent a clarifying question on LinkedIn: http://lnkd.in/dY2Xtf6 <br />
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
This answer requires the **Async** Module...

**What if** we instead try and write one ***without*** relying on async (for once)?

## Notes

- Node.js Streams Handbook: https://github.com/substack/stream-handbook
- http://nodejs.org/api/stream.html#stream_readable_stream
- http://nodejs.org/api/http.html#http_http_clientresponse
