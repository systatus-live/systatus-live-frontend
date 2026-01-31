import WebhookTutorial from '@/components/Panel/WebhookTutorial';
import { Alert } from '@/lib/Alert';
import { NextPageWithLayout } from '@/pages/_app';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import ChatPlatformService from '@/services/ChatPlatformService';
import IntegrationService from '@/services/IntegrationService';
import { ChatPlatformEnum, ChatPlatformTypeEnum } from '@/types/ChatPlatformEnum';
import { ArrowLeftSquare } from 'lucide-react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from "next/image";
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Sidebar } from 'primereact/sidebar';
import { useEffect, useState, type ReactElement } from 'react';
import { Controller, useForm } from 'react-hook-form';

type IFormValues = {
  chatPlatformId: string;
  name: string;
  address: string
}

export const getServerSideProps = (async (context) => {
  const { token } = context.req.cookies;

  const { data: chatPlatformResponse } = await await ChatPlatformService.getChatPlatformList(token as string, new URLSearchParams({ page: "0" }));

  return {
    props: {
      chatPlatformResponse: chatPlatformResponse
    }
  }
}) satisfies GetServerSideProps<{}>

const NewIntegration: NextPageWithLayout = ({ chatPlatformResponse }: any) => {
  const router = useRouter();
  const { token, setLoading } = useGlobalProvider();
  const [isOpenWebhookTutorial, setIsOpenWebhookTutorial] = useState(false);
  const [windowWidth, setWindowWidth] = useState<any>();

  const { register, handleSubmit, reset, setValue, watch, control, getValues } = useForm<IFormValues>({});

  useEffect(() => {
    setLoading(false);

    // Responsividade do Sidebar
    setWindowWidth(window.innerWidth);
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function handleSave(form: IFormValues) {
    setLoading(true);

    try {
      const payload = {
        chatPlatformId: form.chatPlatformId,
        name: form.name,
        address: form.address
      }

      const response = await IntegrationService.createIntegration(token as string, payload);

      setLoading(true);
      Alert.success("", response.message);

      router.replace(`/panel/integrations/edit/${response.data.id}`);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    Alert.confirm("Excluir integração", "A integração será excluída permanentemente. Continuar?", async () => {
      setLoading(true);

      try {
        const response = await IntegrationService.deleteIntegration(token as string, id);
        router.replace("/panel/integrations");
        Alert.success("", response.message);
      } catch (error: any) {
        Alert.error("", error.message);
      } finally {
        setLoading(false);
      }
    });
  }

  function getAddressLabel(id: string) {
    const platform: any = chatPlatformResponse.find((row: any) => row.id == id);

    if (!platform) {
      return "URL Webhook";
    }

    switch (platform.name) {
      case ChatPlatformEnum.EMAIL:
        return "E-mail";
      case ChatPlatformEnum.WHATSAPP:
        return "Telefone";
      default:
        return "URL Webhook"
    }
  }

  function getWebhookLabel() {
    const platform: any = chatPlatformResponse.find((row: any) => row.id == getValues("chatPlatformId"));
    if (platform && platform.type == ChatPlatformTypeEnum.WEBHOOK) {
      return <small className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer" onClick={() => setIsOpenWebhookTutorial(true)}>Como obter a URL do Webhook?</small>
    }
    return <></>
  }

  return (
    <>
      <Head>
        <title>Integrações • Systatus.Live</title>
      </Head>

      <Sidebar
        header={<b className="text-xl">Como obter a URL do Webhook</b>}
        visible={isOpenWebhookTutorial}
        onHide={() => setIsOpenWebhookTutorial(false)}
        position="right"
        style={{ width: windowWidth >= 1366 ? "40vw" : windowWidth >= 1024 ? "50vw" : "100%" }}
        modal={false}
        closeOnEscape={false}
        dismissable={false}
      >
        <WebhookTutorial />
      </Sidebar>

      <div className="flex items-center space-x-2 mb-6">
        <ArrowLeftSquare className="cursor-pointer" onClick={() => router.back()} />
        <h1 className="text-xl font-bold">Nova Integração</h1>
      </div>
      <div>
        <form onSubmit={handleSubmit(handleSave)} className="grid grid-cols-12 gap-3 border-1 border-gray-200 p-6 rounded-lg">
          <div className="col-span-12 lg:col-span-8">
            <label className="block font-medium">Nome <span className="text-red-500">*</span></label>
            <InputText {...register("name", { required: true })} maxLength={30} placeholder="Ex.: Canal de DevOps" className="p-inputtext-sm" />
            <small>{watch("name")?.length ?? 0}/30</small>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <label className="block font-medium">Plataforma <span className="text-red-500">*</span></label>
            <Controller name="chatPlatformId" control={control} rules={{ required: true }} render={({ field }) => (
              <Dropdown
                {...field}
                inputRef={field.ref}
                value={watch("chatPlatformId")}
                onChange={(option) => setValue("chatPlatformId", option.value)}
                options={chatPlatformResponse}
                optionLabel="description"
                optionValue="id"
                filter={true}
                itemTemplate={(option) => (
                  <div className="flex items-center gap-x-1">
                    <Image src={option.iconUrl} alt="." width={16} height={16} />
                    <span>{option.description}</span>
                  </div>
                )}
                valueTemplate={(option) => (
                  option == null ?
                    <div>&#8203;</div> :
                    <div className="flex items-center gap-x-1">
                      <Image src={option.iconUrl} alt="." width={16} height={16} />
                      <span>{option.description}</span>
                    </div>
                )}
                className="p-inputtext-sm"
              />
            )} />
          </div>
          <div className="col-span-12">
            <label className="block text-sm font-medium">{getAddressLabel(watch("chatPlatformId"))} <span className="text-red-500">*</span></label>
            <InputText {...register("address", { required: true })} className="p-inputtext-sm" />
            <div className="space-x-6">
              <small>{watch("address")?.length ?? 0}/1000</small>
              {watch("chatPlatformId") && getWebhookLabel()}
            </div>
          </div>
          <div className="flex space-x-4 mt-5 col-span-12">
            <Button label="Salvar" severity="success" type="submit" />
          </div>
        </form>
      </div>
    </>
  )
}

NewIntegration.getLayout = function getLayout(page: ReactElement) {
  return page;
}

export default NewIntegration;