import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {GithubdsDataSource} from '../datasources';

export interface GhQueryService {
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.

  // Add the three methods here.
  // Make sure the function names and the parameter names matches
  // the ones you defined in the datasource
  getIssuesByLabel(repo: string, label: string): Promise<QueryResponse>;
  getIssuesByURL(url: string): Promise<QueryResponse>;
  getIssuesWithQueryString(repo:string, querystring: string): Promise<QueryResponse>;
}

export interface QueryResponse {
  headers: any;
  body: QueryResponseBody;
}
export interface QueryResponseBody {
  total_count: number;
  items: IssueInfo[];
}

export class IssueInfo {
  title: string;
  html_url: string;
  state: string;
  created_at: string;
}


export class GhQueryServiceProvider implements Provider<GhQueryService> {
  constructor(
    // githubds must match the name property in the datasource json file
    @inject('datasources.githubds')
    protected dataSource: GithubdsDataSource = new GithubdsDataSource(),
  ) {}

  value(): Promise<GhQueryService> {
    return getService(this.dataSource);
  }
}
