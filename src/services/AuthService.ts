import HttpService from "./HttpService";
import { SignInOptionsDTO } from "@/types/SignInOptionsDTO";

export default class AuthService {
  static signUp(payload: any, captcha: string) {
    return HttpService.post(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/auth/signup`, payload, {
      captcha: captcha
    });
  }

  static signInLocal(payload: SignInOptionsDTO) {
    return HttpService.post("/api/v1/auth/signin", payload, {});
  }

  static signIn(payload: any) {
    return HttpService.post(`${process.env.SYSTATUS_API_URL}/v1/auth/signin`, payload, {});
  }

  static checkCodeLocal(payload: any) {
    return HttpService.patch("/api//v1/auth/codes", payload, {});
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