export interface ImageDTO {
  dataString: string;
  aperture: number | null;
  model: string;
  make: string;
  exposureTime: number | null;
  focalLength: number | null;
  flash: string | null;
  width: number | null;
  height: number | null;
  path: string;
  ISOSpeed: string | null;
  modifyDate: Date | null;
  createDate: Date | null;
  latitude: number | null;
  longitude: number | null;
}
