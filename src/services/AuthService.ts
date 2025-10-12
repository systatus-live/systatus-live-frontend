import HttpService from "./HttpService";

export default class AuthService {
  static signUp(payload: any) {
    return HttpService.post(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/auth/signup`, payload, {});
  }

  static authLocal(payload: any) {
    return HttpService.post("/api/v1/auth/callback", payload, {});
  }

  static signInEmailPassword(payload: any) {
    return HttpService.post(`${process.env.SYSTATUS_API_URL}/v1/auth/signin`, payload, {});
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

  static verifyToken(token: string) {
    return HttpService.get(`${process.env.SYSTATUS_API_URL}/v1/auth/verify`, {
      Authorization: `Bearer ${token}`,
    });
  }

  static meLocal() {
    return HttpService.get(`/api/v1/auth/me`, {});
  }

  static me(token: string) {
    return HttpService.get(`${process.env.SYSTATUS_API_URL}/v1/auth/me`, {
      Authorization: `Bearer ${token}`,
    });
  }

  static signOutLocal() {
    return HttpService.post(`/api/v1/auth/signout`, {}, {});
  }
}