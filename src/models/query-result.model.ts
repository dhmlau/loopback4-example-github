import {Model, model, property} from '@loopback/repository';
import {ResultIssueInfo} from './result-issue-info.model';

@model()
export class QueryResult extends Model {
  @property({
    type: 'number',
  })
  total_count?: number;

  @property.array(ResultIssueInfo)
  items?: ResultIssueInfo[];


  constructor(data?: Partial<QueryResult>) {
    super(data);
  }
}

export interface QueryResultRelations {
  // describe navigational properties here
}

export type QueryResultWithRelations = QueryResult & QueryResultRelations;
