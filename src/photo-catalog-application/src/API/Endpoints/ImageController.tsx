import { Client } from "../Client/Client";
import { ImageMiniatureDto } from "../Models/ImageMiniatureDto";

const controllerName = "Image";

const getImage = async (): Promise<string> => {
  return Client("GET", `${controllerName}/test`);
};

const getMiniatures = async (): Promise<ImageMiniatureDto[]> => {
  return Client("GET", `${controllerName}`);
};

export { getImage, getMiniatures };
