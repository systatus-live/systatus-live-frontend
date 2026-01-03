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
import { Paginator } from 'primereact/paginator';

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
        incident.endedAt ? <small>Resolvido</small> : <small>Não Resolvido</small>
      ),
      width: "10%"
    },
    {
      title: "Duração",
      template: (incident: any) => (
        incident.endedAt ?
          <small>{formatDate(incident.createdAt, "DD/MM/YYYY HH:mm")} até {formatDate(incident.endedAt, "DD/MM/YYYY HH:mm")} ({incident.duration})</small> :
          <small>Desde {formatDate(incident.createdAt, "DD/MM/YYYY HH:mm")} ({incident.duration})</small>
      ),
      width: "30%"
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

  async function onSubmitSearch(form: IFormSearchValues) {
    await search(new URLSearchParams({ search: form.search, page: "0" }));
  }

  function getIncidentStatusIcon(incident: any) {
    return incident.endedAt ? <span title="Resolvido"><CheckIcon size={16} className={`${styles["font-success"]}`} /></span> : <span title="Não Resolvido"><SirenIcon size={18} className={`${styles["blink"]} ${styles["font-danger"]}`} /> </span>
  }

  function onPageChange(event: any) {
    setPagination({
      first: event.first,
      rows: event.rows,
      total: pagination.total
    });
    search(new URLSearchParams({ page: event.page.toString() }));
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
            <div className="flex items-center justify-center">
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