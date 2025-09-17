import { parseArguments } from './argparse.js';
import { FeedmakeGitlog } from './gitlog.js';
import { ConfigReader } from './configreader.js';
import { FeedBuilder } from './feedbuilder.js';
import { writeFeedToFile } from './feedwriter.js';

const options = parseArguments();
const git = new FeedmakeGitlog(options);

git
  .getCommits()
  .then((commits) => {
    const configReader = new ConfigReader(options);

    configReader
      .getConfig()
      .then((feed) => {
        const feedBuilder = new FeedBuilder(options, commits, feed);
        writeFeedToFile(options, feedBuilder.buildFeed());
      })
      .catch((error) => console.error(error));
  })
  .catch((error) => console.error(error));
