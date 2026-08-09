import { Injectable, inject } from "@angular/core";
import { HttpService } from "./http.service";
import { environment } from "../../environments/environment";
import * as npm from "../../../package.json";

@Injectable({ providedIn: "root" })
export class Utils {
  private readonly http = inject(HttpService);

  public getCep(cep: string) {
    return this.http.get(`${environment.apiUrl}/v1/utils/cep/${cep}`);
  }

  public getStates() {
    return this.http.get(`${environment.apiUrl}/v1/utils/states`);
  }

  public getCities(state: string) {
    return this.http.get(`${environment.apiUrl}/v1/utils/cities/${state}`);
  }

  public getPackageJson() {
    return (npm as any).default;
  }

  public getVersion(): string {
    return this.getPackageJson().version;
  }
}
