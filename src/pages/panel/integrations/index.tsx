import { Alert } from '@/lib/Alert';
import { NextPageWithLayout } from '@/pages/_app';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import IntegrationService from '@/services/IntegrationService';
import { CopyIcon, EditIcon, Play, SearchIcon } from 'lucide-react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Paginator } from 'primereact/paginator';
import { useEffect, useState, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';

type IFormSearchValues = {
  search: string;
}

export const getServerSideProps = (async (context) => {
  const { token } = context.req.cookies;
  const response = await IntegrationService.getIntegrationList(token as string, new URLSearchParams({ page: "0" }));

  return {
    props: {
      integrationResponse: response
    }
  }
}) satisfies GetServerSideProps<{}>

const Integrations: NextPageWithLayout = ({ integrationResponse }: any) => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<IFormSearchValues>();
  const { token, setLoading } = useGlobalProvider();
  const [integrationList, setIntegrationList] = useState(integrationResponse.data);
  const [pagination, setPagination] = useState({
    first: 0,
    rows: integrationResponse.pagination.rows,
    total: integrationResponse.pagination.total
  });

  useEffect(() => {
    setLoading(false);
  }, []);

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
            <Button text onClick={() => {
              setLoading(true);
              router.push(`/panel/integrations/edit/${integration.id}`);
            }} type="button">
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

  async function search(params: URLSearchParams) {
    setLoading(true);

    try {
      const response = await IntegrationService.getIntegrationList(token as string, params);

      setIntegrationList(response.data);

      setPagination(prev => ({
        ...prev,
        rows: response.pagination.rows,
        total: response.pagination.total
      }));
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setLoading(false);
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
    setLoading(true);

    try {
      const response = await IntegrationService.validateIntegration(token as string, id);
      Alert.success("", response.message);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setLoading(false);
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

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Integrações</h1>
        <div>
          <Button label="Adicionar" onClick={() => {
            setLoading(true);
            router.push("/panel/integrations/new");
          }} />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmitSearch)} className="grid grid-cols-12 mb-6">
        <div className="col-span-12 lg:col-span-4">
          <div className="p-inputgroup flex-1">
            <InputText {...register("search", { required: false })} placeholder="Pesquisar por nome ou endereço" className="p-inputtext-sm" />
            <Button severity="secondary">
              <SearchIcon size={12} />
            </Button>
          </div>
        </div>
      </form>

      <div>
        <div className="border-1 border-gray-200 rounded-lg">
          <DataTable
            dataKey="id"
            value={integrationList}
            size="small"
            showGridlines={false}
            stripedRows={false}
            scrollable={true}
            scrollHeight="80vh"
            emptyMessage="&#8203;"
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
      </div>
    </>
  )
}

Integrations.getLayout = function getLayout(page: ReactElement) {
  return page;
}

export default Integrations;