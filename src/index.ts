#!/usr/bin/env ts-node
import { ArgumentParser } from 'argparse';
import gitlog from 'gitlog';
import * as fs from 'fs';
import * as xml2js from 'xml2js';
import {
  version as PackageVersion,
  description as PackageDescription,
} from '../package.json';

const parser = new ArgumentParser({
  description: PackageDescription,
});

parser.add_argument('-v', '--version', {
  action: 'version',
  version: PackageVersion,
});
parser.add_argument('-n', '--number', {
  help: 'number of commits to include in feed',
  default: 10,
  type: Number,
});
parser.add_argument('-e', '--include-empty-commits', {
  help: 'include empty commits such as merge commits',
  action: 'store_true',
});
parser.add_argument('repo', {
  help: "Path to site's git repo",
  default: '.',
  nargs: '?',
});

interface FeedmakeOptions {
  repo: string;
  number: number;
  include_empty_commits: boolean;
}

function constructChannel(commitz: ReturnType<typeof gitlog>, channel: any) {
  const items = commitz.map((commit: any) => ({
    title: commit.subject,
    guid: {
      _: commit.hash,
      $: { isPermalink: false },
    },
    author: commit.authorName,
    pubDate: commit.authorDate,
  }));
  const potato = channel;
  potato.items = items;
  return potato;
}

const options = parser.parse_args() as FeedmakeOptions;
// console.log(options);
const commits = gitlog({
  repo: options.repo,
  number: options.number,
  fields: [
    'subject',
    'body',
    'authorName',
    'authorDate',
    'hash',
    'authorEmail',
  ],
}).filter((commit) => {
  if (!options.include_empty_commits) {
    return commit.files.length > 0;
  }
  return true;
});
const files = fs.readdirSync(options.repo);
for (const file of files) {
  if (file.match(/\.?feedmake\.(xml|rss|txt)/i)) {
    const contents = fs.readFileSync(`${options.repo}/${file}`).toString();
    const xparser = new xml2js.Parser();
    xparser
      .parseStringPromise(contents)
      .then((result) => {
        const potato = result;
        potato.rss.channel[0].generator = `Feedmake v${PackageVersion}`;
        constructChannel(commits, potato.rss.channel[0]);
        const builder = new xml2js.Builder();
        console.log(builder.buildObject(potato));
      })
      .catch(() => {
        console.error('Invalid result');
      });
  }
}
// console.log(files);
// console.log(commits);
