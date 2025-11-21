import Loading from '@/components/Loading';
import IntegrationForm from '@/components/Panel/IntegrationForm';
import { Alert } from '@/lib/Alert';
import { NextPageWithLayout } from '@/pages/_app';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import IntegrationService from '@/services/IntegrationService';
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

const Integrations: NextPageWithLayout = () => {
  const [integrationList, setIntegrationList] = useState([]);
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
      const { data, total } = await IntegrationService.getIntegrationList(token as string, params);
      setTotal(total);
      setIntegrationList(data);
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

  return (
    <>
      <Head>
        <title>Integrações • Systatus.Live</title>
      </Head>

      {isSubmitting && <Loading />}

      <div className="flex items-center justify-between px-6 py-4 bg-white shadow">
        <div className="flex flex-col">
          <h1 className="text-xl font-medium">Integrações</h1>
          <p className="mt-1 text-sm text-gray-500">Integrações para receber notificações</p>
        </div>
        <div>
          <IntegrationForm integration={null} onClose={resetSearch} />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmitSearch)} className="grid grid-cols-1 lg:grid-cols-3 px-6 py-6">
        <div className="p-inputgroup flex-1">
          <InputText {...register("search", { required: false })} placeholder="Pesquisar integrações" className="p-inputtext-sm" />
          <Button severity="secondary">
            <SearchIcon height={16} />
          </Button>
        </div>
      </form>

      <div className="px-6">
        <div className="grid grid-cols-1 gap-y-3 shadow border-t-1 border-gray-200 rounded-lg p-1 bg-white">
          <DataView 
            value={integrationList} 
            listTemplate={(list: any, index) => (
              list.map((integration: any) => (
                <div key={integration.id} className="grid grid-cols-2 gap-y-2 border-b-1 border-gray-200 py-3 px-4">
                  <div key={integration.id} className="flex items-center gap-x-3 items-center">
                    <div style={{ position: "relative", width: 16, height: 16 }}>
                      <Image src={integration.chatPlatformIconUrl} alt="" fill />
                    </div>
                    <div className="flex flex-col justify-center w-full overflow-hidden">
                      <span className="font-medium text-sm">{integration.name}</span>
                      <div className="flex items-center gap-x-2">
                        <div className="text-gray-500 text-xs overflow-hidden whitespace-nowrap text-ellipsis">{integration.chatPlatform} • {integration.url}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-x-4">
                    <div title="Abrir">
                      <IntegrationForm integration={integration} onClose={resetSearch} />
                    </div>
                    <div title="Copiar URL">
                      <Button title="Copiar" text severity="info" onClick={() => handleCopyClick(integration.url)} type="button">
                        <CopyIcon height={14} width={14} />
                      </Button>
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

Integrations.getLayout = function getLayout(page: ReactElement) {
  return (
    <PanelLayout>
      {page}
    </PanelLayout>
  )
}

export default Integrations;