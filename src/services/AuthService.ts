import HttpService from "./HttpService";

export default class AuthService {
  static signUp(payload: any) {
    return HttpService.post(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/auth/signup`, payload, {});
  }

  static signIn(payload: any) {
    return HttpService.post("/api/v1/auth/signin", payload, {});
  }

  static checkCode(code: string) {
    return HttpService.patch(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/auth/codes`, {
      code: code
    }, {});
  }

  static sendCode(email: string) {
    return HttpService.post(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/auth/codes`, {
      email: email
    }, {});
  }

  static forgotPassword(email: string) {
    return HttpService.post(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/auth/forgot-passwords`, {
      email: email
    }, {});
  }

  static resetPassword(password: string, token: string) {
    return HttpService.patch(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/auth/reset-passwords`, {
      password: password
    }, {
      Authorization: `Bearer ${token}`
    });
  }
}