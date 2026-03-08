import HttpService from "./HttpService";

export default class ChatPlatformService {
  static getChatPlatformList(token: string, params: URLSearchParams) {
    return HttpService.get(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/chat-platforms?${params.toString()}`, {
      Authorization: `Bearer ${token}`
    });
  }
}