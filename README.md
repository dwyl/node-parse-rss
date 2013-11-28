node-parse-rss
==============

A quick node.js RSS feed parser.

Original **quest**ion:
http://stackoverflow.com/questions/20177259/requesting-rss-feeds-from-two-web-sites-in-node-js
Saw this question on Stack Overflow and decided it merited a quick answer.

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


## Initial Overview

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
