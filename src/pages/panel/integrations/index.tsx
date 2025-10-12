import Button from '@/components/Button';
import InputText from '@/components/InputText';
import { IntegrationTypeEnum, IntegrationTypeLabelEnum } from '@/enums/IntegrationTypeEnum';
import { Alert } from '@/lib/Alert';
import { NextPageWithLayout } from '@/pages/_app';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import IntegrationService from '@/services/IntegrationService';
import { CopyIcon, EditIcon, PlayIcon, SearchIcon, TrashIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import PanelLayout from '../layout';
import styles from "./styles.module.scss";
import NewIntegration from '@/components/integration/NewIntegration';

interface IFormSearchValues {
  search: string;
}

const Integrations: NextPageWithLayout = () => {
  const [integrationList, setIntegrationList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [isSubmeting, setIsSubmeting] = useState(false);

  const { register, handleSubmit, reset } = useForm<IFormSearchValues>();
  const { token } = useGlobalProvider();

  const integrationIcon = {
    [IntegrationTypeEnum.DISCORD]: "/logos/discord.svg",
    [IntegrationTypeEnum.GOOGLE_CHAT]: "/logos/google-chat.svg",
    [IntegrationTypeEnum.SLACK]: "/logos/slack.svg"
  }

  useEffect(() => {
    if (token) {
      search(new URLSearchParams({ page: "0" }));
    }
  }, [token]);

  async function search(params: URLSearchParams) {
    if (isSubmeting) return;

    if (params.has("page")) {
      setPage(parseInt(params.get("page") as string));
    }

    setIsSubmeting(true);

    try {
      const { data, total } = await IntegrationService.getIntegrationList(token as string, params);
      setTotal(total);
      setIntegrationList(data);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setIsSubmeting(false);
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
    setIsSubmeting(true);

    try {
      const response = await IntegrationService.deleteIntegrationList(token as string, id);
      Alert.success("", response.message);
      resetSearch()
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setIsSubmeting(false);
    }
  }

  return (
    <div>
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
            <Button severity="secondary" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, padding: "0.25rem" }} className="h-full" disabled={isSubmeting}>
              <SearchIcon height={16} />
            </Button>
            <div className="border border-gray-300 text-gray-900 rounded-sm ml-2 font-medium text-sm h-full flex items-center justify-center min-w-10" title="Total de registros">
              {total}
            </div>
          </form>
          {integrationList.map((integration: any) => (
            <div key={integration.id} className={`border border-gray-200 rounded-sm p-3 ${styles["integration-grid"]}`}>
              <div className="rounded-full flex flex-col items-center justify-center text-center w-20">
                <div style={{ position: "relative", height: "26px", width: "26px" }}>
                  <Image src={integrationIcon[integration.type as IntegrationTypeEnum]} alt={integration.type} fill={true} style={{ objectFit: "contain" }} />
                </div>
                <span className="text-xs mt-1">{IntegrationTypeLabelEnum[integration.type as IntegrationTypeEnum]}</span>
              </div>
              <div className="flex flex-col justify-center text-sm overflow-hidden">
                <div>{integration.name}</div>
                <div className="flex text-gray-600 gap-x-2 items-center mt-1">
                  <div className="text-gray-500 text-xs overflow-hidden whitespace-nowrap text-ellipsis">{integration.url}</div>
                  <div title="Copiar" className="cursor-pointer text-blue-700" onClick={() => handleCopyClick(integration.url)}>
                    <CopyIcon height={12} width={12} />
                  </div>
                </div>
                <div className="flex gap-x-1 mt-2">
                  <Button title="Editar" severity="secondary" outlined={true} onClick={() => { }} style={{ padding: "0.25rem" }}>
                    <EditIcon height={12} width={12} />
                  </Button>
                  <Button title="Testar" severity="info" outlined={true} onClick={() => { }} style={{ padding: "0.25rem" }}>
                    <PlayIcon height={12} width={12} />
                  </Button>
                  <Button title="Excluir" severity="danger" outlined={true} onClick={() => handleDelete(integration.id)} style={{ padding: "0.25rem" }}>
                    <TrashIcon height={12} width={12} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
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