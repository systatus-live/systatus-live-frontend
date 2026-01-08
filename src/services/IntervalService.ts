import HttpService from "./HttpService";

export default class IntervalService {
  static getIntervalList(token: string, params: URLSearchParams) {
    return HttpService.get(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/intervals?${params.toString()}`, {
      Authorization: `Bearer ${token}`
    });
  }
}