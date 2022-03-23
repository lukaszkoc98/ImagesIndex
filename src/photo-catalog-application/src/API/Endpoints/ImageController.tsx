import { Client } from "../Client/Client";

const controllerName = "Image";

const getImage = async (): Promise<string> => {
  return Client("GET", `${controllerName}/test`);
};

export { getImage };
