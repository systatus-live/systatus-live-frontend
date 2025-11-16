import Loading from '@/components/Loading';
import { Alert } from '@/lib/Alert';
import { NextPageWithLayout } from '@/pages/_app';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import MonitorService from '@/services/MonitorService';
import { CopyIcon, SearchIcon } from 'lucide-react';
import Head from 'next/head';
import { useEffect, useState, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import PanelLayout from '../layout';
import styles from "./styles.module.scss";
import NewMonitor from '@/components/Panel/Monitor/NewMonitor';
import { MonitorTypeEnum, MonitorTypeLabelEnum } from '@/types/MonitorTypeEnum';
import EditMonitor from '@/components/Panel/Monitor/EditMonitor';
import Image from 'next/image';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

type IFormSearchValues = {
  search: string;
}

const Monitors: NextPageWithLayout = () => {
  const [monitorList, setMonitorList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset } = useForm<IFormSearchValues>();
  const { token } = useGlobalProvider();

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
      Alert.success("", "URL copiada");
    } catch (err) { }
  };

  async function onSubmitSearch(form: IFormSearchValues) {
    await search(new URLSearchParams({ search: form.search, page: "0" }));
  }

  async function resetSearch() {
    reset();
    search(new URLSearchParams({ page: "0" }));
  }

  return (
    <>
      <Head>
        <title>Monitores • Systatus.Live</title>
      </Head>

      {isSubmitting && <Loading />}

      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-xl font-medium">Monitores</h1>
          <p className="mt-1 text-sm text-gray-500">Monitores de disponibilidade e status</p>
        </div>
        <div>
          <NewMonitor onClose={resetSearch} />
        </div>
      </div>
      <div className="bg-white shadow-lg border border-gray-200 rounded-sm mt-6 p-4" style={{ minHeight: "85vh" }}>
        <div className="grid grid-cols-1 gap-y-3">
          <form onSubmit={handleSubmit(onSubmitSearch)} className="flex items-center">
            <div className="p-inputgroup flex-1">
              <InputText {...register("search", { required: false })} placeholder="Pesquisar monitores" />
              <Button severity="secondary">
                <SearchIcon height={16} />
              </Button>
            </div>
            <div className="border border-gray-300 text-gray-900 rounded-sm ml-2 font-medium text-sm h-full flex items-center justify-center min-w-10" title="Total de registros">
              {total}
            </div>
          </form>
          {monitorList.map((monitor: any) => (
            <div key={monitor.id} className={`border border-gray-200 rounded-sm p-3 ${styles["monitor-grid"]}`}>
              <div className="flex flex-col justify-center text-sm overflow-hidden">
                <span>{monitor.name}</span>
                <div className="flex text-gray-600 gap-x-1 items-center mt-1">
                  <Image src={`https://www.google.com/s2/favicons?domain=${monitor.address}`} alt="" width={16} height={16} />
                  <div className="text-gray-500 text-xs overflow-hidden whitespace-nowrap text-ellipsis">{MonitorTypeLabelEnum[monitor.type as MonitorTypeEnum]} - {monitor.address}</div>
                  <div title="Copiar" className="cursor-pointer text-blue-700" onClick={() => handleCopyClick(monitor.address)}>
                    <CopyIcon height={12} width={12} />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <EditMonitor monitor={monitor} onClose={resetSearch} />
              </div>
            </div>
          ))}
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