import HttpService from "./HttpService";

export default class MonitorService {
  static getMonitorList(token: string, params: URLSearchParams) {
    return HttpService.get(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/monitors?${params.toString()}`, {
      Authorization: `Bearer ${token}`
    });
  }

  static createMonitor(token: string, data: any) {
    return HttpService.post(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/monitors`, data, {
      Authorization: `Bearer ${token}`
    });
  }

  static deleteMonitor(token: string, id: string) {
    return HttpService.delete(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/monitors/${id}`, {
      Authorization: `Bearer ${token}`
    });
  }

  static updateMonitor(token: string, id: string, data: any) {
    return HttpService.put(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/monitors/${id}`, data, {
      Authorization: `Bearer ${token}`
    });
  }
}