export interface ImageDTO {
  dataString: string;
  aperture: number | null;
  model: string;
  make: string;
  exposureTime: number | null;
  focalLength: number | null;
  flash: number | null;
  width: number | null;
  height: number | null;
  path: string;
  ISOSpeed: number | null;
  modifyDate: Date | null;
  createDate: Date | null;
  latitude: number | null;
  longitude: number | null;
}
