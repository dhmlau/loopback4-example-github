// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/context';
import {get, param} from '@loopback/openapi-v3';
import {GhQueryService, IssueInfo, QueryResponse} from '../services';

// import {inject} from '@loopback/core';


export class GhQueryController {
  // inject the GhQueryService service proxy
  constructor(@inject('services.GhQueryService') protected queryService:GhQueryService) {}

  // create the API that get the issues by providing:
  // repo: <GitHub org>/<GitHub repo>. For example, `strongloop/loopback-next`
  // label: If it has special characters, you need to escape it.
  // For example, if the label is "help wanted", it will be "help+wanted".
  @get('/issues/repo/{repo}/label/{label}')
  async getIssuesByLabel(
    @param.path.string('repo') repo: string,
    @param.path.string('label') label:string): Promise<QueryResult> {
    let result:QueryResponse = await this.queryService.getIssuesByLabel(repo, label);
    let queryResult = new QueryResult();
    queryResult.items = [];
    queryResult.total_count = result.body.total_count;
    result.body.items.forEach(issue => {
      this.addToResult(issue, queryResult);
    });

    // check if there is next page of the results
    const nextLink = this.getNextLink(result.headers.link);
    if (nextLink == null) return queryResult;
    await this.getIssueByURL(nextLink, this.queryService, queryResult);
    return queryResult;
  }

  /**
   * Get issues from URL
   * @param nextLinkURL
   * @param queryService
   * @param queryResult
   * @returns
   */
  async getIssueByURL(nextLinkURL: string, queryService: GhQueryService, queryResult:QueryResult) {
    let result = await queryService.getIssuesByURL(nextLinkURL);
    result.body.items.forEach(issue => {
      this.addToResult(issue, queryResult);
    });

    const nextLink2 = this.getNextLink(result.headers.link);
    if (nextLink2 == null) return;
    await this.getIssueByURL(nextLink2, queryService, queryResult);
  }

  /**
* Get the URL for the "next" page.
* The Link header is in the format of:
* Link: <https://api.github.com/search/code?q=addClass+user%3Amozilla&page=2>; rel="next",
  <https://api.github.com/search/code?q=addClass+user%3Amozilla&page=34>; rel="last"
* @param link
* @returns
*/
getNextLink(link: string): string|null {
  if (link == undefined) return null;

  let tokens: string[] = link.split(',');
  let url: string|null = null;

  tokens.forEach(token => {
    if (token.indexOf('rel="next"')!=-1) {
      url = token.substring(token.indexOf('<')+1, token.indexOf(';')-1);
    }
  });

  return url;
 }
  /**
   * Add the issue to the QueryResult object
   * @param issue
   * @param queryResult
   */
  addToResult(issue: IssueInfo, queryResult: QueryResult) {
    let issueInfo:ResultIssueInfo = new ResultIssueInfo();
      issueInfo.html_url = issue.html_url;
      issueInfo.title = issue.title;
      issueInfo.state = issue.state;
      issueInfo.age = this.getIssueAge(issue.created_at);
      queryResult.items.push(issueInfo);
  }
  /**
   * Calculate the age of the issue
   * i.e. take today's date and find the number of days difference from
   * the issue creation date
   * @param created_at
   * @returns
   */
  getIssueAge(created_at: string): number {
    let todayDate: Date = new Date();
    let createDate: Date = new Date(created_at);
    let differenceInTime = todayDate.getTime() - createDate.getTime();

    //get the difference in day
    return Math.floor(differenceInTime / (1000 * 3600 * 24));
  }
}



/**
 * QueryResult
 */
class QueryResult {
  total_count: number;
  items: ResultIssueInfo[];
}

class ResultIssueInfo {
  title: string;
  html_url: string;
  state: string;
  age: number;
}
