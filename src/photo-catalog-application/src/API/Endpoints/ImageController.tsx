import axios from "axios";
import { Client } from "../Client/Client";
import { ImageMiniatureDto } from "../Models/ImageMiniatureDto";

const controllerName = "Image";
const apiUrl = "https://localhost:44301/api";

const getImage = async (): Promise<string> => {
  return Client("GET", `${controllerName}/test`);
};

const getMiniatures = async (): Promise<ImageMiniatureDto[]> => {
  return Client("GET", `${controllerName}`);
};

const uploadImage = async (formData: FormData): Promise<null> => {
  const response = axios.post(
    `${apiUrl}/${controllerName}/upload-file`,
    formData
  );
  return (await response).data;
};

export { getImage, getMiniatures, uploadImage };
