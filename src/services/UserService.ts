import HttpService from "./HttpService";

export default class UserService {
  static updateUserDetails(token: string, formData: FormData) {
    return HttpService.patch(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/users/details`, formData, {
      Authorization: `Bearer ${token}`,
    });
  }

  static updateUserPassword(token: string, data: any) {
    return HttpService.patch(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/users/passwords`, data, {
      Authorization: `Bearer ${token}`
    });
  }

  static getAuthHistory(token: string, params: URLSearchParams) {
    return HttpService.get(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/users/auth-history?${params.toString()}`, {
      Authorization: `Bearer ${token}`
    });
  }

  static getUserSubscription(token: string) {
    return HttpService.get(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/users/subscriptions`, {
      Authorization: `Bearer ${token}`
    });
  }
}