#!/usr/bin/env ts-node
import { parseArguments } from './argparse';
import { FeedmakeGitlog } from './gitlog';
import { ConfigReader } from './configreader';
import { FeedBuilder } from './feedbuilder';
import { writeFeedToFile } from './feedwriter';

const options = parseArguments();
const git = new FeedmakeGitlog(options);
const commits = git.getCommits();

const configReader = new ConfigReader(options);

configReader
  .getConfig()
  .then((feed) => {
    const feedBuilder = new FeedBuilder(options, commits, feed);
    writeFeedToFile(options, feedBuilder.buildFeed());
  })
  .catch((error) => console.error(error));
