import { SortBy } from '../../../../../core/dto/sort-by';
import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';

export class GetBlogsQueryInputDto extends BaseQueryParams {
  sortBy = SortBy.CreatedAt;
  searchNameTerm: string | null = null;
}
