import Loading from '@/components/Loading';
import MonitorForm from '@/components/Panel/MonitorForm';
import { Alert } from '@/lib/Alert';
import { NextPageWithLayout } from '@/pages/_app';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import MonitorService from '@/services/MonitorService';
import { getHttpStatusKey, HttpStatusCodeLabel } from '@/types/HttpStatusCode';
import { MonitorTypeEnum, MonitorTypeLabelEnum } from '@/types/MonitorTypeEnum';
import { ArrowBigDownDashIcon, ArrowBigUpDashIcon, ClockFadingIcon, CopyIcon, PauseIcon, SearchIcon } from 'lucide-react';
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

const Monitors: NextPageWithLayout = () => {
  const { token } = useGlobalProvider();
  const [monitorList, setMonitorList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstLoading, setFirstLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm<IFormSearchValues>();
  const [pagination, setPagination] = useState({
    first: 0,
    rows: 0,
    total: 0
  });

  const tableColumnList = [
    {
      title: "Monitor",
      template: (monitor: any) => (
        <div className="flex items-center gap-x-2">
          <div>
            {getMonitorStatusIcon(monitor)}
          </div>
          <div className="flex flex-col justify-center w-full overflow-hidden">
            <span className="font-medium text-sm">{monitor.name}</span>
            <div className="text-gray-500 text-xs overflow-hidden whitespace-nowrap text-ellipsis">{MonitorTypeLabelEnum[monitor.type as MonitorTypeEnum]} • {monitor.address}</div>
          </div>
        </div>
      ),
      width: "30%"
    },
    {
      title: "Status",
      template: (monitor: any) => (
        <div className="text-xs">
          {monitor.lastStatus == null ? (
            <span>Pendente</span>
          ) : (
            monitor.active ? (
              <div>
                <div>
                  <span className="mr-1">{monitor.lastStatus?.startsWith("2") ? "Uptime" : "Downtime"}</span>
                  <span>{monitor.lastIncident}</span>
                </div>
                {!monitor.lastStatus?.startsWith("2") && <div>{HttpStatusCodeLabel[getHttpStatusKey(monitor.lastStatus) as keyof typeof HttpStatusCodeLabel]}</div>}
              </div>
            ) : (
              <span></span>
            )
          )}
        </div>
      ),
      width: "20%"
    },
    {
      title: "Histórico (30 dias)",
      template: (monitor: any) => (
        <div className="flex gap-x-1">
          <div className="flex gap-x-1">
            {monitor.historical.map((item: any, index: number) => (
              <div key={index} style={{ width: "6px", height: "20px" }} className={`${getHistoricalClass(item)} ${styles["zoom"]} rounded-lg`} title={item.note}></div>
            ))}
          </div>
          <small className="text-gray-500">
            {monitor.percentOnline}%
          </small>
        </div>
      ),
      width: "50%"
    },
    {
      title: "Ações",
      template: (monitor: any) => (
        <div className="flex">
          <div title="Abrir">
            <MonitorForm monitor={monitor} onClose={resetSearch} />
          </div>
          <div title="Copiar URL">
            <Button title="Copiar" text onClick={() => handleCopyClick(monitor.address)} type="button">
              <CopyIcon height={14} width={14} />
            </Button>
          </div>
        </div>
      ),
      width: "auto"
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
      const response = await MonitorService.getMonitorList(token as string, params);

      setMonitorList(response.data);
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

  async function handleCopyClick(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      Alert.success("", "Copiado para área de transferência");
    } catch (err) { }
  };

  async function onSubmitSearch(form: IFormSearchValues) {
    await search(new URLSearchParams({ search: form.search, page: "0" }));
  }

  async function resetSearch() {
    reset();
    search(new URLSearchParams({ page: "0" }));
  }

  function getHistoricalClass(item: any) {
    if (item.percentOnline + item.percentOffline == 0) {
      return styles["bg-empty"];
    } else if (item.percentOnline == 100) {
      return styles["bg-success"];
    } else if (item.percentOnline >= 50) {
      return styles["bg-partial"];
    }
    return styles["bg-danger"];
  }

  function getMonitorStatusIcon(monitor: any) {
    if (monitor.active == false) {
      return <span title="Inativo/Pausado"><PauseIcon size={18} className={`${styles["font-empty"]}`} /></span>
    }

    if (monitor.lastStatus == null) {
      return <span title="Pendente"><ClockFadingIcon size={18} className={`${styles["font-empty"]}`} /></span>
    }

    return monitor.lastStatus?.startsWith("2") ? <span title="Disponível"><ArrowBigUpDashIcon size={18} className={`${styles["font-success"]}`} /></span> : <span title="Indisponível"><ArrowBigDownDashIcon size={18} className={`${styles["blink"]} ${styles["font-danger"]}`} /> </span>
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
        <title>Monitores • Systatus.Live</title>
      </Head>

      {isSubmitting && <Loading />}

      <div className="flex items-center justify-between px-6 py-4 bg-white">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold">Monitores</h1>
          <p className="mt-1 text-sm text-gray-500">Monitore sites, APIs e servidores com verificações globais frequentes para identificar problemas rapidamente.</p>
        </div>
        <div>
          <MonitorForm monitor={null} onClose={resetSearch} />
        </div>
      </div>

      <div className="px-6">
        {firstLoading ? (
          <Skeleton width="100%" height="10vh"></Skeleton>
        ) : (
          <div>
            <DataTable
              dataKey="id"
              value={monitorList}
              size="small"
              showGridlines={false}
              stripedRows={false}
              header={
                <form onSubmit={handleSubmit(onSubmitSearch)} className="grid grid-cols-1 lg:grid-cols-3 ">
                  <div className="p-inputgroup flex-1">
                    <InputText {...register("search", { required: false })} placeholder="Pesquisar monitores" className="p-inputtext-sm" />
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
                <Column key={i} header={col.title} body={col.template} style={{ width: col.width }} />
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
              <small>{pagination.total} monitores</small>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

Monitors.getLayout = function getLayout(page: ReactElement) {
  return (
    <PanelLayout>
      {page}
    </PanelLayout>
  )
}

export default Monitors;