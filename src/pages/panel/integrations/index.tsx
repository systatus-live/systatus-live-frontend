import Loading from '@/components/Loading';
import IntegrationForm from '@/components/Panel/IntegrationForm';
import { Alert } from '@/lib/Alert';
import { NextPageWithLayout } from '@/pages/_app';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import IntegrationService from '@/services/IntegrationService';
import { CopyIcon, Play, SearchIcon } from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import PanelLayout from '../layout';
import { Skeleton } from 'primereact/skeleton';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

type IFormSearchValues = {
  search: string;
}

const Integrations: NextPageWithLayout = () => {
  const [integrationList, setIntegrationList] = useState([]);
  const [page, setPage] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstLoading, setFirstLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm<IFormSearchValues>();
  const { token } = useGlobalProvider();

  const tableColumnList = [
    {
      title: "Integração",
      template: (integration: any) => (
        <div key={integration.id} className="flex items-center gap-x-3 items-center">
          <div style={{ position: "relative", width: 16, height: 16 }}>
            <Image src={integration.chatPlatformIconUrl} alt="" fill />
          </div>
          <div className="flex flex-col justify-center w-full overflow-hidden">
            <span className="font-medium text-sm">{integration.name}</span>
            <div className="flex items-center gap-x-2">
              <div className="text-gray-500 text-xs overflow-hidden whitespace-nowrap text-ellipsis">{integration.chatPlatform} • {integration.address}</div>
            </div>
          </div>
        </div>
      ),
      width: "100%"
    },
    {
      title: "Ações",
      template: (integration: any) => (
        <div className="flex">
          <div title="Abrir">
            <IntegrationForm integration={integration} onClose={resetSearch} />
          </div>
          <div title="Testar">
            <Button text onClick={() => handleValidate(integration.id)} type="button">
              <Play height={14} width={14} />
            </Button>
          </div>
          <div title="Copiar URL">
            <Button title="Copiar" text onClick={() => handleCopyClick(integration.address)} type="button">
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

    if (params.has("page")) {
      setPage(parseInt(params.get("page") as string));
    }

    try {
      const { data, total } = await IntegrationService.getIntegrationList(token as string, params);
      setIntegrationList(data);
      setFirstLoading(false);
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

  async function handleValidate(id: string) {
    setIsSubmitting(true);

    try {
      const response = await IntegrationService.validateIntegration(token as string, id);
      Alert.success("", response.message);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Integrações • Systatus.Live</title>
      </Head>

      {isSubmitting && <Loading />}

      <div className="flex items-center justify-between px-6 py-4 bg-white">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold">Integrações</h1>
          <p className="mt-1 text-sm text-gray-500">Receba notificações imediatas quando seus serviços ficarem indisponíveis por e-mail, Slack, Google Chat, Discord e outros canais.</p>
        </div>
        <div>
          <IntegrationForm integration={null} onClose={resetSearch} />
        </div>
      </div>

      <div className="px-6">
        {firstLoading ? (
          <Skeleton width="100%" height="10vh"></Skeleton>
        ) : (
          <div>
            <DataTable
              dataKey="id"
              value={integrationList}
              size="small"
              showGridlines={false}
              stripedRows={false}
              header={
                <form onSubmit={handleSubmit(onSubmitSearch)} className="grid grid-cols-1 lg:grid-cols-3">
                  <div className="p-inputgroup flex-1">
                    <InputText {...register("search", { required: false })} placeholder="Pesquisar integrações" className="p-inputtext-sm" />
                    <Button severity="secondary">
                      <SearchIcon height={16} />
                    </Button>
                  </div>
                </form>
              }
              scrollable={true}
              scrollHeight="80vh"
            >
              {tableColumnList.map((col, index) => (
                <Column key={index} header={col.title} body={col.template} style={{ width: col.width }} />
              ))}
            </DataTable>
          </div>
        )}
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