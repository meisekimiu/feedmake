# feedmake
Feedmake is a utility that reads a Git log and converts it into an RSS feed.

Currently, the program is still in a kind of "beta" version, and is not published to npm yet. However, you can still run packages from Github, so the following installation command should work:
```
npm install -g meisekimiu/feedmake
feedmake --help
```

Alternatively, you can run it without installing, though it's slower and has to run `npm install` and such every time you run it:
```
npx meisekimiu/feedmake --help
```

## How 2 Uze
To use Feedmake, run the command and supply it with a path to a git repository. It will then generate the RSS feed in the repo's directory. However, to generate a full RSS feed, you'll need a base XML template for Feedmake to build off of.

Feedmake automatically scans the git repo's directory for a `feedmake.xml` file, which should contain a basic RSS feed with no items. In this config file, you can add the `<channel>` name, description, image, etc, for your website.

See the `feedmake.xml` file in this repo for an example of how it looks like (fun fact, if you clone this repo, you can run Feedmake on its own Git repo!).

## Why is this even a program?
The real idea behind this program is to generate RSS feeds for static websites. I've become a fan of small, personal, and static websites handwritten in basic HTML and I want more of them to come into existence. But... one thing social media has over decentralized websites is that you can follow friends and be notified whenever they make updates. Without an RSS feed, a personal website has to intentionally include some kind of changelog or journal to be updated, and even then, you still have to manually check it.

(Unless you're on [Neocities](https://neocities.org/), they actually have a follow function if you have an account! But wouldn't it be great if you could follow *any* static website *without* creating an account anywhere?)

Feedmake came from my desire to be able to make a static website you can subscribe to and hopefully make it easier for others to do the same! It's still *some* work to get this working, but hopefully it's easier than handwriting an RSS feed.
