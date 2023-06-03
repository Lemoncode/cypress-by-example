import http from "http";

// TODO: Try to move to a external file
const getError = (statusCode: number, contentType: string): Error | null => {
  let error = null;
  if (statusCode >= 300) {
    error = new Error(`Request failed with status code: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error(`Expected application/json but received ${contentType}`);
  }
  return error;
};

// TODO: Try to move to a external file
export const getJSONtoJS = (url) => {
  return new Promise((resolve, reject) => {
    http
      .get(url, (response) => {
        const { statusCode } = response;
        const contentType = response.headers["content-type"];

        const error = getError(statusCode, contentType);
        if (error) {
          response.resume();
          reject(error);
        }

        response.setEncoding("utf8");
        let rawData = "";
        response.on("data", (chunk) => {
          rawData += chunk;
        });
        response.on('end', () => {
          try {
            const data = JSON.parse(rawData);
            resolve(data);
          } catch (error) {
            reject(error);    
          }
        })
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};
