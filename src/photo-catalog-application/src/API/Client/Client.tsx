import axios, { Method } from "axios";

const apiUrl = "https://localhost:44301/api";

const Client = async (
  method: Method,
  endpoint: string,
  { body, responseIsBlob = false }: any = {},
  params: any = {}
): Promise<any> => {
  const requestResult = await axios({
    method: method,
    url: `${apiUrl}/${endpoint}`,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: JSON.stringify(body),
    params: params,
    responseType: responseIsBlob ? "blob" : "json",
  });

  if (
    requestResult.status.toString()[0] === "4" ||
    requestResult.status.toString()[0] === "5"
  ) {
    console.log(requestResult, requestResult.statusText);
  }

  return requestResult.data;
};
export { Client };
