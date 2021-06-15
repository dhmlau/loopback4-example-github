import {Model, model, property} from '@loopback/repository';

@model()
export class ResultIssueInfo extends Model {
  @property({
    type: 'string',
  })
  title?: string;

  @property({
    type: 'string',
  })
  html_url?: string;

  @property({
    type: 'string',
  })
  state?: string;

  @property({
    type: 'number',
  })
  age?: number;


  constructor(data?: Partial<ResultIssueInfo>) {
    super(data);
  }
}

export interface ResultIssueInfoRelations {
  // describe navigational properties here
}

export type ResultIssueInfoWithRelations = ResultIssueInfo & ResultIssueInfoRelations;
