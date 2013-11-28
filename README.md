node-parse-rss
==============

A quick node.js RSS feed parser.

Original **quest**ion:
http://stackoverflow.com/questions/20177259/requesting-rss-feeds-from-two-web-sites-in-node-js
Saw this question on Stack Overflow and decided it merited a quick answer.

The author also posted it on LinkedIn:
http://www.linkedin.com/groups/Parse-RSS-feeds-using-Nodejs-2906459.S.5811745652475990020

## Discussion

From the original code on StackOverflow Maksim is only using one *non-core* 
module: **feed-read**

See: 
- https://npmjs.org/package/feed-read
- https://github.com/sentientwaffle/feed-read

I don't understand the choice of 3rd Party Module.
feed-read has only **5 watchers** at the time of writing (*not v. popular*)
but it does have **unit tests** which is a good sign so lets try it!
