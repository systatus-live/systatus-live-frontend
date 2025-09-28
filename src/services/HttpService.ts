export default class HttpService {
  static post(url: string, headers: any, payload: any) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          ...headers
        }
      }).then(async (response) => {
        const json = await response.json();
        if (response.status == 200) {
          resolve(json);
        } else {
          reject(json);
        }
      }).catch((error) => {
        reject(error);
      })
    })
  }
}