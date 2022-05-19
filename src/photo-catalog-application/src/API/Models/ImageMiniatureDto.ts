export interface ImageMiniatureDto {
  path: string;
  name: string;
  stringData: string;
  latitude: number | null;
  longitude: number | null;
  makes: string[];
  models: string[];
}
