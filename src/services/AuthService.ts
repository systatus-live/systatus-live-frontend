import HttpService from "./HttpService";
import { SignInOptionsDTO } from "@/types/SignInOptionsDTO";

export default class AuthService {
  static signUp(payload: any, headers = {}) {
    return HttpService.post(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/auth/signup`, payload, headers);
  }

  static signInLocal(payload: SignInOptionsDTO, headers = {}) {
    return HttpService.post("/api/v1/auth/signin", payload, headers);
  }

  static signIn(payload: any, headers = {}) {
    return HttpService.post(`${process.env.SYSTATUS_API_URL}/v1/auth/signin`, payload, headers);
  }

  static checkCodeLocal(payload: any) {
    return HttpService.patch("/api/v1/auth/codes", payload, {});
  }

  static checkCode(code: string, headers = {}) {
    return HttpService.patch(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/auth/codes`, {
      code: code
    }, headers);
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

  static getAuthFlowId(id: string) {
    return HttpService.get(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/auth/flows/${id}`, {});
  }
}