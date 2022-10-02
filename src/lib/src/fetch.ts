export const fetchXML = (url: string, callback: (xml: string) => void) => {
  fetch(url, {
    mode: "no-cors",
    method: "GET",
    headers: new Headers({
      Accept: "application/xml",
      "content-type": "application/x-www-form-urlencoded",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT",
      "Access-Control-Allow-Headers": "Content-Type",
    }),
  }).then((response) => {
    response.text().then((xml) => {
      callback(xml);
    });
  });
};
