import Loading from '@/components/Loading';
import { Alert } from '@/lib/Alert';
import { NextPageWithLayout } from '@/pages/_app';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import IncidentService from '@/services/IncidentService';
import { getHttpStatusKey, HttpStatusCodeLabel } from '@/types/HttpStatusCode';
import formatDate from '@/utils/formatDate';
import ReactECharts from 'echarts-for-react';
import { BadgeCheckIcon, SearchIcon, SirenIcon } from 'lucide-react';
import Head from 'next/head';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Paginator } from 'primereact/paginator';
import { Skeleton } from 'primereact/skeleton';
import { useEffect, useState, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import PanelLayout from '../layout';
import styles from "./styles.module.scss";

type IFormSearchValues = {
  search: string;
}

const Incidents: NextPageWithLayout = () => {
  const { token } = useGlobalProvider();
  const [incidentList, setIncidentList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstLoading, setFirstLoading] = useState(true);
  const { register, handleSubmit } = useForm<IFormSearchValues>();
  const [pagination, setPagination] = useState({
    first: 0,
    rows: 0,
    total: 0
  });
  const [historical, setHistorical] = useState<any>();

  const tableColumnList = [
    {
      title: "Status",
      template: (incident: any) => {
        if (incident.endedAt) {
          return (
            <div className={`flex items-center space-x-1`}>
              <BadgeCheckIcon size={16} className={styles["font-success"]} />
              <span className="text-sm">Resolvido</span>
            </div>
          )
        }
        return (
          <div className={`flex items-center space-x-1`}>
            <SirenIcon size={18} className={`${styles["font-danger"]} ${styles["blink"]}`} />
            <span className="text-sm">Não Resolvido</span>
          </div>
        )
      },
      width: "15%"
    },
    {
      title: "Monitor",
      template: (incident: any) => (
        <div className="flex flex-col justify-center">
          <span className="font-medium">{incident.name}</span>
          <div className="text-gray-500 text-sm">{incident.address}</div>
        </div>
      ),
      width: "25%"
    },
    {
      title: "Incidente",
      template: (incident: any) => (
        <span className="text-sm">{HttpStatusCodeLabel[getHttpStatusKey(incident.lastError) as keyof typeof HttpStatusCodeLabel]} </span>
      ),
      width: "20%"
    },
    {
      title: "Iniciado",
      template: (incident: any) => <span className="text-sm">{formatDate(incident.createdAt, "DD/MM/YYYY HH:mm")}</span>,
      width: "15%"
    },
    {
      title: "Resolvido",
      template: (incident: any) => (
        incident.endedAt ? <span className="text-sm">{formatDate(incident.endedAt, "DD/MM/YYYY HH:mm")}</span> : <span className="text-sm"></span>
      ),
      width: "15%"
    },
    {
      title: "Duração",
      template: (incident: any) => <span className="text-sm">{incident.duration}</span>,
      width: "10%"
    }
  ]

  useEffect(() => {
    if (token) {
      getHistorical().finally(() => {
        search(new URLSearchParams({ page: "0" })).then;
      })
    }
  }, [token]);

  async function search(params: URLSearchParams) {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await IncidentService.getIncidentList(token as string, params);

      setIncidentList(response.data);
      setFirstLoading(false);

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

  async function getHistorical() {
    setIsSubmitting(true);

    try {
      const response = await IncidentService.getHistorical(token as string);

      setHistorical(response.data);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setIsSubmitting(false);
    }
  }


  async function onSubmitSearch(form: IFormSearchValues) {
    await search(new URLSearchParams({ search: form.search, page: "0" }));
  }

  function onPageChange(event: any) {
    setPagination({
      first: event.first,
      rows: event.rows,
      total: pagination.total
    });
    search(new URLSearchParams({ page: event.page.toString() }));
  }

  function buildLineChart() {
    return (
      historical && <>
        <ReactECharts option={{
          tooltip: {
            trigger: "axis"
          },
          xAxis: [
            {
              data: [
                ...historical.map((incident: any) => incident.date),
                ""
              ],
              axisLabel: {
                color: "#6a7282"
              }
            }
          ],
          yAxis: [
            {
              minInterval: 1,
              splitNumber: 5,
              show: false
            }
          ],
          grid: [
            {
              left: "0%",
              right: "0%",
              top: "0%",
              bottom: "0%"
            },
          ],
          series: [
            {
              type: "line",
              showSymbol: true,
              data: [
                ...historical.map((incident: any) => ({
                  value: incident.total
                })),
                {
                  value: 0,
                  symbol: "none"
                }
              ],
              lineStyle: {
                color: "#FDC700"
              },
              itemStyle: {
                color: "#FDC700"
              },
              areaStyle: {
                color: "#fdc60054"
              },
              smooth: true
            }
          ]
        }} style={{ width: "100%", height: "8vh" }} />
        <small className="text-gray-500">* Gráfico dos últimos 30 dias</small>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Incidentes • Systatus.Live</title>
      </Head>

      {isSubmitting && <Loading />}

      <div className="flex flex-col mb-6">
        <h1 className="text-xl font-bold">Incidentes</h1>
        <div className="w-full">
          {buildLineChart()}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmitSearch)} className="grid grid-cols-1 lg:grid-cols-3 mb-6">
        <div className="p-inputgroup flex-1">
          <InputText {...register("search", { required: false })} placeholder="Pesquisar por nome ou endereço" className="p-inputtext-sm" />
          <Button severity="secondary">
            <SearchIcon height={16} />
          </Button>
        </div>
      </form>

      <div>
        {firstLoading ? (
          <Skeleton width="100%" height="10vh"></Skeleton>
        ) : (
          <div className="border-1 border-gray-200 rounded-lg">
            <DataTable
              dataKey="id"
              value={incidentList}
              size="small"
              showGridlines={false}
              stripedRows={false}
              scrollable={true}
              scrollHeight="80vh"
            >
              {tableColumnList.map((col, i) => (
                <Column header={col.title} body={col.template} style={{ width: col.width }} />
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
              <small>{pagination.total} incidentes</small>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

Incidents.getLayout = function getLayout(page: ReactElement) {
  return (
    <PanelLayout>
      {page}
    </PanelLayout>
  )
}

export default Incidents;