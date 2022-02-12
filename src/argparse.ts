import { ArgumentParser } from 'argparse';
import {
  version as PackageVersion,
  description as PackageDescription,
} from '../package.json';

export interface FeedmakeOptions {
  repo: string;
  number: number;
  include_empty_commits: boolean;
  author_email: boolean;
}

export function parseArguments(): FeedmakeOptions {
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
  parser.add_argument('-a', '--author-email', {
    help: 'use Git author e-mail in RSS feed as <author> tag',
    action: 'store_true',
  });
  parser.add_argument('repo', {
    help: "Path to site's git repo",
    default: '.',
    nargs: '?',
  });

  return parser.parse_args() as FeedmakeOptions;
}
