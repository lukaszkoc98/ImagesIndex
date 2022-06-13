import { ImageMiniatureDto } from './ImageMiniatureDto';

export interface PaginatedList {
  items: ImageMiniatureDto[];
  pageIndex: number;
  totalPages: number;
  totalCount: number;
}
