---
title: "More web scraping and fun with Java, Scala, XML libraries and XPath"
published: 2013-04-17
excerpt: "I’ve posted some more code to Github for Project Miracle and now have at least one alternative to Python for web scraping. I decided to use Scala for my second attempt, partly because I want to get better at writing Scala code, and partly because I thought that support for using XML/XHTML would be superior on […]"
legacyUrl: https://fun-in-space.com/2013/04/17/more-web-scraping-and-fun-with-java-scala-xml-libraries-and-xpath/
featured: false
tags:
  - "java"
  - "saxon"
  - "scala"
  - "xml"
  - "xpath"
draft: false
---

I’ve posted some more code to [Github](https://github.com/duane1024/miracle) for [Project Miracle](http://fun-in-space.com/category/project-miracle-2/) and now have at least one alternative to Python for web scraping. I decided to use [Scala](http://www.scala-lang.org) for my second attempt, partly because I want to get better at writing Scala code, and partly because I thought that support for using XML/XHTML would be superior on the JVM. This was true in a sense, but as with the Python code, things never seemed as straightforward as they should have been. I also got some more practice using [SBT](http://www.scala-sbt.org), which worked pretty well and was very easy to start using for a simple project.

To start with downloading the HTML, it’s as simple in Scala as one would like it to be:

val sb = new StringBuilder

for (line <- Source.fromURL(queenpediaSongList).getLines())

   sb.append(line).append(Properties.lineSeparator)

val songListHTML = sb.toString()

I download the HTML first so that I can perform any necessary pre-processing before the parsing steps. As it turns out the [Queenpedia Song List](http://queenpedia.com/index.php?title=Song_List) that I’ve been using as my test case has some malformed HTML, so I needed to clean that up before using an XML-based (or even strict HTML-based) parsing approach. I decided to try the [JTidy](http://jtidy.sourceforge.net) project which is a port of [HTML Tidy](http://tidy.sourceforge.net), which I had used in the Python code via [PyTidyLib](http://countergram.com/open-source/pytidylib/docs/index.html). The key word here, however, is *port*, which means that the behavior of the Java and the C libraries are not the same. It turns out that JTidy complains about a missing table summary or something like that, a feature mostly used for accessibility. The error message kindly suggests that I update the HTML document before running it through JTidy again. I thought that’s what you were supposed to be doing, JTidy!

A simple setting update to “force output” gets us past this step, but somewhere along the line, I was getting no results from the function call to clean up the original HTML. I experimented with using [Tagsoup](http://ccil.org/~cowan/XML/tagsoup/), an alternative library for cleaning up HTML, which seems to have a decent pedigree as it is used by [Apache Tika](http://tika.apache.org). I wasn’t seeming to have any luck with that, so I switched back to JTidy and created a new Java project in [IntelliJ IDEA](http://www.jetbrains.com/idea/) to test things out, just in case I was running into some idiosyncrasies with the Scala environment. With this project, I eventually got the results I wanted from JTidy and could get back to parsing the HTML/XHTML content.

At the same time I was trying to figure out what was going wrong with cleaning up the HTML, I was trying to decide which XML approach/library to use in parsing out the song list. As I mentioned in a [previous post](http://fun-in-space.com/2013/04/12/web-scraping-queenpedia-with-python/), I had already figured out a single-line XPath statement that would extract the relevant links from the main song list page.  It looked like this:

/html/body//div[@id="bodyContent"]/(table/tr/td/ul/li/a | ul/li/a)

Simple enough it seems. All I should need to do is instantiate some kind of XPathEvaluator object and evaluate this XPath statement against the cleaned up HTML string, et voilà. Right?

First, a note on the use of XML in Scala. Scala has [built-in support for XML](http://www.scala-lang.org/node/131), but that package is relatively notorious for being outdated and “beyond fixing”. The project [Anti-XML](http://anti-xml.org) was started by [Daniel Spiewak](https://twitter.com/djspiewak), who now works at [Precog](http://www.precog.com), as a clean-room replacement for Scala’s built-in XML support. The project looks promising but it looks like it hasn’t had any activity in over a year. The Scala Wiki contains information on other [alternative XML libraries](https://wiki.scala-lang.org/display/SW/Tools+and+Libraries#ToolsandLibraries-XML), the most promising of which seems to be [Scales Xml](http://code.google.com/p/scala-scales/). However, since I’m not familiar with any of these libraries, I decide to stay conservative and simply use the built-in Java XML libraries (i.e. [JAXP](http://jaxp.java.net)). That seems like a low-risk approach.

Low-risk and low-functioning approach as it turns out. To test out the XML/XHTML interactively, I’ve been using the excellent [<oXygen/> XML Editor](http://www.oxygenxml.com), which has first-class support for XPath and XQuery, including XPath 2.0. Turns out I’ve been building [XPath 2.0](http://www.w3.org/TR/xpath20/) expressions the whole time and Java’s built-in JAXP implementation does not support XPath 2.0. So I can either port my XPath statement back to be XPath 1.0 compliant or find a compatible XPath 2.0 library. After investigating [XOM](http://www.xom.nu) briefly (and wondering why I’d never really run across it in all my years of working with XML), I decide to go with Michael Kay’s wonderful [Saxon](http://saxon.sourceforge.net) library, which, for some unknown reason, appears to be one of the very few libraries actually implementing support for XPath 2.0 (and even [XPath 3.0](http://www.w3.org/TR/xpath-30/) in the commercial versions).

[![No, not that Saxon.](https://funinspacedotcom.wordpress.com/wp-content/uploads/2013/04/votesaxon-small.jpeg?w=150&h=212)](http://tardis.wikia.com/wiki/The_Master#As_Harold_Saxon)No, not that Saxon.

I briefly attempt to use Saxon via the normal [JAXP XPath APIs](http://docs.oracle.com/javase/7/docs/api/javax/xml/xpath/package-summary.html). After getting no love from this approach after tinkering for a while, I decide to use Saxon’s native API called [s9api](http://www.saxonica.com/documentation/xpath-api/s9api-xpath.xml). Using s9api, I initialize all of the required objects in 11 steps instead of 1, but I finally was able to extract the information I wanted from the HTML document.

Another interesting thing I learned while using the Saxon API was of a new feature in Scala 2.10 when converting between Java and Scala collections.  The result of [XPathSelector.evaluate()](http://www.saxonica.com/documentation/javadoc/net/sf/saxon/s9api/XPathSelector.html#evaluate()) in s9api is an [Iterable](http://docs.oracle.com/javase/7/docs/api/java/lang/Iterable.html)<[XdmItem](http://www.saxonica.com/documentation/javadoc/net/sf/saxon/s9api/XdmItem.html)>. In order to use the standard Scala for/foreach loop, I needed to convert to a Scala [Iterable](http://www.scala-lang.org/api/current/index.html#scala.collection.Iterable). Normally, this can be done by importing scala.collection.JavaConversions._

In Scala 2.10.1 (maybe before, I’m not sure), you can be more explicit about the implicit conversions you want to enable, so I used the following import statements instead:

import scala.language.implicitConversions

import scala.collection.convert.WrapAsScala.iterableAsScalaIterable

The final result, though not complete (it doesn’t extract the lyrics from the individual song pages yet), is viewable in the current Github repository. Am I satisfied with the results? For now, using Scala was unnecessary, but also didn’t cause any extra problems. I think it’s safe to say I was using Scala as simply a “better Java” with some easier syntax and relaxed rules on when static types need to be declared. But truthfully, I wrote most of the code that ended up working in Java using IntelliJ IDEA first. IntelliJ automates so much for you, you never really have to worry about what types to declare.

Next step may be to try using [Node.js](http://nodejs.org), then I will proceed to try to do something interesting with the data I’ve acquired.
