import Loading from '@/components/Loading';
import { Alert } from '@/lib/Alert';
import { NextPageWithLayout } from '@/pages/_app';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import MonitorService from '@/services/MonitorService';
import { MonitorTypeEnum, MonitorTypeLabelEnum } from '@/types/MonitorTypeEnum';
import { CopyIcon, Monitor, SearchIcon } from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import PanelLayout from '../layout';
import MonitorForm from '@/components/Panel/MonitorForm';
import styles from "./styles.module.scss";

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
    } else if (item.percentOnline > 50) {
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

      <div className="flex items-center justify-between px-6 py-4 bg-white shadow">
        <div className="flex flex-col">
          <h1 className="text-xl font-medium">Monitores</h1>
          <p className="mt-1 text-sm text-gray-500">Monitores de disponibilidade e status</p>
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
        <div className="grid grid-cols-1 gap-y-3 shadow border-t-1 border-gray-200 rounded-lg p-1 bg-white">
          <DataView
            value={monitorList}
            listTemplate={(list: any, index) => (
              list.map((monitor: any) => (
                <div className="border-b-1 border-gray-200 py-3 px-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2">
                    <div key={monitor.id} className="flex items-center gap-x-3 items-center">
                      <div style={{ position: "relative", width: 16, height: 16 }}>
                        <Image src={`https://www.google.com/s2/favicons?domain=${monitor.address}`} alt="" fill />
                      </div>
                      <div className="flex flex-col justify-center w-full overflow-hidden">
                        <div className="flex items-center gap-x-1">
                          {monitor.lastStatus == null ?
                            <div className={`${styles["bg-empty"]} text-white text-xs rounded-lg px-2`} style={{ zoom: 0 }}>
                              Aguardando monitoramento
                            </div> :
                            <div className={`${monitor.lastStatus.startsWith("2") ? styles["bg-success"] : styles["bg-danger"]} rounded-full`} style={{ width: "12px", height: "12px" }}></div>
                          }
                          <span className="font-medium text-sm">{monitor.name}</span>
                        </div>
                        <div className="text-gray-500 text-xs overflow-hidden whitespace-nowrap text-ellipsis">{MonitorTypeLabelEnum[monitor.type as MonitorTypeEnum]} • {monitor.address}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end justify-center">
                      <div className="flex items-center">
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
                  <div className="flex justify-between items-center mt-0 sm:mt-2">
                    <span className="text-gray-500 text-xs">
                      {monitor.percentOnline}% disponível nos últimos 30 dias:
                    </span>
                    <div className="flex items-center gap-x-1">
                      <span className="text-gray-500 text-xs">Integrações:</span>
                      {monitor.integrationList ? (
                        monitor.integrationList.map((integration: any) => (
                          <Image src={integration.chatPlatformIconUrl} alt="" width={14} height={14} title={integration.chatPlatform} />
                        ))
                      ) :
                        <span className="text-gray-500 text-xs">Nenhuma</span>
                      }
                    </div>
                  </div>
                  <div className="flex gap-x-1 mt-1">
                    {monitor.historical.map((item: any) => (
                      <div style={{ width: "6px", height: "20px" }} className={`${getHistoricalClass(item)} ${styles["zoom"]} rounded-lg`} title={item.note}></div>
                    ))}
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