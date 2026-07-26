import { Injectable, inject } from '@angular/core';
import { HttpService } from './http.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PlanService {
  private readonly http = inject(HttpService);

  getPlanList() {
    return this.http.get(`${environment.apiUrl}/v1/plans`);
  }
}
