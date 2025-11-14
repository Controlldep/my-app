import { BaseQueryParams } from '../../../../../../core/dto/base.query-params.input-dto';
import { SortBy } from '../../../../../../core/dto/sort-by';

export class GetPostQueryInputDto extends BaseQueryParams {
  sortBy = SortBy.CreatedAt;
}
