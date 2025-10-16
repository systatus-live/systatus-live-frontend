import Button from '@/components/Button';
import Finder from '@/components/Finder';
import InputText from '@/components/InputText';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import { Alert } from '@/lib/Alert';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import ChatPlatformService from '@/services/ChatPlatformService';
import IntegrationService from '@/services/IntegrationService';
import { Edit2Icon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type IFormValues = {
  id: string,
  chatPlatformId: string;
  name: string;
  url: string
}

export default function EditIntegration(props: { integration: IFormValues, onClose?: Function; }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { register, handleSubmit, reset, setValue, getValues } = useForm<IFormValues>({
    values: {
      id: props.integration.id,
      chatPlatformId: props.integration.chatPlatformId,
      name: props.integration.name,
      url: props.integration.url
    }
  });
  const { token } = useGlobalProvider();

  function close() {
    reset();
    setShowModal(false);
  }

  async function onSubmit(form: IFormValues) {
    setIsSubmitting(true);

    try {
      const response = await IntegrationService.updateIntegration(token as string, props.integration.id, {
        chatPlatformId: form.chatPlatformId,
        name: form.name,
        url: form.url,
      })
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

  async function getChatPlatformList(params: URLSearchParams): Promise<[]> {
    params.set("page", "0");

    try {
      const { data } = await ChatPlatformService.getChatPlatformList(token as string, params);
      return data;
    } catch (error: any) {
      Alert.error("", error.message);
      return [];
    }
  }

  return (
    <>
      {isSubmitting && <Loading />}

      <Button title="Editar" severity="secondary" onClick={() => setShowModal(true)} style={{ padding: "0.25rem" }} outlined={true}>
        <Edit2Icon height={12} width={12} />
      </Button>

      {showModal && (
        <Modal title="Editar Integração">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Tipo <span className="text-red-500">*</span></label>
              <Finder
                code="id"
                label="description"
                options={() => getChatPlatformList(new URLSearchParams())}
                onSearch={(value) => getChatPlatformList(new URLSearchParams({ search: value }))}
                onChange={(option) => setValue("chatPlatformId", option.id)}
                defaultValue={getValues("chatPlatformId")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Nome <span className="text-red-500">*</span></label>
              <InputText {...register("name", { required: true })} placeholder="Ex.: Canal de DevOps" />
            </div>
            <div>
              <label className="block text-sm font-medium">URL Webhook <span className="text-red-500">*</span></label>
              <InputText {...register("url", { required: true })} placeholder="https://..." />
            </div>
            <div className="flex justify-end space-x-2 mt-5">
              <Button severity="info" onClick={() => close()} type="button" outlined={true}>Cancelar</Button>
              <Button title="Excluir" severity="danger" onClick={() => handleDelete(props.integration.id)} type="button" outlined={true}>Excluir</Button>
              <Button severity="success" type="submit">Salvar</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}