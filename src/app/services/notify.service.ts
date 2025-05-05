import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(
    private messageService: MessageService
  ) { }

  public alert(title: string, message: string, type: "success" | "error" | "warn", duration: number = 3000) {
    this.messageService.add({ severity: type, summary: title, detail: message, life: duration });
  }
}
