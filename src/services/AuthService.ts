export default class AuthService {
  static signUp(payload: any) {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.NEXT_PUBLIC_API}/v1/auth/signup`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(async (response) => {
        const json = await response.json();
        if ([200, 201].includes(response.status)) {
          resolve(json);
        } else {
          reject(json);
        }
      }).catch((error) => {
        reject(error);
      })
    })
  }

  static signIn(payload: any) {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.NEXT_PUBLIC_API}/v1/auth/signin`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(async (response) => {
        const json = await response.json();
        if ([200, 201].includes(response.status)) {
          resolve(json);
        } else {
          reject(json);
        }
      }).catch((error) => {
        reject(error);
      })
    })
  }

  static checkCode(code: string) {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.NEXT_PUBLIC_API}/v1/auth/codes`, {
        method: "PATCH",
        body: JSON.stringify({
          code: code
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(async (response) => {
        const json = await response.json();
        if ([200, 201].includes(response.status)) {
          resolve(json);
        } else {
          reject(json);
        }
      }).catch((error) => {
        reject(error);
      })
    })
  }

  static sendCode(email: string) {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.NEXT_PUBLIC_API}/v1/auth/codes`, {
        method: "POST",
        body: JSON.stringify({
          email: email
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(async (response) => {
        const json = await response.json();
        if ([200, 201].includes(response.status)) {
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