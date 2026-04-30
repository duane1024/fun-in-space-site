---
title: "Project Miracle"
published: 2013-03-11
excerpt: "OK, I’ve started this blog in part to motivate me to put together a project that will allow me to tie together several different pieces of technology and subject matter that are of interest to me at the moment. I’d like to build an application that brings together some text processing (including basic text analysis/indexing […]"
legacyUrl: https://fun-in-space.com/2013/03/11/project-miracle/
featured: false
tags: []
draft: false
---

OK, I’ve started this blog in part to motivate me to put together a project that will allow me to tie together several different pieces of technology and subject matter that are of interest to me at the moment.

I’d like to build an application that brings together some text processing (including basic text analysis/indexing as well as natural language processing), data analysis (including experimenting with alternate types of data models), machine learning, and maybe some data visualization to make it all look pretty.

The subject matter I’m interested in is analyzing music, specifically songs from the rock group [Queen](https://www.queenonline.com).  I’d like to assemble a database of Queen songs, focusing initially on the ‘metadata’ for each song (track title, length, composer, release date, etc.) in addition to lyrics.  Later, I may add actual audio processing to the application, but for now, we’ll deal with the mostly structured data that consists of song metadata and of course the textual content of the lyrics.

For what purposes would this application be constructed?  In part, it’s to give me a reason to experiment with different technologies, but I do envision some potentially practical usages (‘practical’ may be a stretch if you’re not a devoted Queen fan, however).

First, a little bit of background.  In 1988, after a roughly two-year hiatus, Queen released the album ‘[The Miracle](https://www.queenonline.com/en/the-band/discography/miracle/)‘.  The song credits on that album were all attributed to Queen (that is [Freddie Mercury](https://www.queenonline.com/en/the-band/members/freddie-mercury/), [Brian May](https://www.queenonline.com/en/the-band/members/brian-may/), [Roger Taylor](https://www.queenonline.com/en/the-band/members/roger-taylor/) and [John Deacon](https://www.queenonline.com/en/the-band/members/john-deacon/)) as opposed to being credited to the member who initially had the idea for the song or wrote most of the lyrics as was previously the case.  This was in recognition of the fact that most of Queen’s songs had always been created collaboratively, i.e. all four members contributed something to the finished product (thus the inspiration for the somewhat creepy album cover shown below).  However, most songs still had a genesis with one of the band members and the Queen fan community has a fairly good idea from analysis and interviews conducted over the years to indicate which song was originally conceived by which band member (some are also assumed to be co-authored by two band members).  My question is: given a database of songs from other Queen albums, can we use so-called data science (for example: machine learning techniques), to predict who wrote a particular song?  Hence the inspiration for the project’s name: Project Miracle.  What information gives us the best hint as to who wrote a song?  Is it the lyrics (e.g. lyrical complexity) or musical key or time-signature or something else?

![](https://i0.wp.com/static.queenonline.com.s3.amazonaws.com/cms_page_media/uploads/the_miracle_resize_240_240.jpg)

More to come shortly.
