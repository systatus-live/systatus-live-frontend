import Loading from '@/components/Loading';
import MonitorForm from '@/components/Panel/MonitorForm';
import { Alert } from '@/lib/Alert';
import { NextPageWithLayout } from '@/pages/_app';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import MonitorService from '@/services/MonitorService';
import { MonitorTypeEnum, MonitorTypeLabelEnum } from '@/types/MonitorTypeEnum';
import formatDate from '@/utils/formatDate';
import { ArrowBigDownDashIcon, ArrowBigUpDashIcon, CopyIcon, SearchIcon, TimerIcon } from 'lucide-react';
import Head from 'next/head';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import PanelLayout from '../layout';
import styles from "./styles.module.scss";
import { getHttpStatusKey, HttpStatusCodeLabel } from '@/types/HttpStatusCode';

type IFormSearchValues = {
  search: string;
}

const Monitors: NextPageWithLayout = () => {
  const { token } = useGlobalProvider();
  const [monitorList, setMonitorList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      const { data, total } = await MonitorService.getMonitorList(token as string, params);
      setTotal(total);
      setMonitorList(data);
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

  return (
    <>
      <Head>
        <title>Monitores • Systatus.Live</title>
      </Head>

      {isSubmitting && <Loading />}

      <div className="flex items-center justify-between px-6 py-4 bg-white">
        <div className="flex flex-col">
          <h1 className="text-xl font-medium">Monitores</h1>
          <p className="mt-1 text-sm text-gray-500">Monitores de disponibilidade</p>
        </div>
        <div>
          <MonitorForm monitor={null} onClose={resetSearch} />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmitSearch)} className="grid grid-cols-1 lg:grid-cols-3 px-6 py-6">
        <div className="p-inputgroup flex-1">
          <InputText {...register("search", { required: false })} placeholder="Pesquisar monitores" className="p-inputtext-sm" />
          <Button severity="secondary">
            <SearchIcon height={16} />
          </Button>
        </div>
      </form>

      <div className="px-6">
        <div className="grid grid-cols-1 gap-y-3 border-1 border-gray-200 rounded-lg p-1 bg-white">
          <DataView
            value={monitorList}
            listTemplate={(list: any) => (
              list.map((monitor: any, index: number) => (
                <div key={monitor.id} className={`${index != (list.length - 1) ? "border-b-1 border-b-gray-200" : ""} py-3 px-4`}>
                  <div key={monitor.id} className="grid grid-cols-1 lg:grid-cols-5 gap-y-3 gap-x-3 items-center">
                    {/* Column 1 */}
                    <div className="flex items-center gap-x-2">
                      <div>
                        {(monitor.active == true && monitor.lastStatus != null) &&
                          (
                            monitor.lastStatus?.startsWith("2") ?
                            <ArrowBigUpDashIcon size={18} className={`${styles["font-success"]}`} /> :
                            <ArrowBigDownDashIcon size={18} className={`${styles["blink"]} ${styles["font-danger"]}`} />
                          )
                        }
                      </div>
                      <div className="flex flex-col justify-center w-full overflow-hidden">
                        <span className="font-medium text-sm">{monitor.name}</span>
                        <div className="text-gray-500 text-xs overflow-hidden whitespace-nowrap text-ellipsis">{MonitorTypeLabelEnum[monitor.type as MonitorTypeEnum]} • {monitor.address}</div>
                      </div>
                    </div>
                    {/* Column 2 */}
                    <div className="text-xs text-gray-500 flex justify-start lg:justify-center">
                      {monitor.lastStatus == null ? (
                        <span>Pendente</span>
                      ) : (
                        monitor.active ? (
                          <div className="flex flex-col">
                            <div className="flex items-center gap-x-1">
                              <span>{monitor.lastStatus?.startsWith("2") ? "Uptime" : "Downtime"}</span>
                              <span>{monitor.lastIncident}</span>
                            </div>
                            {!monitor.lastStatus?.startsWith("2") && <div>{HttpStatusCodeLabel[getHttpStatusKey(monitor.lastStatus) as keyof typeof HttpStatusCodeLabel]} ({monitor.lastStatus})</div>}
                          </div>
                        ) : (
                          <span></span>
                        )
                      )
                      }
                    </div>
                    {/* Column 3 */}
                    <div className="flex gap-x-1">
                      <div className="flex gap-x-1">
                        {monitor.historical.map((item: any) => (
                          <div style={{ width: "6px", height: "20px" }} className={`${getHistoricalClass(item)} ${styles["zoom"]} rounded-lg`} title={item.note}></div>
                        ))}
                      </div>
                      <small className="text-gray-500">
                        {monitor.percentOnline}%
                      </small>
                    </div>
                    {/* Column 4 */}
                    <div className="flex justify-start lg:justify-end items-center gap-x-1 text-gray-500 text-xs">
                      {monitor.lastStatus && (
                        <>
                          <TimerIcon size={16} />
                          {monitor.lastDate && <p>{formatDate(monitor.lastDate, "DD/MM HH:mm")}</p>}
                        </>
                      )}
                    </div>
                    {/* Column 5 */}
                    <div className="flex justify-start lg:justify-end">
                      <div title="Abrir">
                        <MonitorForm monitor={monitor} onClose={resetSearch} />
                      </div>
                      <div title="Copiar URL">
                        <Button title="Copiar" text severity="info" onClick={() => handleCopyClick(monitor.address)} type="button">
                          <CopyIcon height={14} width={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            paginator
            rows={50}
          />
        </div>
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