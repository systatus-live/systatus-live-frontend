import Loading from '@/components/Loading';
import { Alert } from '@/lib/Alert';
import { NextPageWithLayout } from '@/pages/_app';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import IntegrationService from '@/services/IntegrationService';
import { CopyIcon, EditIcon, Play, SearchIcon } from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Paginator } from 'primereact/paginator';
import { Skeleton } from 'primereact/skeleton';
import { useEffect, useState, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import PanelLayout from '../layout';

type IFormSearchValues = {
  search: string;
}

const Integrations: NextPageWithLayout = () => {
  const router = useRouter();
  const [integrationList, setIntegrationList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstLoading, setFirstLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm<IFormSearchValues>();
  const { token } = useGlobalProvider();
  const [pagination, setPagination] = useState({
    first: 0,
    rows: 0,
    total: 0
  });

  const tableColumnList = [
    {
      title: "Integração",
      template: (integration: any) => (
        <div key={integration.id} className="flex items-center gap-x-3 items-center">
          <div style={{ position: "relative", width: 16, height: 16 }}>
            <Image src={integration.chatPlatformIconUrl} alt="." fill />
          </div>
          <div className="flex flex-col justify-center w-full overflow-hidden">
            <span className="font-medium">{integration.name}</span>
            <div className="flex items-center gap-x-2">
              <div className="text-gray-500 text-sm overflow-hidden whitespace-nowrap text-ellipsis">{integration.chatPlatform} • {integration.address}</div>
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
            <Button text onClick={() => router.push(`/panel/integrations/edit/${integration.id}`)} type="button">
              <EditIcon height={14} width={14} />
            </Button>
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

    try {
      const response = await IntegrationService.getIntegrationList(token as string, params);

      setIntegrationList(response.data);
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
        <title>Integrações • Systatus.Live</title>
      </Head>

      {isSubmitting && <Loading />}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Integrações</h1>
        <div>
          <Button label="Adicionar" onClick={() => router.push("/panel/integrations/new")} />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmitSearch)} className="grid grid-cols-1 lg:grid-cols-3 mb-6">
        <div className="p-inputgroup flex-1">
          <InputText {...register("search", { required: false })} placeholder="Pesquisar por nome ou endereço" className="p-inputtext-sm" />
          <Button severity="secondary">
            <SearchIcon height={16} />
          </Button>
        </div>
      </form>

      <div>
        {firstLoading ? (
          <Skeleton width="100%" height="10vh"></Skeleton>
        ) : (
          <div className="border-1 border-gray-200 rounded-lg">
            <DataTable
              dataKey="id"
              value={integrationList}
              size="small"
              showGridlines={false}
              stripedRows={false}
              scrollable={true}
              scrollHeight="80vh"
            >
              {tableColumnList.map((col, index) => (
                <Column key={index} header={col.title} body={col.template} style={{ width: col.width }} />
              ))}
            </DataTable>
            <div className="flex items-center justify-center space-x-4">
              <Paginator
                first={pagination.first}
                rows={pagination.rows}
                totalRecords={pagination.total}
                onPageChange={onPageChange}
                template={{ layout: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink" }}
              />
              <small>{pagination.total} integrações</small>
            </div>
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