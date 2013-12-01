var feed = require('feed-read'),  // require the feed-read module
    http = require("http"),   
    port = process.env.PORT || 5000, // allow heroku/nodejitsu to set port    
    urls = [
      "http://feeds.bbci.co.uk/news/rss.xml",
      "http://news.sky.com/feeds/rss/home.xml"
    ]; // Example RSS Feeds

// http://feeds.feedburner.com/TechCrunch/

// send each article to the client as it comes in.
// Each article has the following properties:
//   * "title"     - The article title (String).
//   * "author"    - The author's name (String).
//   * "link"      - The original article link (String).
//   * "content"   - The HTML content of the article (String).
//   * "published" - The date that the article was published (Date).
//   * "feed"      - {name, source, link}

function displayArticle(res, a) {

  var author = a.author || a.feed.name; // some feeds don't have author (BBC!)  

  // send the article content to client
  res.write("<h3>"+a.title +"</h3>");
  res.write("<p><strong>" +author +" - " +a.published +"</strong> <br />\n");
  res.write(a.content+"</p>\n");
}

http.createServer(function (req, res) {
    res.writeHead(200, {
        "Content-Type": "text/html",
        "Transfer-Encoding": "chunked"
    });
    // set up the basic html file and send to client
    res.write("<html>\n<head>\n<title>RSS Feeds</title>\n</head>\n<body>");

    // loop through all articles and send them to client:
    var feedCount = urls.length, j = 0;

    for (j = 0; j < urls.length; j++) {

      feed(urls[j], function(err, articles) {

        if (err) throw err;
        console.log(articles[0]);
        var i;

        // inner loop itterates over the RSS feed
        for (i = 0; i < articles.length; i++) {
             // console.log(articles[i].title);
             displayArticle(res, articles[i]);

             // check we have reached the end of the RSS feed
             if (i === articles.length-1) {
                if(feedCount === 0) {
                  // terminate the response to the client
                    res.end("</body>\n</html>");
                } else {
                    feedCount = feedCount - 1;
                }
             }
        }; // end inner for loop
      }); // end feed request
    }; // end urls for loop
}).listen(port);

console.log("HTTP Listening on: http://localhost:"+port);