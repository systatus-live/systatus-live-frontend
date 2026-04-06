import { Alert } from "@/lib/Alert";
import { NextPageWithLayout } from "@/pages/_app";
import { useGlobalProvider } from "@/providers/GlobalProvider";
import IncidentService from "@/services/IncidentService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import Head from "next/head";
import { ReactElement, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DataTable from "@/components/Panel/Incidents/DataTable";

type IFormSearchValues = {
  search: string;
};

const chartConfig = {
  total: {
    label: "Incidentes",
    color: "#FDC700",
  },
} satisfies ChartConfig;

const Incidents: NextPageWithLayout = () => {
  const { token, setLoading } = useGlobalProvider();
  const { register, handleSubmit, getValues } = useForm<IFormSearchValues>();
  const [historical, setHistorical] = useState<any[]>([]);
  const [incidentList, setIncidentList] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [pagination, setPagination] = useState({ rows: 0, total: 0 });

  useEffect(() => {
    if (!token) return;

    setLoading(true);

    Promise.all([
      IncidentService.getHistorical(token),
      IncidentService.getIncidentList(token, new URLSearchParams({ page: "0" })),
    ]).then(([historicalRes, incidentRes]) => {
      setHistorical(historicalRes.data);
      setIncidentList(incidentRes.data);
      setPagination({ rows: incidentRes.pagination.rows, total: incidentRes.pagination.total });
    }).catch((error: any) => {
      Alert.error("", error.message);
    }).finally(() => {
      setLoading(false);
    });
  }, [token]);

  async function fetchPage(p: number, search?: string) {
    setLoading(true);

    const params = new URLSearchParams({ page: p.toString() });
    if (search) {
      params.set("search", search);
    }

    try {
      const response = await IncidentService.getIncidentList(token as string, params);
      setIncidentList(response.data);
      setPagination({ rows: response.pagination.rows, total: response.pagination.total });
      setPage(p);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmitSearch(form: IFormSearchValues) {
    await fetchPage(0, form.search);
  }

  const totalPages = pagination.rows > 0 ? Math.ceil(pagination.total / pagination.rows) : 1;

  return (
    <>
      <Head>
        <title>Incidentes • Systatus.Live</title>
      </Head>

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-base font-semibold shrink-0">Incidentes</h1>
        <form onSubmit={handleSubmit(onSubmitSearch)} className="flex gap-2 w-full max-w-sm">
          <Input
            {...register("search")}
            placeholder="Pesquisar por nome ou endereço"
          />
          <Button type="submit" variant="outline">Buscar</Button>
        </form>
      </div>

      {historical.length > 0 && (
        <div className="rounded-xl border bg-card p-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Incidentes (30 dias)
          </p>
          <ChartContainer config={chartConfig} className="h-[80px] w-full aspect-auto">
            <AreaChart data={historical} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="incidentFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FDC700" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FDC700" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" hide />
              <YAxis hide domain={[0, (dataMax: number) => dataMax === 0 ? 1 : Math.ceil(dataMax * 1.25)]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#FDC700"
                strokeWidth={2}
                fill="url(#incidentFill)"
                dot={false}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      )}

      <DataTable data={incidentList} />

      {pagination.total > 0 && (
        <div className="flex items-center justify-between">
          <small className="text-muted-foreground">{pagination.total} incidentes</small>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchPage(page - 1, getValues("search"))}
                disabled={page === 0}
              >
                Anterior
              </Button>
              <small className="text-muted-foreground">{page + 1} / {totalPages}</small>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchPage(page + 1, getValues("search"))}
                disabled={page + 1 >= totalPages}
              >
                Próxima
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

Incidents.getLayout = function getLayout(page: ReactElement) {
  return page;
};

export default Incidents;
