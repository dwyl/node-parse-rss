var feed = require('feed-read');                  // require the module
var url = "http://feeds.bbci.co.uk/news/rss.xml"; // an example RSS feed

feed(url, function(err, articles) {
  if (err) throw err;
  console.log(articles[0]);
  // Each article has the following properties:
  // 
  //   * "title"     - The article title (String).
  //   * "author"    - The author's name (String).
  //   * "link"      - The original article link (String).
  //   * "content"   - The HTML content of the article (String).
  //   * "published" - The date that the article was published (Date).
  //   * "feed"      - {name, source, link}
  // 
});