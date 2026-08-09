import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpService } from "./http.service";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class Invoice {
  private readonly http = inject(HttpService);
  private readonly httpClient = inject(HttpClient);

  getInvoiceList(params: URLSearchParams) {
    return this.http.get(`${environment.apiUrl}/v1/invoices?${params.toString()}`);
  }

  getInvoicePDF(invoiceId: string) {
    return this.httpClient.get(`${environment.apiUrl}/v1/invoices/${invoiceId}/pdf`, {
      responseType: "blob",
      observe: "response",
      withCredentials: true,
    });
  }
}
