import { ArgumentParser } from 'argparse';
import packageJson from '../package.json' assert { type: 'json' };

const PackageDescription = packageJson.description;
const PackageVersion = packageJson.version;
export interface FeedmakeOptions {
  repo: string;
  number: number;
  include_empty_commits: boolean;
  author_email: boolean;
  include_minor_changes: boolean;
  output: string;
  format_markdown: boolean;
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
  parser.add_argument('-o', '--output', {
    help: 'name of output file',
    default: 'rss.xml',
    type: String,
  });
  parser.add_argument('-m', '--include-minor-changes', {
    help: 'include commits tagged as "minor" in the feed',
    action: 'store_true',
  });
  parser.add_argument('-f', '--format-markdown', {
    help: 'format markdown in commit bodies',
    action: 'store_true',
  });
  parser.add_argument('repo', {
    help: "Path to site's git repo",
    default: '.',
    nargs: '?',
  });

  return parser.parse_args() as FeedmakeOptions;
}
