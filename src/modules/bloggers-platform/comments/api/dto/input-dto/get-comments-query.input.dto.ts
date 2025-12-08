import { BaseQueryParams } from '../../../../../../core/dto/base.query-params.input-dto';
import { SortBy } from '../../../../../../core/dto/sort-by';

export class GetCommentsQueryInputDto extends BaseQueryParams {
  sortBy = SortBy.CreatedAt;
}
