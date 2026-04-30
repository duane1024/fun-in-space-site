---
title: "Fun in Space is back: On Android, ANTLR, BoneCP, and Gradle"
published: 2013-07-07
excerpt: "I’ve been away from blogging for a while, but I promise I have a good excuse. Shortly after my last post at the end of April, I flew to California for a job interview, and shortly after that, I got a job offer, and shortly after that, I accepted and, well, you get the point. […]"
legacyUrl: https://fun-in-space.com/2013/07/07/fun-in-space-is-back-on-android-antlr-bonecp-and-gradle/
featured: false
tags: []
draft: false
---

I’ve been away from blogging for a while, but I promise I have a good excuse.  Shortly after my last post at the end of April, I flew to California for a job interview, and shortly after that, I got a job offer, and shortly after that, I accepted and, well, you get the point.

I’m now working for a recent startup called [Clover](https://www.clover.com) in Mountain View, CA and working on some pretty cool stuff. I’m sure I will be able to share some more details about our architecture over time.

In the meantime, here are a few things I’ve been working on or learning more about recently:

- [Android Development](https://developer.android.com/index.html) – For all of the Apple computers and devices that I own, not to mention the incredible amount of money I’ve spent on the Apple/iTunes ecosystem, it seems a little surprising that I would end up working for a company for whom one of the main focuses is developing an Android-based platform for point-of-sale devices, but anyway, here I am. In the past week I developed my first simple Android app, mostly focusing on synchronization of data between back-end web services and Android’s local SQLite database.

- [BoneCP](https://jolbox.com) – In attempting to track down an issue with long-running database connections being closed by our firewall, I developed some tests for the BoneCP connection pooling framework (see [here](https://github.com/duane1024/bonecp-test)). Nothing conclusive yet, but the behavior with regard to properly closing connections doesn’t seem quite right to me and the newest beta versions of BoneCP seem to behave even worse. I’ll write up a separate blog post on that later once I have some more definitive data.

- [ANTLR](https://www.antlr.org) – Starting to get up to speed on the ANTLR parser generator in hopes of using it for a combined web service testing and documentation framework. Overall goal is to automate both documenting and testing our web services so we don’t have multiple files to update when adding or changing part of our web service API. Also have been reading [The Definitive ANTLR4 Reference](https://pragprog.com/book/tpantlr2/the-definitive-antlr-4-reference) and [Language Implementation Patterns](https://pragprog.com/book/tpdsl/language-implementation-patterns), both by [Terence Parr](https://www.cs.usfca.edu/~parrt/), creator of ANTLR.

- [Gradle](https://www.gradle.org) – I’ve been reading more about Gradle this weekend, in part because the [Android SDK is moving to Gradle](https://tools.android.com/tech-docs/new-build-system/user-guide), and of course, since IntelliJ IDEA now has [good Gradle support](https://blogs.jetbrains.com/idea/2013/04/gradle-improvements-at-121/), it is certainly worth checking out. My preliminary assessment is that it has a lot of promise and seems to represent a good evolution in a build tool leveraging the best practices from Ant+Ivy and Maven.

That’s it from me for now. Stay tuned for more updates from sunny California.
