---
title: "Installing MusicBrainz: was it all worth it?"
published: 2013-04-10
excerpt: "In my quest to acquire the definitive database of Queen songs for Project Miracle, I first thought of turning to MusicBrainz. MusicBrainz is, according to their website, “an open music encyclopedia that collects music metadata and makes it available to the public.” The important aspect of MusicBrainz is that it is completely open, so one […]"
legacyUrl: https://fun-in-space.com/2013/04/10/installing-musicbrainz-was-it-all-worth-it/
featured: false
tags: []
draft: false
---

In my quest to acquire the definitive database of Queen songs for [Project Miracle](https://fun-in-space.com/2013/03/11/project-miracle/), I first thought of turning to [MusicBrainz](https://musicbrainz.org). MusicBrainz is, according to their website, “an open music encyclopedia that collects music metadata and makes it available to the public.” The important aspect of MusicBrainz is that it is completely open, so one can download their database for free and easily query all of the music metadata contained therein.

That was my initial thought. I still haven’t quite made use of the MusicBrainz data yet, but I do have a working copy of the database on my machine. The process to get there was, at times, exasperating, frustrating, and most importantly, ridden with copious amounts of swearing. In other words, I was back in my element.

I kept a log of my progress in building the MusicBrainz server software, and I did get it all eventually built correctly so that I could import the database (which was all I wanted to do in the first place). I thought about just copying my raw notes here, but I will instead try to summarize in a more coherent form. Just to give a taste of the notes in raw form however, here are a few snippets:

> Couldn’t connect to postgres

I skipped the authentication steps in the install notes

That doesn’t matter right

> The data directory was created with PG 9.1 but that’s not compatible with PG 9.2

You’ve got to be shitting me

> Turns out it looks like i didn’t install icu-dev (icu4c via homebrew)

Yes I skipped that step earlier

When will I ever learn

So, back to the main story of installing MusicBrainz. Here are the steps I went through:

First, I [downloaded the MusicBrainz database](https://musicbrainz.org/doc/MusicBrainz_Database/Download).  At first I thought that perhaps I could simply import the database into PostgreSQL using some simple commands like *pg_restore*, but the README file contained in the archive with the database files said “you need a compatible version of the MusicBrainz server software” in order to import the database. So I proceeded to the [MusicBrainz Server Setup](https://musicbrainz.org/doc/MusicBrainz_Server/Setup) page and instead of downloading the easy-to-use virtual machine, I decided to grab the code from Git and build it all on my machine. What could go wrong?

I grabbed the code from the MusicBrainz git repository and proceeded to read through the INSTALL file to get things working correctly (again, in theory). The requirements called for Unix (Ubuntu was recommended, but I’m running on a Mac so I’m good–I thought), Perl, Postgres, memcached, and a version of GCC and Make. On Perl, I had a sufficiently recent version (5.12.4), and I was fine on GCC and Make. On PostgreSQL, it had been a few months since I had run it, so I decided to do an update using [Homebrew](https://mxcl.github.io/homebrew/) (package manager for Mac OS X). I upgraded from 9.1.4 to 9.2.3. Smart idea, right? Newer is always better? (Sorry for the blatant foreshadowing). Finally, I installed memcached even though I thought I just needed the database and I wouldn’t need the web server software running. Because I’m a completist, you see?

OK, now I’ve got all of the prerequisites loaded correctly. Now it’s time to edit the config files in MusicBrainz per the instructions. I edit lib/DBDefs.pm and update the variables MB_SERVER_ROOT, WEB_SERVER, and REPLICATION_TYPE to MB_STANDALONE. (As a side note, I take interest in noting that apparently people are still coding in Perl.)

Now the instructions say to install Carton, which is apparently some sort of Perl package manager. I enter *sudo cpan Carton*, which takes a while because I haven’t used Perl in ages. Perhaps I’ve never used it on this particular laptop. After installing Carton, I proceed with the instructions in the README to type *carton install –deployment*

I immediately receive an error ‘Can’t locate cpanfile’. Turns out the latest code from Git doesn’t have a cpanfile and I find from [this page](https://chatlogs.musicbrainz.org/musicbrainz-devel/2013/2013-03/2013-03-03.html#T14-57-31-855776) that I have to type *cat Makefile.PL | grep ^requires > cpanfile*

Thank goodness for searchable IRC chat logs. Why doesn’t someone update the Git repository so people don’t get this error? It’s open source, that’s why.

Anyway, now I am back to proceeding with the install. The Carton install runs mostly okay, but I do get some error about “Installing modules failed”. I never know whether to trust those types of error messages, so I proceed. I mean what could go wrong?

Turns out this database requires some specific extensions to PostgreSQL. So I guess I was right to install the software rather than trying to do a shortcut at importing the database without it. The first extension (unaccent) installs correctly, but the second extension (collate) fails because it can’t find *.* I decide that the second extension can’t be that important so I move on. Remember what I said about being a completist?

The next several steps involved trying to get my PostgreSQL database running correctly. If you read the excerpts from the raw notes above, you got a glimpse of what I went through. In short: don’t upgrade your PostgreSQL database unless you really have to. Versions such as 9.1 and 9.2 are not directly compatible. I attempted to run *pg_upgrade* but ended up giving up and reinitializing the database. The second lesson was that PostgreSQL access permissions are always a pain in the ass. I eventually had to grant the superuser privilege to the ‘postgres’ role. I think I did it with the ‘ALTER ROLE’ command. I can’t remember, but it seems like you have to do something different every time with PostgreSQL roles, privileges, access permissions, or pg_hba.conf.

Finally, the MusicBrainz Perl scripts were able to connect to my local PostgreSQL instance successfully and it turns out they really do need the collate extension. So I proceed to figure out why the collate extension won’t build. Turns out I skipped over the step where it said to install libicu-dev in the install instructions. That’s a Debian/Ubuntu specific name for the [ICU package](https://site.icu-project.org) which is a well-known library for handling Unicode. I search Homebrew and find icu4c and think everything is hunky dory. Re-run the MusicBrainz Perl scripts and, bam, still no worky. I eventually find out that [icu4c is a ‘keg-only’ module](https://github.com/mxcl/homebrew/issues/167) which means the commands and the libraries aren’t in the default path. I spent some time trying to figure out how to alter the build for the PostgreSQL collate extension by adding the ICU include libraries to the list of include directories and the ICU binaries to the path. Turns out you can easily augment the list of variables used by make like so: *make CFLAGS+=”-I /usr/local/Cellar/icu4c/50.1/include”*

Et voilà! After this step, the database install is able to proceed and I now have a fully populated MusicBrainz local database.  So the question remains: was it all worth it? For now, I’m not doing anything with the database, but I am working on the lyrics scraping scripts, which I’ll describe in the next post.
