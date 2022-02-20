import gitlog from 'gitlog';
import { DateTime } from 'luxon';

import { FeedmakeOptions } from './argparse';

export interface GitCommit {
  authorDate: DateTime;
  authorEmail: string;
  authorName: string;
  body: string;
  hash: string;
  subject: string;
}

export class FeedmakeGitlog {
  constructor(protected options: FeedmakeOptions) {}

  protected getDatetime(date: string): DateTime {
    const methods = [
      DateTime.fromSQL,
      DateTime.fromRFC2822,
      DateTime.fromISO,
      (str: string) => DateTime.fromJSDate(new Date(str)),
    ];
    for (const method of methods) {
      const dt = method(date);
      if (dt.isValid) {
        return dt;
      }
    }
    return DateTime.fromJSDate(new Date());
  }

  public getCommits(): GitCommit[] {
    return gitlog({
      repo: this.options.repo,
      number: 100,
      fields: [
        'subject',
        'body',
        'authorName',
        'authorDate',
        'hash',
        'authorEmail',
      ],
    })
      .filter((commit) => {
        let returnVal = true;
        if (!this.options.include_empty_commits) {
          returnVal = commit.files.length > 0;
        }
        if (!this.options.include_minor_changes) {
          returnVal = returnVal && !commit.subject.match(/^(m:|minor)/i);
        }
        return returnVal;
      })
      .slice(0, this.options.number)
      .map((commit) => {
        const { authorName, authorEmail, body, hash, subject } = commit;
        const authorDate = this.getDatetime(commit.authorDate);
        return {
          authorDate,
          authorName,
          authorEmail,
          body,
          hash,
          subject,
        };
      });
  }
}
