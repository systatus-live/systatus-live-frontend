import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: "root" })
export class AppStateService {
  readonly loading = signal<boolean>(false);
  readonly user = signal<any>(null);
  readonly token = signal<string | null>(null);
  readonly subscription = signal<any>(null);
  readonly permissionList = signal<string[]>([]);
}
