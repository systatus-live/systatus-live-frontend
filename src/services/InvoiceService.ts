import HttpService from "./HttpService";

export default class InvoiceService {
  static getInvoiceList(token: string, params: URLSearchParams) {
    return HttpService.get(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/invoices?${params.toString()}`, {
      Authorization: `Bearer ${token}`
    });
  }

  static async getInvoicePDF(token: string, invoiceId: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SYSTATUS_API_URL}/v1/invoices/${invoiceId}/pdf`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    );

    if (!response.ok) {
      throw new Error("Falha ao gerar PDF");
    }

    return response;
  }
}