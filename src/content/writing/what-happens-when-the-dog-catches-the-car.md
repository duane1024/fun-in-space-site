---
title: "What happens when the dog catches the car?"
published: 2018-12-21
excerpt: "I’m working on a new startup as I mentioned in my previous post, and as the technical co-founder, I am responsible for developing the first version of our product as a proof-of-concept or (ideally) as a functioning alpha/beta version that can be used with real customers to get feedback for our idea and business plan. […]"
legacyUrl: https://fun-in-space.com/2018/12/21/what-happens-when-the-dog-catches-the-car/
featured: true
tags: []
draft: false
---

I’m working on a new startup as I mentioned in my previous post, and as the technical co-founder, I am responsible for developing the first version of our product as a proof-of-concept or (ideally) as a functioning alpha/beta version that can be used with real customers to get feedback for our idea and business plan.

The basic architecture will be pretty standard: an iOS (and eventually Android) app, some backend services with a database, some integration with external/partner systems, and some limited web browser-based functionality. As a “greenfield” project, I have virtually no constraints with respect to how to build the solution, which programming languages to use, which cloud/deployment technology, etc.

In other words, I am the dog that finally caught up with the car that it had been chasing.

![animal-automobile-black-and-white-800522.jpg](https://funinspacedotcom.wordpress.com/wp-content/uploads/2018/12/animal-automobile-black-and-white-800522.jpg?w=4928&h=3264)

*What do I do now??*

I’m trying to be very disciplined about what decisions I’m making at this early stage, while at the same time trying not to put so much thought into things that I spend too much time trying to evaluate or justify a decision instead of just building something quickly that will work.

Here are a few different architecture/design/implementation decisions that I’m working on at the moment.

#### Deployment

Cloud deployments are all the fashion these days, and while I have some experience with public cloud providers, most of our deployments at my previous company used our own dedicated hardware in a hosted data center (IBM Softlayer), so our technical operations team had control over the entire stack. I think for my purposes, choosing one of the three major cloud providers (Microsoft, Google or Amazon) will make the most sense. But which one to choose and, for long term purposes, how to estimate cost? The services offered by the various cloud providers seem to be getting more sophisticated all the time. For example, who has heard of Amazon Quantum Ledger Database (QLDB), Amazon LumberYard, Amazon SageMaker? Most of these won’t be relevant for my application, but just wrapping your head around all of the offerings is daunting.

#### Backend Services

This should be the most straightforward part of the project for me, as I have a lot of experience here, and there are many mature frameworks for implementing web services. But there are some newer technologies to consider, such as Reactive Streams. The question of which programming language or environment to use is pretty crucial at this stage. I could do traditional Java web services with something like JAX-WS, or use a more popular Java-based framework such as [Spring Boot](https://spring.io/projects/spring-boot) for microservices. I could stay within the JVM ecosystem and use [Scala](https://scala-lang.org) or [Kotlin](https://kotlinlang.org) or [Clojure](https://clojure.org). (I attended a Kotlin meetup recently and the [Ktor](https://ktor.io) async web framework for Kotlin was discussed with some enthusiasm). Or I could venture into Node.JS territory and use [TypeScript](https://www.typescriptlang.org), thus allowing some synergy between potential front-end and back-end code to both leverage TypeScript. Or maybe write some services in [Go](https://golang.org). [Rust](https://www.rust-lang.org), anyone??

I have no doubt that any one of these languages, along with an accompanying framework, could be used successfully for implementing some basic web services. For the business, my longer term concern is more focused on people: how easy will it be to hire people to work on this code in the future and what will they cost? There are certainly talented programmers/engineers working in pretty much every language/environment these days, but will it be easier to hire Java developers or Scala developers? TypeScript developers or Go developers? Or do I want to simply focus on hiring the most talented people regardless of background.

I’m reminded of this quote from Guido van Rossum, the creator of [Python](https://www.python.org), from an [earlier post](https://fun-in-space.com/2013/04/26/recommended-read-masterminds-of-programming/):

> **Is there any characteristic that becomes fundamental to evaluate if we are looking for great Python programmers?**

**Guido:** *I’m afraid you are asking this from the perspective of the typical manager who simply wants to hire a bunch of Python programmers. I really don’t think there’s a simple answer, and in fact I think it’s probably the wrong question. You don’t want to hire Python programmers. You want to hire smart, creative, self-motivated people.*

#### End User Application

Our application will eventually target both iOS and Android, but for our target market, iOS will make sense to target initially. This seems like the easiest decision then — just use Xcode with Swift 4, et voilà, we’ll have a decent iOS app. But when we eventually want an Android app, do we then develop one from scratch in Java or Kotlin?

How about one of the cross-platform frameworks? [Multi-OS Engine](https://multi-os-engine.org) (anyone ever heard of that), [Xamarin](https://visualstudio.microsoft.com/xamarin/), [React Native](https://facebook.github.io/react-native/), [Flutter](https://flutter.io) (which uses [Dart](https://www.dartlang.org/) language)? Or perhaps just implement some shared logic using Kotlin and sharing with iOS using [Kotlin/Native](https://kotlinlang.org/docs/tutorials/native/mpp-ios-android.html)?

#### Services/System Integration Architecture

At my previous company, our reliability/consistency paradigm for services such as payments was enforced primarily via our MySQL data store, along with some use of Redis for deduplicating requests. This had some advantages in that it was easy to understand the contract for how transactions would or would not be reliable (in our context-specific sense) by just examining the code. OK, maybe examining the code really is not so easy in many cases.

I ran across [this post](https://jack-vanlightly.com/blog/2017/12/4/rabbitmq-vs-kafka-part-1-messaging-topologies) describing the differences between RabbitMQ (a traditional enterprise message queue) and Apache Kafka. I have been reading up on Apache Kafka and I know it’s becoming increasingly popular, and this article helped to elucidate some of the differences between Kafka and a traditional JMS-style message queueing solution.

I will post more here as I come to some decisions and implement some working code.
