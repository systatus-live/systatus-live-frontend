import { Injectable, inject } from "@angular/core";
import { HttpService } from "./http.service";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class ChatPlatform {
  private readonly http = inject(HttpService);

  getChatPlatformList(params: URLSearchParams) {
    return this.http.get(`${environment.apiUrl}/v1/chat-platforms?${params.toString()}`);
  }
}
