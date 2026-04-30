---
title: "Scraping with Javascript, JQuery and Node.js"
published: 2013-04-19
excerpt: "OK, I admit it. The biggest thing I knew about Node.js before working with it over the past couple of days was from this video, entitled: “Node.js is Bad Ass Rock Star Tech”. It still cracks me up. However, after watching this intro video by the creator of Node.js and doing a few Google searches, […]"
legacyUrl: https://fun-in-space.com/2013/04/19/scraping-with-javascript-jquery-and-node-js/
featured: false
tags:
  - "javascript"
  - "jquery"
  - "node.js"
draft: false
---

OK, I admit it. The biggest thing I knew about Node.js before working with it over the past couple of days was from this video, entitled: [“Node.js is Bad Ass Rock Star Tech”](http://www.youtube.com/watch?v=bzkRVzciAZg).

It still cracks me up. However, after watching this [intro video](http://www.youtube.com/watch?v=jo_B4LTHi3I) by the creator of Node.js and doing a few Google searches, I have a new (partial) web scraper written in Javascript (and using libraries from Node.js via the [Node package manager](https://npmjs.org)) that is extremely simple.  I’m pretty impressed.  I should point out that I’m not trying to run any type of services here, just using Node.js as a scripting environment that I can run on the command line that allows me to use some simple Javascript and JQuery commands to do my web scraping.  The code is simple enough that I could reproduce it here, pretty much verbatim (see also the [original file in Github](https://github.com/duane1024/miracle/blob/master/scraping/node/qp_scrape.js)).

var $ = require('jquery');

var http = require('http');

var queenpediaSongList =

"http://queenpedia.com/index.php?title=Song_List";

var html = '';



http.get(queenpediaSongList, function(result) {

  result.on('data', function(data) {

    html += data;

  }).on('end', function() {

    var songitemsInTables =

      $(html).find('#bodyContent > table')

        .slice(1).find('td').find('li');

    var songitemsInList =

      $(html).find('#bodyContent > ul').find('li');

    var songitems = $.merge(songitemsInTables, songitemsInList);

    songitems.each(function() {

      var songtitle = $(this).find('a').text().trim();

      var songurl = $(this).find('a').attr('href');

      console.log("Song Title = " + songtitle + ",

        Song URL = " + songurl);

    });

  });

});

And there you have it. I should mention that a few of the search results I found for combining JQuery and Node.js seemed to be using some older techniques that might not strictly be necessary.  I can’t really comment on those other posts as they might have had different needs than mine.  I also can’t comment on whether Node.js is truly Bad Ass Rock Star Tech, but it does work well enough for the simple task that I gave it here.
