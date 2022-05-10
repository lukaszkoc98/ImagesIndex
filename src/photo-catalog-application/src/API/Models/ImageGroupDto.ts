import { SortType } from "./SortEnum";

export interface ImageGroupDto {
  pageIndex: number;
  pageSize: number;
  apertureMin: number | null;
  apertureMax: number | null;
  makes: string[] | null;
  models: string[] | null;
  exposureTimeMin: number | null;
  exposureTimeMax: number | null;
  focalLengthMin: number | null;
  focalLengthMax: number | null;
  flashMin: number | null;
  flashMax: number | null;
  sortType: SortType | null;
}
