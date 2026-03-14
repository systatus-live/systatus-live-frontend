import { Alert } from "@/lib/Alert";
import { NextPageWithLayout } from "@/pages/_app";
import { useGlobalProvider } from "@/providers/GlobalProvider";
import InvoiceService from "@/services/InvoiceService";
import PlanService from "@/services/PlanService";
import UserService from "@/services/UserService";
import { InvoiceStatusEnum, InvoiceStatusLabelEnum } from "@/types/InvoiceStatusEnum";
import formatDate from "@/utils/formatDate";
import formatMoney from "@/utils/formatMoney";
import { CheckIcon, CreditCardIcon, DownloadIcon, ReceiptIcon, SparklesIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactElement, useEffect, useState } from "react";
import AccountLayout from "../layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const statusVariantMap: Record<InvoiceStatusEnum, { label: string; className: string }> = {
  [InvoiceStatusEnum.PAID]: { label: InvoiceStatusLabelEnum.PAID, className: "bg-green-500/15 text-green-600 border-green-500/20" },
  [InvoiceStatusEnum.PENDING]: { label: InvoiceStatusLabelEnum.PENDING, className: "bg-yellow-500/15 text-yellow-600 border-yellow-500/20" },
  [InvoiceStatusEnum.CANCELED]: { label: InvoiceStatusLabelEnum.CANCELED, className: "bg-muted text-muted-foreground border-border" },
  [InvoiceStatusEnum.DUEDATE]: { label: InvoiceStatusLabelEnum.DUEDATE, className: "bg-red-500/15 text-red-600 border-red-500/20" },
};

const Subscription: NextPageWithLayout = () => {
  const { token, setLoading } = useGlobalProvider();
  const [planList, setPlanList] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [invoiceList, setInvoiceList] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 0, rows: 0, total: 0 });

  useEffect(() => {
    if (!token) {
      return;
    }

    async function loadData() {
      setLoading(true);

      try {
        const [subResponse, planResponse, invoiceResponse] = await Promise.all([
          UserService.getUserSubscription(token!),
          PlanService.getPlanList(),
          InvoiceService.getInvoiceList(token!, new URLSearchParams({ page: "0" })),
        ]);

        setSubscription(subResponse);
        setPlanList(planResponse.data);
        setInvoiceList(invoiceResponse.data);
        setPagination({ page: 0, rows: invoiceResponse.pagination.rows, total: invoiceResponse.pagination.total });
      } catch (error: any) {
        Alert.error("", error.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [token]);

  async function loadInvoices(page: number) {
    setLoading(true);

    try {
      const params = new URLSearchParams({ page: page.toString() });
      const response = await InvoiceService.getInvoiceList(token as string, params);

      setInvoiceList(response.data);
      setPagination((prev) => ({
        ...prev,
        page,
        rows: response.pagination.rows,
        total: response.pagination.total,
      }));
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function getInvoicePDF(id: string) {
    setLoading(true);

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
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(pagination.total / pagination.rows);

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center gap-2 mb-4">
          <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Assinatura atual</h2>
        </div>
        <Separator className="mb-6" />

        {subscription && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border p-5">
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 shrink-0">
                <Image src={subscription.image} alt="Plano" fill sizes="48px" style={{ objectFit: "contain" }} priority />
              </div>
              <div>
                <p className="font-semibold">Plano {subscription.name}</p>
                <p className="text-sm text-muted-foreground">Próximo faturamento: {subscription.nextBilling}</p>
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">
                {subscription.price === 0 ? "Grátis" : formatMoney(subscription.price)}
              </span>
              {subscription.period && (
                <span className="text-sm text-muted-foreground">{subscription.period}</span>
              )}
            </div>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <ReceiptIcon className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Histórico de faturas</h2>
        </div>
        <Separator className="mb-6" />

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fatura</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Emissão</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Nenhuma fatura encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                invoiceList.map((invoice) => {
                  const status = statusVariantMap[invoice.status as InvoiceStatusEnum];
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium text-sm font-mono">{invoice.id}</TableCell>
                      <TableCell className="text-sm">{invoice.plan}</TableCell>
                      <TableCell className="text-sm whitespace-nowrap">{formatDate(invoice.issueDate, "DD/MM/YYYY")}</TableCell>
                      <TableCell className="text-sm whitespace-nowrap">{formatDate(invoice.dueDate, "DD/MM/YYYY")}</TableCell>
                      <TableCell className="text-sm">{formatMoney(invoice.amount)}</TableCell>
                      <TableCell>
                        {status && (
                          <Badge variant="outline" className={`text-xs ${status.className}`}>
                            {status.label}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          title="Baixar PDF"
                          onClick={() => getInvoicePDF(invoice.id)}
                        >
                          <DownloadIcon className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {pagination.total > 0 && (
          <div className="flex items-center justify-between pt-3 text-sm text-muted-foreground">
            <span>{pagination.total} faturas</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 0}
                onClick={() => loadInvoices(pagination.page - 1)}
              >
                Anterior
              </Button>
              <Badge variant="outline" className="font-normal">
                {pagination.page + 1} / {totalPages || 1}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page + 1 >= totalPages}
                onClick={() => loadInvoices(pagination.page + 1)}
              >
                Próximo
              </Button>
            </div>
          </div>
        )}
      </section>

      {planList.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <SparklesIcon className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Planos disponíveis</h2>
          </div>
          <Separator className="mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {planList.map((plan, index) => (
              <div
                key={index}
                className={`relative flex flex-col rounded-lg border p-6 ${plan.mostPopular ? "border-primary shadow-md" : ""}`}
              >
                {plan.mostPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="px-3 py-0.5 text-xs">Mais Popular</Badge>
                  </div>
                )}

                <div className="flex flex-col items-center gap-2 mb-4">
                  <div className="relative h-12 w-12">
                    <Image src={plan.image} alt="Plano" fill sizes="48px" style={{ objectFit: "contain" }} priority />
                  </div>
                  <p className="font-semibold text-sm">Plano {plan.name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">
                      {plan.price === 0 ? "Grátis" : formatMoney(plan.price)}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-center text-muted-foreground mb-4">{plan.description}</p>

                <ul className="flex-1 space-y-2.5 mb-6">
                  {Object.entries(plan.features).map(([key, included], i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      {included
                        ? <CheckIcon className="h-4 w-4 shrink-0 text-green-500" />
                        : <XIcon className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                      }
                      <span className={included ? "" : "text-muted-foreground"}>{key}</span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.btaLink}>
                  <Button variant={plan.mostPopular ? "default" : "outline"} className="w-full" size="sm">
                    {plan.bta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

Subscription.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};

export default Subscription;
