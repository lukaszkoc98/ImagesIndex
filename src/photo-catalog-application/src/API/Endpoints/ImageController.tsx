import axios from "axios";
import { Client } from "../Client/Client";
import { ImageDTO } from "../Models/ImageDto";
import { ImageGroupDto } from "../Models/ImageGroupDto";
import { ImageMiniatureDto } from "../Models/ImageMiniatureDto";
import { UpdateImageDto } from "../Models/UpdateImageDto";

const controllerName = "Image";
const apiUrl = "https://localhost:44301/api";

const getImage = async (path: string): Promise<ImageDTO> => {
  console.log(path);
  return Client("GET", `${controllerName}/path?path=` + path, {}, {});
};

const getMiniatures = async (
  body: ImageGroupDto
): Promise<ImageMiniatureDto[]> => {
  return Client("POST", `${controllerName}`, { body });
};

const uploadImage = async (formData: FormData): Promise<null> => {
  const response = axios.post(
    `${apiUrl}/${controllerName}/upload-file`,
    formData
  );
  return (await response).data;
};

const updateImage = async (body: UpdateImageDto): Promise<null> => {
  return Client("PUT", `${controllerName}`, { body });
};

export { getImage, getMiniatures, uploadImage, updateImage };
