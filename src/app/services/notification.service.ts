import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private messageService: MessageService
  ) { }

  public alert(message: string, type: "success" | "error" | "warn", duration: number = 3000) {
    this.messageService.add({ severity: type, detail: message, life: duration });
  }
}
