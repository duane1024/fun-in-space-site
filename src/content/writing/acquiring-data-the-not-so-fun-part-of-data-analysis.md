---
title: "Acquiring data: the not-so-fun part of data analysis"
published: 2013-04-06
excerpt: "OK, so it’s been a few weeks since my last post. In that time, I’ve been doing some more research on getting Project Miracle started. At the risk of stating the obvious, the tricky part of doing data analysis, or any data-intensive project for that matter, is actually acquiring the relevant data to analyze. I […]"
legacyUrl: https://fun-in-space.com/2013/04/06/acquiring-data-the-not-so-fun-part-of-data-analysis/
featured: false
tags: []
draft: false
---

OK, so it’s been a few weeks since my last post.  In that time, I’ve been doing some more research on getting Project Miracle started.  At the risk of stating the obvious, the tricky part of doing data analysis, or any data-intensive project for that matter, is actually acquiring the relevant data to analyze.

I need to start with building a Queen song database. My first thought was to utilize the [MusicBrainz](http://musicbrainz.org) open source database, at least as a starting point.  I have downloaded their database dump and have begun the process of building the MusicBrainz server software and setting up the database (more to come on that later).  But the MusicBrainz database doesn’t contain any lyrics, so I’ll need to acquire those elsewhere.

Some possible candidates:

- [Andy’s Queen Page](http://www.pcpki.com/queen/) – My favorite Queen web site from the 1990s was run by Andy Young.  Even though it hasn’t been actively updated since 2000, it’s still one of my favorite resources.  [This page](http://www.pcpki.com/queen/pre.html) contains all of the Queen and solo songs up to 2000.  The solo material will require further discussion, but I think we will want it included.  The inclusion of solo material and what constitutes our ‘master’ database will probably require a separate blog post.

- [Queenpedia Song List](http://queenpedia.com/index.php?title=Song_List) – This looks like the most comprehensive of the modern Queen discography web sites.

- [Queen Online Official Discography](http://www.queenonline.com/en/the-band/discography/) – What the hell; might as well see what we can get from the “official” discography, though I think we will be hard pressed to get as much info as Queenpedia.

There are plenty of non-Queen lyric sites available, but unless the three sites above fall short, I don’t think I’ll need to look into those yet.  As a side note, I just received [The Complete Illustrated Lyrics](http://www.amazon.com/Queen-Complete-Illustrated-Lyrics/dp/1617130133) from Amazon, so, for all of the songs from the main albums I should have a master reference to use to verify the quality of the downloaded lyrics.  (I should also be able to verify if the official Queen web site contains the same lyrical content as the book.)

I’ll need to scrape the lyrics data from the aforementioned web sites using some kind of web scraping approach.  Some possible solutions for this:

- Python – [This Stack Overflow question](http://stackoverflow.com/questions/2081586/web-scraping-with-python) contains some good answers on basic web scraping with Python.  [Scrapy](http://scrapy.org) is also a possible approach using Python, but it might be overkill for the relatively simple scraping I’ll need to do.

- A friend of mine has recommended [Node.js](http://nodejs.org/) as the best solution for web scraping.  He mentioned that you can use a full JavaScript and JQuery approach just as if you were running in a browser.  I usually manage to keep JavaScript at arms length, but I probably should get better at it, so may have to try this out.

I also recently reviewed the videos for Getting Data ([Part 1](http://www.youtube.com/watch?v=z7pOxe6dDG0) and [Part 2](http://www.youtube.com/watch?v=7lE7lzwC_NY)) that were presented by [Jeff Leek](http://simplystatistics.org/author/jtleek/) as part of the Coursera online course [Data Analysis](https://www.coursera.org/course/dataanalysis).  (For some reason, unlike other Coursera courses, the content for the course is no longer available on the Coursera site, but you can review all of the videos on YouTube [here](http://www.youtube.com/user/jtleek2007/videos)).  “[Getting Data (Part 2)](http://www.youtube.com/watch?v=7lE7lzwC_NY)” actually covers scraping web data using [R](http://www.r-project.org/) and the R [XML package](http://cran.r-project.org/web/packages/XML/index.html).  I think that could be an interesting approach to try out, but since part of my goal is to be able to use environments other than R, I think I’ll try one of the other approaches first.
