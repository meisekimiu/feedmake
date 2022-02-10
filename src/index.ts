#!/usr/bin/env ts-node
import { ArgumentParser } from 'argparse';
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
parser.add_argument('repo', { help: "Path to site's git repo" });

console.dir(parser.parse_args());
