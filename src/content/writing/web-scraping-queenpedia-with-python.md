---
title: "Web scraping Queenpedia with Python"
published: 2013-04-12
excerpt: "My first working code for Project Miracle is now posted to Github. Rejoice and be thankful! The code is definitely a work in progress, but I wanted to share some of my initial thoughts on the process so far. I started with the approach that I had described in my earlier post by writing a Python […]"
legacyUrl: https://fun-in-space.com/2013/04/12/web-scraping-queenpedia-with-python/
featured: false
tags:
  - "python"
  - "web scraping"
draft: false
---

My first working code for Project Miracle is now posted to [Github](https://github.com/duane1024/miracle). Rejoice and be thankful!

The code is definitely a work in progress, but I wanted to share some of my initial thoughts on the process so far. I started with the approach that I had described in my [earlier post](http://fun-in-space.com/2013/04/06/acquiring-data-the-not-so-fun-part-of-data-analysis/) by writing a Python script to do the initial scraping. This helps me to learn Python better and have a baseline web scraping approach against which to compare other potential or implemented solutions.

I won’t bother to annotate all of the code at this point because it’s not terribly interesting.  Just a few notes:

- [BeautifulSoup](http://www.crummy.com/software/BeautifulSoup/) worked decently. However, being the kind of developer who is very comfortable with XML, I found myself testing out XPath statements against the downloaded [song index from Queenpedia](http://queenpedia.com/index.php?title=Song_List) and then trying to figure out how to convert that to BeautifulSoup/Python code.  This resulted in changing a one-line XPath statement into 30-40 lines of Python code. This doesn’t seem that efficient, but I am willing to allow for the fact that I’m still trying to learn Python and didn’t have any familiarity with the BeautifulSoup API before now. Perhaps there are more efficient ways to do what I’ve done so far. As a side note, the most popular answer in the [Stack Overflow topic on web scraping with Python](http://stackoverflow.com/questions/2081586/web-scraping-with-python) leaves a lot to be desired. For one the read() function called on urllib2.urlopen() might not return all of the contents of the URL every time. I suppose one has to accept the fact that Stack Overflow users aren’t going to write all of your code for you.

- I made use of the [lxml](http://lxml.de) Python XML library via BeautifulSoup.  According to the Beautiful Soup documentation: “[If you’re using a version of Python 2 earlier than 2.7.3, or a version of Python 3 earlier than 3.2.2, it’s essential that you install lxml or html5lib–Python’s built-in HTML parser is just not very good in older versions.](http://www.crummy.com/software/BeautifulSoup/bs4/doc/#installing-a-parser)” I was running Python 2.7.2, and ran into weird issues parsing the HTML using BeautifulSoup API until I installed the lxml parser. My next step might be to try to use lxml directly and bypass BeautifulSoup.

- If I were to use more of an XML-centric API ([lxml](http://lxml.de) in Python or another XML library in some other language), the one drawback with regard to web scraping is that many, if not most, web pages are not strictly XML-compliant.  I was able to easily work around this when I started to scrape the actual song/lyrics pages by using [PyTidyLib](http://countergram.com/open-source/pytidylib/docs/index.html), a Python wrapper around the time-tested [HTML Tidy](http://tidy.sourceforge.net) program.

- I wasn’t sure how to properly handle URLs at first without something like the [java.net.URL](http://docs.oracle.com/javase/7/docs/api/java/net/URL.html) class, but I was able to quickly find [urlparse.urljoin](http://docs.python.org/2/library/urlparse.html#urlparse.urljoin) in Python, which did the needed trick of constructing a URL from a base URL and the relative link contained in the HTML docs.

I think that is about it for now. I’ll finish up this script by having it download all of the songs and may then try some alternative approaches for the web scraping to compare/contrast. Then I need to extract the lyrics and other relevant info from the song/lyric pages themselves. Stay tuned for more info on that.
