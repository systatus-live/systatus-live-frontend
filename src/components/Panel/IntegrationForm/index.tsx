"use client";

import Loading from '@/components/Loading';
import WebhookTutorial from '@/components/Panel/WebhookTutorial';
import { Alert } from '@/lib/Alert';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import ChatPlatformService from '@/services/ChatPlatformService';
import IntegrationService from '@/services/IntegrationService';
import { ChatPlatformEnum, ChatPlatformTypeEnum } from '@/types/ChatPlatformEnum';
import formatDate from '@/utils/formatDate';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Sidebar } from 'primereact/sidebar';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

type IFormValues = {
  id?: string,
  chatPlatformId: string;
  name: string;
  address: string,
  createdAt?: string;
}

export default function IntegrationForm(props: { id: string | null }) {
  const router = useRouter();
  const { token } = useGlobalProvider();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatPlatformList, setChatPlatformList] = useState([]);
  const [isOpenWebhookTutorial, setIsOpenWebhookTutorial] = useState(false);
  const [windowWidth, setWindowWidth] = useState<any>();

  const { register, handleSubmit, reset, setValue, watch, control, getValues } = useForm<IFormValues>({});

  useEffect(() => {
    // Responsividade do Sidebar
    setWindowWidth(window.innerWidth);
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (token) {
      (async () => {
        await getChatPlatformList(new URLSearchParams());

        if (props.id) {
          await getIntegration(props.id);
        }
      })();
    }
  }, [token]);

  async function handleSave(form: IFormValues) {
    setIsSubmitting(true);

    try {
      let response = null;

      const payload = {
        chatPlatformId: form.chatPlatformId,
        name: form.name,
        address: form.address
      }

      if (props.id) {
        response = await IntegrationService.updateIntegration(token as string, props.id, payload);
      } else {
        response = await IntegrationService.createIntegration(token as string, payload);
        router.replace(`/panel/integrations/edit/${response.data.id}`);
      }

      Alert.success("", response.message);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    Alert.confirm("Excluir integração", "A integração será excluída permanentemente. Continuar?", async () => {
      setIsSubmitting(true);

      try {
        const response = await IntegrationService.deleteIntegration(token as string, id);
        router.replace("/panel/integrations");
        Alert.success("", response.message);
      } catch (error: any) {
        Alert.error("", error.message);
      } finally {
        setIsSubmitting(false);
      }
    });
  }

  async function getChatPlatformList(params: URLSearchParams) {
    params.set("page", "0");

    try {
      const { data } = await ChatPlatformService.getChatPlatformList(token as string, params);
      setChatPlatformList(data);
    } catch (error: any) {
      Alert.error("", error.message);
      return [];
    }
  }

  function getAddressLabel(id: string) {
    const platform: any = chatPlatformList.find((row: any) => row.id == id);

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
    const platform: any = chatPlatformList.find((row: any) => row.id == getValues("chatPlatformId"));
    if (platform && platform.type == ChatPlatformTypeEnum.WEBHOOK) {
      return <small className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer" onClick={() => setIsOpenWebhookTutorial(true)}>Como obter a URL do Webhook?</small>
    }
    return <></>
  }

  async function getIntegration(id: string) {
    try {
      const response = await IntegrationService.getIntegrationById(token as string, id);

      reset({
        id: response.id,
        name: response.name,
        chatPlatformId: response.chatPlatformId,
        address: response.address,
        createdAt: formatDate(response.createdAt, "D [de] MMMM [de] YYYY"),
      })
    } catch (error: any) {
      if (error.status == 404) {
        await router.push("/panel/integrations");
      }
      Alert.error("", error.message);
    }
  }

  return (
    <>
      {isSubmitting && <Loading />}

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

      <form onSubmit={handleSubmit(handleSave)} className="space-y-3">
        <div>
          <label className="block font-medium">Nome <span className="text-red-500">*</span></label>
          <InputText {...register("name", { required: true })} placeholder="Ex.: Canal de DevOps" className="p-inputtext-sm" />
        </div>
        <div>
          <label className="block font-medium">Plataforma <span className="text-red-500">*</span></label>
          <Controller name="chatPlatformId" control={control} rules={{ required: true }} render={({ field }) => (
            <Dropdown
              {...field}
              inputRef={field.ref}
              value={watch("chatPlatformId")}
              onChange={(option) => setValue("chatPlatformId", option.value)}
              options={chatPlatformList}
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
        <div>
          <label className="block text-sm font-medium">{getAddressLabel(watch("chatPlatformId"))} <span className="text-red-500">*</span></label>
          <InputText {...register("address", { required: true })} className="p-inputtext-sm" />
          {watch("chatPlatformId") && getWebhookLabel()}
        </div>
        {props.id ?
          <div>
            <label className="block">Data de cadastro</label>
            <InputText {...register("createdAt", { required: false, disabled: true })} className="p-inputtext-sm" />
          </div>
          : <></>
        }
        <div className="flex space-x-4 mt-5">
          <Button label="Salvar" severity="success" type="submit" />
          {props.id && <Button label="Excluir" text severity="danger" onClick={() => handleDelete(props.id!)} type="button" />}
        </div>
      </form>
    </>
  )
}