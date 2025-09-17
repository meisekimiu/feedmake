import * as xml2js from 'xml2js';
import { DateTime } from 'luxon';
import packageJson from '../package.json' assert { type: 'json' };
import { FeedmakeOptions } from './argparse.js';
import { GitCommit } from './gitlog.js';
import { micromark } from 'micromark';

const PackageVersion = packageJson.version;

export interface RssFeed {
  rss: {
    channel: RssChannel[];
  };
}

export interface RssChannel {
  title: string;
  link: string;
  description: string;
  pubDate?: string;
  lastBuildDate?: string;
  generator?: string;
  item?: RssItem[];
}

export interface RssItem {
  title: string;
  description?: string;
  guid: RssGuid;
  author?: string;
  pubDate: string;
}

class RssGuid {
  public _: string;
  public $ = {
    isPermaLink: false,
  };

  constructor(hash: string) {
    this._ = hash;
  }
}

export class FeedBuilder {
  protected items: RssItem[];
  protected feed: RssFeed;

  constructor(
    protected options: FeedmakeOptions,
    commits: GitCommit[],
    feed: RssFeed
  ) {
    this.items = this.convertCommits(commits);
    this.feed = feed;
  }

  protected convertCommits(commits: GitCommit[]): RssItem[] {
    return commits.map((commit) => {
      const item: RssItem = {
        title: commit.subject,
        guid: new RssGuid(commit.hash),
        pubDate: commit.authorDate.toRFC2822(),
      };
      if (commit.body) {
        item.description = commit.body.trim();
        if (this.options.format_markdown) {
          item.description = micromark(item.description, 'utf8', {
            allowDangerousHtml: true,
          });
        }
      }
      if (this.options.author_email) {
        item.author = commit.authorEmail;
      }
      return item;
    });
  }

  public buildFeed(): string {
    this.feed.rss.channel[0].pubDate = DateTime.fromJSDate(
      new Date()
    ).toRFC2822();
    if (this.items.length > 0) {
      this.feed.rss.channel[0].lastBuildDate = this.items[0].pubDate;
    } else {
      this.feed.rss.channel[0].lastBuildDate = this.feed.rss.channel[0].pubDate;
    }
    this.feed.rss.channel[0].generator = `Feedmake v${PackageVersion} (https://github.com/meisekimiu/feedmake)`;
    this.feed.rss.channel[0].item = this.items;
    const builder = new xml2js.Builder({
      cdata: this.options.format_markdown,
    });
    return builder.buildObject(this.feed);
  }
}
