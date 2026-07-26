import { Injectable, inject } from "@angular/core";
import { HttpService } from "./http.service";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class Utils {
  private readonly http = inject(HttpService);

  getCep(cep: string) {
    return this.http.get(`${environment.apiUrl}/v1/utils/cep/${cep}`);
  }

  getStates() {
    return this.http.get(`${environment.apiUrl}/v1/utils/states`);
  }

  getCities(state: string) {
    return this.http.get(`${environment.apiUrl}/v1/utils/cities/${state}`);
  }
}
