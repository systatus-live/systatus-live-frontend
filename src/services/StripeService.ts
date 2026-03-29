import HttpService from "./HttpService";

export default class StripeService {
  static createCheckoutSession(token: string, planId: string) {
    return HttpService.post(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/stripe/checkout`, {
      planId
    }, {
      Authorization: `Bearer ${token}`
    });
  }
}
