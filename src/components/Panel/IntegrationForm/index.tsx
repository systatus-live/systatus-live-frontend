"use client";

import Loading from '@/components/Loading';
import WebhookTutorial from '@/components/WebhookTutorial';
import { Alert } from '@/lib/Alert';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import ChatPlatformService from '@/services/ChatPlatformService';
import IntegrationService from '@/services/IntegrationService';
import { ChatPlatformEnum, ChatPlatformTypeEnum } from '@/types/ChatPlatformEnum';
import { EditIcon } from 'lucide-react';
import Image from 'next/image';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Sidebar } from 'primereact/sidebar';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

type IFormValues = {
  id?: string,
  chatPlatformId: string;
  name: string;
  address: string
}

export default function IntegrationForm(props: { integration: IFormValues | null, onClose?: Function; }) {
  const { token } = useGlobalProvider();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [chatPlatformList, setChatPlatformList] = useState([]);
  const [isOpenWebhookTutorial, setIsOpenWebhookTutorial] = useState(false);
  const [windowWidth, setWindowWidth] = useState<any>();

  const { register, handleSubmit, reset, setValue, watch, control, getValues } = useForm<IFormValues>(props.integration ? {
    values: {
      id: props.integration.id,
      chatPlatformId: props.integration.chatPlatformId,
      name: props.integration.name,
      address: props.integration.address
    }
  } : {});

  useEffect(() => {
    if (isOpen) {
      getChatPlatformList(new URLSearchParams());

      // Responsividade do Sidebar
      setWindowWidth(window.innerWidth);
      const handleResize = () => {
        setWindowWidth(window.innerWidth)
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isOpen]);

  function close() {
    reset();
    setIsOpen(false);

    if (props.onClose) {
      props.onClose();
    }
  }

  async function onSubmit(form: IFormValues) {
    setIsSubmitting(true);

    try {
      let response = null;

      if (props.integration) {
        response = await IntegrationService.updateIntegration(token as string, props.integration.id!, {
          chatPlatformId: form.chatPlatformId,
          name: form.name,
          address: form.address,
        })
      } else {
        response = await IntegrationService.createIntegration(token as string, {
          chatPlatformId: form.chatPlatformId,
          name: form.name,
          address: form.address,
        })
      }

      Alert.success("", response.message);

      close();
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
        Alert.success("", response.message);
        close();
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

  return (
    <>
      {isSubmitting && <Loading />}

      {props.integration ? (
        <Button title="Abrir" text onClick={() => setIsOpen(true)} type="button">
          <EditIcon height={14} width={14} />
        </Button>
      ) : (
        <Button label="Nova Integração" onClick={() => setIsOpen(true)} />
      )}

      <Sidebar
        header={<b className="text-xl">Como obter a URL do Webhook</b>}
        visible={isOpenWebhookTutorial}
        onHide={() => setIsOpenWebhookTutorial(false)}
        position="right"
        style={{ width: windowWidth >= 1366 ? "40vw" : windowWidth >= 1024 ? "50vw" : "100%" }}
      >
        <WebhookTutorial />
      </Sidebar>

      <Dialog
        header={props.integration ? "Editar Integração" : "Nova Integração"}
        visible={isOpen}
        onHide={() => {
          if (!isOpen) return;
          reset();
          setIsOpen(false);
        }}
        draggable={false}
        closeOnEscape={true}
        dismissableMask={false}
        style={{ width: "30rem" }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Nome <span className="text-red-500">*</span></label>
            <InputText {...register("name", { required: true })} placeholder="Ex.: Canal de DevOps" className="p-inputtext-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium">Plataforma <span className="text-red-500">*</span></label>
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
                    <Image src={option.iconUrl} alt="" width={16} height={16} />
                    <span>{option.description}</span>
                  </div>
                )}
                valueTemplate={(option) => (
                  option == null ?
                    <div>&#8203;</div> :
                    <div className="flex items-center gap-x-1">
                      <Image src={option.iconUrl} alt="" width={16} height={16} />
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
          <div className="flex justify-end space-x-2 mt-5">
            {props.integration && (
              <>
                <div>
                  <Button label="Excluir" text severity="danger" onClick={() => handleDelete(props.integration!.id!)} type="button" />
                </div>
              </>
            )}
            <div>
              <Button label="Salvar" text severity="success" type="submit" />
            </div>
          </div>
        </form>
      </Dialog>
    </>
  )
}