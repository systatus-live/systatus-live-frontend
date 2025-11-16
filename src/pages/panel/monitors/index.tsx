import Loading from '@/components/Loading';
import NewMonitor from '@/components/Panel/Monitor/NewMonitor';
import { Alert } from '@/lib/Alert';
import { NextPageWithLayout } from '@/pages/_app';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import MonitorService from '@/services/MonitorService';
import { MonitorTypeEnum, MonitorTypeLabelEnum } from '@/types/MonitorTypeEnum';
import { CopyIcon, SearchIcon } from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import PanelLayout from '../layout';

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
      Alert.success("", "Endereço copiado");
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
      <div className="mt-6">
        <div className="grid grid-cols-1 gap-y-3">
          <form onSubmit={handleSubmit(onSubmitSearch)} className="flex items-center">
            <div className="p-inputgroup flex-1">
              <InputText {...register("search", { required: false })} placeholder="Pesquisar monitores" className="p-inputtext-sm" />
              <Button severity="secondary">
                <SearchIcon height={16} />
              </Button>
            </div>
            <div className="border border-gray-300 text-gray-900 rounded-sm ml-2 font-medium text-sm h-full flex items-center justify-center min-w-10" title="Total de registros">
              {total}
            </div>
          </form>

          <DataView 
            value={monitorList} 
            listTemplate={(list: any, index) => (
              list.map((monitor: any) => (
                <div key={monitor.id} className="py-2 border-t-1 border-gray-200">
                  <div className="flex flex-col justify-center">
                    <span className="font-medium">{monitor.name}</span>
                    <div className="flex items-center mt-1 gap-x-2">
                      <div title="Abrir">
                        {/* <IntegrationForm integration={integration} onClose={resetSearch} /> */}
                      </div>
                      <div title="Copiar endereço">
                        <CopyIcon height={14} width={14} className="cursor-pointer text-blue-700" onClick={() => handleCopyClick(monitor.address)}  />
                      </div>
                      <span className="text-gray-500 text-sm"> • </span>
                      <div className="flex gap-x-1 items-center overflow-hidden">
                        <Image src={`https://www.google.com/s2/favicons?domain=${monitor.address}`} alt="&#8203;" width={16} height={16} />
                        <div className="text-gray-500 text-sm overflow-hidden whitespace-nowrap text-ellipsis">{MonitorTypeLabelEnum[monitor.type as MonitorTypeEnum]} • {monitor.address}</div>
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