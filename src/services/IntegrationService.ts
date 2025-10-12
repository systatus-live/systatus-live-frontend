import HttpService from "./HttpService";

export default class IntegrationService {
  static getIntegrationList(token: string, params: URLSearchParams) {
    return HttpService.get(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/integrations?${params.toString()}`, {
      Authorization: `Bearer ${token}`
    });
  }

  static createIntegration(token: string, data: any) {
    return HttpService.post(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/integrations`, data, {
      Authorization: `Bearer ${token}`
    });
  }

  static deleteIntegration(token: string, id: string) {
    return HttpService.delete(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/integrations/${id}`, {
      Authorization: `Bearer ${token}`
    });
  }

  static updateIntegration(token: string, id: string, data: any) {
    return HttpService.put(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/integrations/${id}`, data, {
      Authorization: `Bearer ${token}`
    });
  }

  static validateIntegration(token: string, id: string) {
    return HttpService.post(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/integrations/validates`, {
      id: id
    }, {
      Authorization: `Bearer ${token}`
    });
  }
}