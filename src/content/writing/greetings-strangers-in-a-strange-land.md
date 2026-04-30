---
title: "Greetings strangers (in a strange land)"
published: 2018-12-11
excerpt: "I’ve returned! After four years of silence here on Fun in Space, I’m going back to blogging. Let me catch you up with what’s been happening for me lately in the technium. I left Clover in June, and have been mostly traveling and doing a variety of non-work related things since then. I’m working on a […]"
legacyUrl: https://fun-in-space.com/2018/12/11/greetings-strangers-in-a-strange-land/
featured: true
tags: []
draft: false
---

I’ve returned!  After four years of silence here on Fun in Space, I’m going back to blogging.  Let me catch you up with what’s been happening for me lately in the [technium](https://www.edge.org/conversation/kevin_kelly-the-technium).

I left [Clover](https://www.clover.com) in June, and have been mostly traveling and doing a variety of non-work related things since then. I’m working on a new startup of my own now (with a co-founder), so more on that later.

I’ll see if I can cover some of the highlights of what I worked on while at Clover.

- We launched 6 hardware products, and a mobile POS solution called Clover Go.  The Clover Hub was a short-lived product (mentioned in passing in this [GigaOm article](https://gigaom.com/2013/10/09/after-a-quiet-year-clover-emerges-with-a-sexy-cash-register-a-new-owner/)) that combined a stock Android tablet (mostly [ASUS TF300T](https://en.wikipedia.org/wiki/Asus_Transformer_Pad_TF300T)) with a slightly customized Android operating system (it was based on [CyanogenMod](https://www.androidauthority.com/cyanogenmod-lineageos-654810/) if memory serves). Our first fully integrated hardware product was called Clover Station (now replaced by Clover Station 2018).  I helped to build an improved crash reporting system, and a new app for full service restaurants called ‘Tables’, built with my colleague Tamer. I also helped convert our Android build system to use Gradle, as I mentioned in a [previous post](https://fun-in-space.com/2013/07/07/fun-in-space-is-back-on-android-antlr-bonecp-and-gradle/).

- The next hardware products were the Clover Mobile (now discontinued) and [Clover Mini](https://www.clover.com/shop/clover-mini).  These products used the same internals in two different form factors.  These devices were also much more complicated than the Clover Station from an engineering standpoint. We had to deliver a much more customized (Android) operating system, embedded code (based on [FreeRTOS](https://www.freertos.org)) that ran on a custom board using a [Maxim 32550](https://www.maximintegrated.com/en/products/microcontrollers/MAX32550.html) secure microcontroller, and a whole suite of new user-facing and background applications. The core payment applications had to support both [EMV](https://www.emvco.com) and [NFC](https://en.wikipedia.org/wiki/Near-field_communication) standards, and I worked a lot on the payment subsystem in the embedded code, Android code, and web services that communicated with our payment processing partners.

- I helped launch Clover in United Kingdom and Republic of Ireland in early 2014, and later helped to lead the effort to bring Clover to [Germany, Austria](https://www.businesswire.com/news/home/20180226006653/en/Data-Launches-Clover™-Mini-Clover™-Flex-Germany), and [Argentina](https://www.businesswire.com/news/home/20181120005815/en/). (I also did some early work on Clover Canada project, but my colleagues did most of the work there). A lot of this work was in getting the devices certified with EMVCo Level 1 and Level 2 (I could write a whole series of articles on that), acquirer-level certification, and what we would call scheme certification (usually tests developed by MasterCard, Visa, American Express, Discover and other card scheme/associations).

- I published the first version of our [Clover Android SDK](https://github.com/clover/clover-android-sdk) to coincide with [TechCrunch Disrupt SF Hackathon 2013](https://techcrunch.com/events/disrupt-sf-hackathon-2013/). This SDK allows developers to build apps that will run on a Clover device and take advantage of the core services that we built to support the point-of-sale experience, including employee and customer management, order information, catalog and inventory management, and core payments.

- I built a team to deliver a new set of SDKs for integrating with Clover devices from an external system, including SDKs for [Windows](https://github.com/clover/remote-pay-windows) (built using C#/.NET), [Android](https://github.com/clover/remote-pay-android), [iOS](https://github.com/clover/remote-pay-ios), [Java](https://github.com/clover/remote-pay-java), and [Javascript](https://github.com/clover/remote-pay-cloud). [Booker](https://www.booker.com) was an early partner that my colleague Mike and I worked with who integrated with our Javascript/cloud offering.

- I led a project to integrate Clover with Google’s SmartTap functionality and presented the architecture at the [New York Google Developer Group meetup](https://www.meetup.com/gdgnyc/events/241721980/). This was a fun project that was also [demonstrated on-stage at Google I/O](https://www.youtube.com/watch?v=u39By1LMyv4) by my CEO John Beatty. This also was a predecessor to updating Clover to work with Apple NFC Value-Added Services (VAS).

- I did a lot of work to help scale our server infrastructure, mostly as team lead prioritizing the areas in which we introduced additional caching (via Redis, haproxy/nginx, memcached, Guava in-memory cache, etc.), optimized database queries, and updated our client architecture to more effectively distribute query load over time and prevent accidental spikes in requests that would overload the server.

Those are the highlights, I’m sure I’ll have some more topics from the Clover days to revisit in the future.  My next post will cover some of the things that I’m researching while working on my new startup. It’s still a bit cloudy but, boy, when we get there…
