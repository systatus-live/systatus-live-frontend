import HttpService from "./HttpService";

export default class StatusPageService {
  static getPublicStatusPage(slug: string) {
    return HttpService.get(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/status-page/public/${slug}`, {});
  }

  static getStatusPage(token: string) {
    return HttpService.get(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/status-page`, {
      Authorization: `Bearer ${token}`
    });
  }

  static createStatusPage(token: string, data: any) {
    return HttpService.post(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/status-page`, data, {
      Authorization: `Bearer ${token}`
    });
  }

  static updateStatusPage(token: string, data: any) {
    return HttpService.put(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/status-page`, data, {
      Authorization: `Bearer ${token}`
    });
  }
}
