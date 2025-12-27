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
import { DataView } from 'primereact/dataview';
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

  async function resetSearch() {
    reset();
    search(new URLSearchParams({ page: "0" }));
  }

  function getIncidentStatusIcon(incident: any) {
    return incident.lastStatus?.startsWith("2") ? <span title="Resolvido"><CheckIcon size={16} className={`${styles["font-success"]}`} /></span> : <span title="Não Resolvido"><SirenIcon size={18} className={`${styles["blink"]} ${styles["font-danger"]}`} /> </span>
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
        <div>
          
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmitSearch)} className="grid grid-cols-1 lg:grid-cols-3 px-6 py-6">
        <div className="p-inputgroup flex-1">
          <InputText {...register("search", { required: false })} placeholder="Pesquisar incidentes" className="p-inputtext-sm" />
          <Button severity="secondary">
            <SearchIcon height={16} />
          </Button>
        </div>
      </form>

      <div className="px-6">
        {firstLoading ? (
          <Skeleton width="100%" height="10vh"></Skeleton>
        ) : (
          <div className="grid grid-cols-1 gap-y-3 border-1 border-gray-200 rounded-lg p-1 bg-white">
            <DataView
              value={incidentList}
              emptyMessage="&#8203;"
              listTemplate={(list: any) => (
                list.map((incident: any, index: number) => (
                  <div key={incident.id} className={`${index != (list.length - 1) ? "border-b-1 border-b-gray-200" : ""} py-2 px-3`}>
                    <div className="flex items-center gap-x-2 text-sm">
                      <div>
                        {getIncidentStatusIcon(incident)}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-medium overflow-hidden whitespace-nowrap text-ellipsis">{incident.name} ({incident.address})</span>
                        {incident.endedAt ?
                          <>
                            <small>Iniciado: {formatDate(incident.createdAt, "DD/MM/YYYY HH:mm")}</small>
                            <small>Status: Resolvido {formatDate(incident.endedAt, "DD/MM/YYYY HH:mm")} ({incident.duration})</small>
                          </> :
                          <>
                            <small>Desde: {formatDate(incident.createdAt, "DD/MM/YYYY HH:mm")} ({incident.duration})</small>
                            <small>Status: {HttpStatusCodeLabel[getHttpStatusKey(incident.lastStatus) as keyof typeof HttpStatusCodeLabel]} </small>
                          </>
                        }
                      </div>
                    </div>
                  </div>
                ))
              )}
              paginator
              rows={50}
            />
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