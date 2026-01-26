import Loading from "@/components/Loading";
import { Alert } from "@/lib/Alert";
import { NextPageWithLayout } from "@/pages/_app";
import { useGlobalProvider } from "@/providers/GlobalProvider";
import InvoiceService from "@/services/InvoiceService";
import { InvoiceStatusEnum, InvoiceStatusLabelEnum } from "@/types/InvoiceStatusEnum";
import formatDate from "@/utils/formatDate";
import formatMoney from "@/utils/formatMoney";
import { DownloadIcon } from "lucide-react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator } from "primereact/paginator";
import { Panel } from "primereact/panel";
import { ReactElement, useEffect, useState } from "react";
import AccountLayout from "../layout";

const BillingAccount: NextPageWithLayout = () => {
  const { token } = useGlobalProvider();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invoiceList, setInvoiceList] = useState([]);
  const [pagination, setPagination] = useState({
    first: 0,
    rows: 0,
    total: 0
  });

  useEffect(() => {
    if (token) {
      search(new URLSearchParams({ page: "0" }));
    }
  }, [token]);

  const tableColumnList = [
    {
      title: "Fatura",
      template: (invoice: any) => <span className="font-medium">{invoice.id}</span>,
      width: "30%"
    },
    {
      title: "Plano",
      template: (invoice: any) => <span className="text-sm">{invoice.plan}</span>,
      width: "15%"
    },
    {
      title: "Emissão",
      template: (invoice: any) => <span className="text-sm">{formatDate(invoice.issueDate, "DD/MM/YYYY")}</span>,
      width: "15%"
    },
    {
      title: "Vencimento",
      template: (invoice: any) => <span className="text-sm">{formatDate(invoice.dueDate, "DD/MM/YYYY")}</span>,
      width: "15%"
    },
    {
      title: "Valor",
      template: (invoice: any) => <span className="text-sm">{formatMoney(invoice.amount)}</span>,
      width: "15%"
    },
    {
      title: "Status",
      template: (invoice: any) => getStatusBadge(invoice.status as InvoiceStatusEnum),
      width: "20%"
    },
    {
      title: "Download",
      template: (invoice: any) => (
        <Button text onClick={() => getInvoicePDF(invoice.id)} type="button">
          <DownloadIcon height={14} width={14} />
        </Button>
      ),
      width: "auto"
    }
  ]

  async function search(params: URLSearchParams) {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await InvoiceService.getInvoiceList(token as string, params);

      setInvoiceList(response.data);
      setPagination(prev => ({
        ...prev,
        rows: response.pagination.rows,
        total: response.pagination.total
      }));
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function onPageChange(event: any) {
    setPagination({
      first: event.first,
      rows: event.rows,
      total: pagination.total
    });
    search(new URLSearchParams({ page: event.page.toString() }));
  }

  function getStatusBadge(status: InvoiceStatusEnum) {
    switch (status) {
      case InvoiceStatusEnum.PAID:
        return <small className="py-1 px-2 rounded-sm text-sm" style={{ background: "#05DF72", color: "#fff" }}>{InvoiceStatusLabelEnum[status]}</small>
      case InvoiceStatusEnum.PENDING:
        return <small className="py-1 px-2 rounded-sm text-sm" style={{ background: "#FDC700", color: "#fff" }}>{InvoiceStatusLabelEnum[status]}</small>
      case InvoiceStatusEnum.CANCELED:
        return <small className="py-1 px-2 rounded-sm text-sm" style={{ background: "#9b9b9bff", color: "#fff" }}>{InvoiceStatusLabelEnum[status]}</small>
      case InvoiceStatusEnum.DUEDATE:
        return <small className="py-1 px-2 rounded-sm text-sm" style={{ background: "#FF6467", color: "#fff" }}>{InvoiceStatusLabelEnum[status]}</small>
      default:
        return <></>
    }
  }

  async function getInvoicePDF(id: string) {
    setIsSubmitting(true);

    try {
      const response = await InvoiceService.getInvoicePDF(token!, id);
      const blob = await response.blob();

      const disposition = response.headers.get("content-disposition");
      let filename = "invoice.pdf";

      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match?.[1]) {
          filename = match[1];
        }
      }

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.target = "_blank";

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      Alert.error("", "Falha ao gerar o PDF");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {isSubmitting && <Loading />}

      <Panel header="Histórico de faturas" className="mt-6">
        <div className="border-1 border-gray-200">
          <DataTable
            dataKey="id"
            value={invoiceList}
            size="small"
            showGridlines={false}
            stripedRows={false}
            scrollable={true}
            scrollHeight="80vh"
            emptyMessage="&#8203;"
          >
            {tableColumnList.map((col, index) => (
              <Column key={index} header={col.title} body={col.template} style={{ width: col.width }} />
            ))}
          </DataTable>
          <div className="flex items-center justify-center space-x-4">
            <Paginator
              first={pagination.first}
              rows={pagination.rows}
              totalRecords={pagination.total}
              onPageChange={onPageChange}
              template={{ layout: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink" }}
            />
            <small>{pagination.total} faturas</small>
          </div>
        </div>
      </Panel>
    </>
  )
}

BillingAccount.getLayout = function getLayout(page: ReactElement) {
  return (
    <AccountLayout>
      {page}
    </AccountLayout>
  )
}

export default BillingAccount;