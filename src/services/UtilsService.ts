import HttpService from "./HttpService";

export default class UtilsService {
  static getCep(token: string, cep: string) {
    return HttpService.get(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/utils/cep/${cep}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  static getStates(token: string) {
    return HttpService.get(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/utils/states`, {
      Authorization: `Bearer ${token}`,
    });
  }

  static getCities(token: string, state: string) {
    return HttpService.get(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/utils/cities/${state}`, {
      Authorization: `Bearer ${token}`,
    });
  }
}
