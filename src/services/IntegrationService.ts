import HttpService from "./HttpService";

export default class IntegrationService {
  static getIntegrationList(token: string, params: URLSearchParams) {
    return HttpService.get(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/integrations?${params.toString()}`, {
      Authorization: `Bearer ${token}`
    });
  }
}