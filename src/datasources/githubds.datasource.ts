import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'githubds',
  connector: 'rest',
  baseURL: 'https://api.github.ibm.com',
  crud: false,
  options: {
    headers: {
      accept: 'application/json',
      Authorization: process.env.TOKEN,
      'User-Agent': 'loopback4-example-github',
      'X-RateLimit-Limit': 5000,
      'content-type': 'application/json'
    }
  },
  operations: [
    {
      template: {
        method: 'GET',
        fullResponse: true,
        url: 'https://api.github.com/search/issues?q=repo:{repo}+label:"{label}"'
      },
      functions: {
        getIssuesByLabel: ['repo','label']
      }
    }, {
      template: {
        method: 'GET',
        fullResponse: true,
        url: '{url}'
      },
      functions: {
        getIssuesByURL: ['url']
      }
    }, {
      template: {
        method: 'GET',
        fullResponse: true,
        url: 'https://api.github.com/search/issues?q=repo:{repo}+{querystring}'
      },
      functions: {
        getIssuesWithQueryString: ['repo','querystring']
      }
    }
  ]
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class GithubdsDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'githubds';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.githubds', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
