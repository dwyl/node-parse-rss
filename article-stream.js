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