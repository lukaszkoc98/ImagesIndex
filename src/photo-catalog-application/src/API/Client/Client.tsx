import axios, { Method } from "axios";

const apiUrl = "https://localhost:44301/api";

const Client = async (
  method: Method,
  endpoint: string,
  { body }: any = {},
  { params }: any = {}
): Promise<any> => {
  const requestResult = await axios({
    method: method,
    url: `${apiUrl}/${endpoint}`,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: JSON.stringify(body),
    params: JSON.stringify(params),
    responseType: "json",
  });

  return requestResult.data;
};
export { Client };
