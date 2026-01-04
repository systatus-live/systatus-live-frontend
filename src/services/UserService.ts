import HttpService from "./HttpService";

export default class UserService {
  static updateUserDetails(token: string, data: any) {
    return HttpService.patch(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/users/details`, data, {
      Authorization: `Bearer ${token}`
    });
  }

  static updateUserPassword(token: string, data: any) {
    return HttpService.patch(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/users/passwords`, data, {
      Authorization: `Bearer ${token}`
    });
  }
}