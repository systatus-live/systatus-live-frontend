import Button from '@/components/Button';
import InputText from '@/components/InputText';
import Loading from '@/components/Loading';
import EditIntegration from '@/components/Panel/Integration/EditIntegration';
import NewIntegration from '@/components/Panel/Integration/NewIntegration';
import { Alert } from '@/lib/Alert';
import { NextPageWithLayout } from '@/pages/_app';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import IntegrationService from '@/services/IntegrationService';
import { CopyIcon, SearchIcon } from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import PanelLayout from '../layout';
import styles from "./styles.module.scss";

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

  async function handleDelete(id: string) {
    Alert.confirm("Excluir integração", "A integração será excluída permanentemente. Continuar?", async () => {
      setIsSubmitting(true);

      try {
        const response = await IntegrationService.deleteIntegration(token as string, id);
        Alert.success("", response.message);
        resetSearch()
      } catch (error: any) {
        Alert.error("", error.message);
      } finally {
        setIsSubmitting(false);
      }
    });
  }

  return (
    <>
      <Head>
        <title>Integrações • Systatus.Live</title>
      </Head>

      {isSubmitting && <Loading />}

      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-xl font-medium">Integrações</h1>
          <p className="mt-1 text-sm text-gray-500">Integrações para receber notificações</p>
        </div>
        <div>
          <NewIntegration onClose={resetSearch} />
        </div>
      </div>
      <div className="bg-white shadow-lg border border-gray-200 rounded-sm mt-6 p-4" style={{ minHeight: "85vh" }}>
        <div className="grid grid-cols-1 gap-y-3">
          <form onSubmit={handleSubmit(onSubmitSearch)} className="flex items-center">
            <InputText {...register("search", { required: false })} style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }} placeholder="Pesquisar integrações" />
            <Button severity="secondary" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, padding: "0.25rem" }} className="h-full">
              <SearchIcon height={16} />
            </Button>
            <div className="border border-gray-300 text-gray-900 rounded-sm ml-2 font-medium text-sm h-full flex items-center justify-center min-w-10" title="Total de registros">
              {total}
            </div>
          </form>
          {integrationList.map((integration: any) => (
            <div key={integration.id} className={`border border-gray-200 rounded-sm p-3 ${styles["integration-grid"]}`}>
              <div className="flex flex-col justify-center overflow-hidden">
                <span style={{ fontSize: "0.95rem" }} >{integration.name}</span>
                <div className="flex text-gray-600 gap-x-1 items-center mt-1">
                  <Image src={integration.chatPlatformIconUrl} alt="" width={16} height={16} />
                  <div className="text-gray-500 text-xs overflow-hidden whitespace-nowrap text-ellipsis">{integration.chatPlatform} - {integration.url}</div>
                  <div title="Copiar" className="cursor-pointer text-blue-700" onClick={() => handleCopyClick(integration.url)}>
                    <CopyIcon height={12} width={12} />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <EditIntegration integration={integration} onClose={resetSearch} />
              </div>
            </div>
          ))}
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