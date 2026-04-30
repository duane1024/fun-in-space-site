---
title: "Hacking Clover with Apple’s new Swift programming language"
published: 2014-06-08
excerpt: "OK, it’s been a while since I’ve posted anything here on Fun in Space, but now I have something interesting to show. I experimented a bit with Apple’s new Swift programming language over the weekend and decided to try out accessing Clover’s web services (i.e. the stuff I work on during the day mostly) using […]"
legacyUrl: https://fun-in-space.com/2014/06/08/hacking-clover-with-apples-new-swift-programming-language/
featured: true
tags: []
draft: false
---

OK, it’s been a while since I’ve posted anything here on Fun in Space, but now I have something interesting to show.

I experimented a bit with Apple’s new [Swift programming language](https://developer.apple.com/swift/) over the weekend and decided to try out accessing [Clover’s web services](https://www.clover.com/docs/web-api) (i.e. the stuff I work on during the day mostly) using Swift as a scripting language, more or less.  Based on this [tweet](https://twitter.com/clattner_llvm/status/474593140511211520) from [Chris Lattner](https://www.nondot.org/sabre/), I decided to try out a simple script for accessing point-of-sale order information via the Clover API.

I’m pleased to report that the the experiment was successful and I had fun doing it.  The results are posted on Github [here](https://github.com/duane1024/clover-swiftlang).  A few notes:

- I’m quite amazed to see how much info there is on Swift already on the Internet.  After being announced on Monday (6 days ago as of the time I’m writing this), virtually all of the questions I needed help answering were addressed in some way in either the documentation or the discussions on Stack Overflow and other places with respect to Swift.

- I like the static typing and type inference, but accessing JSON data via [NSJSONSerialization](https://developer.apple.com/library/ios/documentation/foundation/reference/nsjsonserialization_class/Reference/Reference.html) was still a bit of a pain. If I were to develop a full-fledged Swift application, I’d probably use some type of data binding approach as we do in Java with the [Clover Android SDK](https://github.com/clover/clover-android-sdk).

- I got a few hints from the [Agent](https://github.com/hallas/agent) project, which provides a thin web request API on top of Swift.  I chose to use [NSURLSession](https://developer.apple.com/library/ios/documentation/Foundation/Reference/NSURLSession_class/Introduction/Introduction.html) instead of NSURLConnection that Agent uses, and this proved to be very straightforward.

- One part that was potentially quite tricky was that my script exited immediately before the NSURLSession tasks could be completed.  I had to dig up some old information from my brain (with some help from Stack Overflow and [this Gist](https://gist.github.com/atr000/621601)) and put in a manual [NSRunLoop](https://developer.apple.com/library/mac/documentation/cocoa/reference/foundation/classes/nsrunloop_class/reference/reference.html) to prevent the script from exiting until my tasks were completed.

- Passing in command line arguments to the script didn’t seem to work too well, so I relied on an environment variable (CLOVER_TOKEN) to pass in the authentication token to the script.

If anyone else accessing web services via Swift gives this a try and has any feedback, please let me know.
