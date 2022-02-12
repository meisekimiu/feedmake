import * as fs from 'fs';
import { FeedmakeOptions } from './argparse';

export function writeFeedToFile(options: FeedmakeOptions, feed: string): void {
  const path = `${options.repo}/${options.output}`;
  console.log(`Writing feed to file: ${path}`);
  fs.writeFileSync(path, feed);
  console.log(`Done!`);
}
