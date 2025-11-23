import Loading from '@/components/Loading';
import { Alert } from '@/lib/Alert';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import ChatPlatformService from '@/services/ChatPlatformService';
import IntegrationService from '@/services/IntegrationService';
import { CheckIcon, CircleCheckIcon, EditIcon, PlayIcon, TrashIcon } from 'lucide-react';
import Image from 'next/image';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

type IFormValues = {
  id?: string,
  chatPlatformId: string;
  name: string;
  url: string
}

export default function IntegrationForm(props: { integration: IFormValues | null, onClose?: Function; }) {
  const { token } = useGlobalProvider();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [chatPlatformList, setChatPlatformList] = useState([]);
  const { register, handleSubmit, reset, setValue, watch, control } = useForm<IFormValues>(props.integration ? {
    values: {
      id: props.integration.id,
      chatPlatformId: props.integration.chatPlatformId,
      name: props.integration.name,
      url: props.integration.url
    }
  } : {});

  useEffect(() => {
    if (isOpen) {
      register("chatPlatformId", {
        required: true
      });

      getChatPlatformList(new URLSearchParams());
    }
  }, [isOpen]);

  function close() {
    reset();
    setIsOpen(false);
  }

  async function onSubmit(form: IFormValues) {
    setIsSubmitting(true);

    try {
      let response = null;

      if (props.integration) {
        response = await IntegrationService.updateIntegration(token as string, props.integration.id!, {
          chatPlatformId: form.chatPlatformId,
          name: form.name,
          url: form.url,
        })
      } else {
        response = await IntegrationService.createIntegration(token as string, {
          chatPlatformId: form.chatPlatformId,
          name: form.name,
          url: form.url,
        })
      }

      Alert.success("", response.message);
      close();
      if (props.onClose) {
        props.onClose();
      }
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
        if (props.onClose) {
          props.onClose();
        }
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
      {isSubmitting && <Loading />}

      {props.integration ? (
        <Button title="Abrir" text severity="info" onClick={() => setIsOpen(true)} type="button">
          <EditIcon height={14} width={14} />
        </Button>
      ) : (
        <Button label="Nova Integração" onClick={() => setIsOpen(true)} />
      )}

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
            <label className="block text-sm font-medium">URL Webhook <span className="text-red-500">*</span></label>
            <InputText {...register("url", { required: true })} placeholder="https://..." className="p-inputtext-sm" />
          </div>
          <div className="flex justify-end space-x-2 mt-5">
            {props.integration && (
              <>
                <div>
                  <Button label="Excluir" text severity="danger" onClick={() => handleDelete(props.integration!.id!)} type="button" />
                </div>
                <div>
                  <Button label="Testar" text severity="info" onClick={() => handleValidate(props.integration!.id!)} type="button" />
                </div>
              </>
            )}
            <div>
              <Button label="Confirmar" text severity="success" type="submit" />
            </div>
          </div>
        </form>
      </Dialog>
    </>
  )
}