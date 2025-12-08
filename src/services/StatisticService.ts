import HttpService from "./HttpService";

export default class StatisticService {
  static getPanelStatistics(token: string, params: URLSearchParams) {
    return HttpService.get(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/statistics/panels?${params.toString()}`, {
      Authorization: `Bearer ${token}`
    });
  }
}