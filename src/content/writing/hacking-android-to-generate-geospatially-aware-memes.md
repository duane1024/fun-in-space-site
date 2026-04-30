---
title: "Hacking Android to generate geospatially-aware memes"
published: 2013-11-17
excerpt: "I attended Google’s Android Hackathon yesterday on the Google campus. The challenge for this hackathon was to build an Android app to generate memes. Because if there’s one thing the world needs more of, it is definitely meme-generating apps. OK, maybe not, but anyway, that was how the guidelines were presented. I originally wanted to […]"
legacyUrl: https://fun-in-space.com/2013/11/17/hacking-android-to-generate-geospatially-aware-memes/
featured: false
tags: []
draft: false
---

I attended Google’s [Android Hackathon](https://sites.google.com/site/androidhackathon2013/home) yesterday on the Google campus. The challenge for this hackathon was to build an Android app to generate memes. Because if there’s one thing the world needs more of, it is definitely meme-generating apps. OK, maybe not, but anyway, that was how the guidelines were presented. I originally wanted to do something interesting with communication between multiple devices. When I arrived at the hackathon, however, the battery on my Nexus 7 tablet was fully drained. I only had my ASUS TF300 tablet from work fully charged, but I didn’t have a USB cable for that in my backpack, so I figured I needed to get more creative.

My fallback idea was to do something related to natural language processing. This turned out to be a theme that a few of the hackathon winners pursued as well (spoiler alert: that list of winners did not include me). At first, I wondered if I could run one of the existing Java or Python-based NLP toolkits directly on Android. I have some experience with [GATE](https://gate.ac.uk), the General Architecture for Text Engineering developed at the University of Sheffield, [Apache OpenNLP](https://opennlp.apache.org), and [NLTK](https://nltk.org), a Python-based NLP library. In my fifteen or so minutes of research, I determined that getting any of these to run on Android would probably consume most of the time I had during the day, so I decided to stretch the hackathon rules a bit and develop a simple web service that my Android app could use. This turned out to be the bulk of the ‘interesting’ code that I wrote, which took about 1 hour, and of course the rest of the time (6 hours or so) I spent fiddling getting my Android UI to do something useful.

The web service I developed used [JAX-RS](https://jax-rs-spec.java.net) and I decided to leverage the tools provided by IntelliJ IDEA to generate a simple skeleton web service for me using JAX-RS and [Jersey](https://jersey.java.net). This was quite handy and I had a simple “hello world” web service running in less than a minute. I decided to resurrect some ideas that I’ve either been interested in or worked on in some capacity in previous projects, so I built a service that would extract a place name from a given URL.  The basic idea is to run a document (URL) through an NLP toolkit and extract a list of place names. I then just performed a simple count and picked the place name that occurred most often in the document. The fancy name for this is *geospatial named-entity recognition*. I ended up using GATE, because it was the toolkit with which I was most familiar. GATE has a plugin called [ANNIE](https://gate.ac.uk/sale/tao/splitch6.html#chap:annie) (A Nearly-New Information Extraction system), which did most of the work. GATE/ANNIE uses primarily a rules-based approach to NLP, rather than statistical or machine-learning based NLP, which basically means that you don’t need to train the NLP engine with a large corpus of existing documents. The downside to the rules-based approach is that you end up needing to have rather sophisticated rulesets. Luckily, a good set of default rulesets for recognizing common entities like places, organizations, and locations is bundled with GATE/ANNIE. The only modification I made to the out-of-the-box ANNIE configuration was to include ‘Mountain View’ in the list of city names that it recognized by default.

So, the basic format for the service was to take a URL and return the place name that was referenced most often in the document. A simple test looked like this:

 ⚀ ~ $ curl "http://localhost:9998/memegen?url=http://en.wikipedia.org/wiki/France"

France

OK, so the basics of taking any given URL and extracting out a place name were taken care of. I then proceeded to build my Android app that would generate memes. Now, I will be the first to admit that generating Android UIs is not exactly my specialty. Nonetheless, I managed to come up with something that I thought looked halfway decent. The end result is not terribly useful, but then, I guess most meme generators aren’t really meant to be useful, they are just meant to entertain, right?  For the memes themselves, I simply mapped a place name to a previously defined phrase to be used for that place.

Here is the default layout of my finished Android app:

[![screen](https://funinspacedotcom.wordpress.com/wp-content/uploads/2013/11/screen.png?w=93&h=150)](https://funinspacedotcom.wordpress.com/wp-content/uploads/2013/11/screen.png)

And here are the resulting memes, all copyrighted by yours truly.

[![meme1](https://funinspacedotcom.wordpress.com/wp-content/uploads/2013/11/meme11.png?w=150&h=112)](https://funinspacedotcom.wordpress.com/wp-content/uploads/2013/11/meme11.png)  [![meme2](https://funinspacedotcom.wordpress.com/wp-content/uploads/2013/11/meme21.png?w=150&h=112)](https://funinspacedotcom.wordpress.com/wp-content/uploads/2013/11/meme21.png)  [![meme3](https://funinspacedotcom.wordpress.com/wp-content/uploads/2013/11/meme31.png?w=150&h=112)](https://funinspacedotcom.wordpress.com/wp-content/uploads/2013/11/meme31.png)  [![meme4](https://funinspacedotcom.wordpress.com/wp-content/uploads/2013/11/meme41.png?w=150&h=112)](https://funinspacedotcom.wordpress.com/wp-content/uploads/2013/11/meme41.png)  [![meme5](https://funinspacedotcom.wordpress.com/wp-content/uploads/2013/11/meme51.png?w=150&h=112)](https://funinspacedotcom.wordpress.com/wp-content/uploads/2013/11/meme51.png)  [![meme6](https://funinspacedotcom.wordpress.com/wp-content/uploads/2013/11/meme61.png?w=150&h=112)](https://funinspacedotcom.wordpress.com/wp-content/uploads/2013/11/meme61.png)

If I didn’t already have a witty phrase associated with that place name:

[![meme7](https://funinspacedotcom.wordpress.com/wp-content/uploads/2013/11/meme71.png?w=150&h=112)](https://funinspacedotcom.wordpress.com/wp-content/uploads/2013/11/meme71.png)

And if no place name can be recognized:

[![meme8](https://funinspacedotcom.wordpress.com/wp-content/uploads/2013/11/meme81.png?w=150&h=112)](https://funinspacedotcom.wordpress.com/wp-content/uploads/2013/11/meme81.png)
