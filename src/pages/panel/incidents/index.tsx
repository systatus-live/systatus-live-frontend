import Loading from '@/components/Loading';
import { Alert } from '@/lib/Alert';
import { NextPageWithLayout } from '@/pages/_app';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import IncidentService from '@/services/IncidentService';
import { getHttpStatusKey, HttpStatusCodeLabel } from '@/types/HttpStatusCode';
import formatDate from '@/utils/formatDate';
import { CheckIcon, SearchIcon, SirenIcon } from 'lucide-react';
import Head from 'next/head';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
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
  const [page, setPage] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstLoading, setFirstLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm<IFormSearchValues>();

  const tableColumnList = [
    {
      title: "Monitor",
      template: (incident: any) => (
        <div className="flex items-center gap-x-2 text-sm">
          <div>
            {getIncidentStatusIcon(incident)}
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-medium text-sm">{incident.name}</span>
            <div className="text-gray-500 text-xs">{incident.address}</div>
          </div>
        </div>
      ),
      width: "30%"
    },
    {
      title: "Incidente",
      template: (incident: any) => (
        <small>{HttpStatusCodeLabel[getHttpStatusKey(incident.lastError) as keyof typeof HttpStatusCodeLabel]} </small>
      ),
      width: "20%"
    },
    {
      title: "Status",
      template: (incident: any) => (
        incident.endedAt ?
          <div className="flex flex-col">
            <small>Resolvido</small>
            <small>Período: {formatDate(incident.createdAt, "DD/MM/YYYY HH:mm")} até {formatDate(incident.endedAt, "DD/MM/YYYY HH:mm")} ({incident.duration})</small>
          </div> :
          <div className="flex flex-col">
            <small>Não Resolvido</small>
            <small>Desde: {formatDate(incident.createdAt, "DD/MM/YYYY HH:mm")} ({incident.duration})</small>
          </div>
      ),
      width: "50%"
    }
  ]

  useEffect(() => {
    if (token) {
      search(new URLSearchParams({ page: "0" }));
    }
  }, [token]);

  async function search(params: URLSearchParams) {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (params.has("page")) {
      setPage(parseInt(params.get("page") as string));
    }

    try {
      const { data, total } = await IncidentService.getIncidentList(token as string, params);
      setIncidentList(data);
      setFirstLoading(false);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onSubmitSearch(form: IFormSearchValues) {
    await search(new URLSearchParams({ search: form.search, page: "0" }));
  }

  function getIncidentStatusIcon(incident: any) {
    return incident.endedAt ? <span title="Resolvido"><CheckIcon size={16} className={`${styles["font-success"]}`} /></span> : <span title="Não Resolvido"><SirenIcon size={18} className={`${styles["blink"]} ${styles["font-danger"]}`} /> </span>
  }

  return (
    <>
      <Head>
        <title>Incidentes • Systatus.Live</title>
      </Head>

      {isSubmitting && <Loading />}

      <div className="flex items-center justify-between px-6 py-4 bg-white">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold">Incidentes</h1>
          <p className="mt-1 text-sm text-gray-500">Acompanhe o histórico de incidentes dos seus serviços para identificar padrões de problemas.</p>
        </div>
        <div></div>
      </div>

      <div className="px-6">
        {firstLoading ? (
          <Skeleton width="100%" height="10vh"></Skeleton>
        ) : (
          <div>
            <DataTable
              dataKey="id"
              value={incidentList}
              size="small"
              showGridlines={false}
              stripedRows={false}
              header={
                <form onSubmit={handleSubmit(onSubmitSearch)} className="grid grid-cols-1 lg:grid-cols-3">
                  <div className="p-inputgroup flex-1">
                    <InputText {...register("search", { required: false })} placeholder="Pesquisar incidentes" className="p-inputtext-sm" />
                    <Button severity="secondary">
                      <SearchIcon height={16} />
                    </Button>
                  </div>
                </form>
              }
              scrollable={true}
              scrollHeight="80vh"
            >
              {tableColumnList.map((col, i) => (
                <Column header={col.title} body={col.template} style={{ width: col.width }} />
              ))}
            </DataTable>
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