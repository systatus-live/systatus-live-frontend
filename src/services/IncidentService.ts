import HttpService from "./HttpService";

export default class IncidentService {
  static getIncidentList(token: string, params: URLSearchParams) {
    return HttpService.get(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/incidents?${params.toString()}`, {
      Authorization: `Bearer ${token}`
    });
  }

    static getHistorical(token: string) {
    return HttpService.get(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/incidents/historical`, {
      Authorization: `Bearer ${token}`
    });
  }
}