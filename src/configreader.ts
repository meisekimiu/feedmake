import * as fs from 'fs';
import * as xml2js from 'xml2js';
import { FeedmakeOptions } from './argparse';
import { RssFeed } from './feedbuilder';

export class ConfigReader {
  constructor(protected options: FeedmakeOptions) {}

  protected isFileFeedmakeConfig(file: string) {
    return file.match(/\.?feedmake\.(xml|rss|txt)/i);
  }

  public async getConfig(): Promise<RssFeed> {
    const files = fs.readdirSync(this.options.repo);
    for (const file of files) {
      if (this.isFileFeedmakeConfig(file)) {
        const feed = await this.readChannelFile(file);
        return this.validateFeed(feed);
      }
    }
    return this.validateFeed({});
  }

  protected validateFeed(feed: any): RssFeed {
    const baseFeed: RssFeed = {
      rss: {
        channel: [
          {
            title: '',
            link: '',
            description: '',
          },
        ],
      },
    };
    return Object.assign(baseFeed, feed) as RssFeed;
  }

  protected async readChannelFile(file: string): Promise<any> {
    const contents = fs.readFileSync(`${this.options.repo}/${file}`).toString();
    const parser = new xml2js.Parser();
    return await parser.parseStringPromise(contents);
  }
}
