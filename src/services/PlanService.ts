import HttpService from "./HttpService";

export default class PlanService {
  static getPlanList() {
    return HttpService.get(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/plans`, {});
  }
}