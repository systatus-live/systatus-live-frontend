import Button from '@/components/Button';
import Finder from '@/components/Finder';
import InputText from '@/components/InputText';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import { Alert } from '@/lib/Alert';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import ChatPlatformService from '@/services/ChatPlatformService';
import IntegrationService from '@/services/IntegrationService';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type IFormValues = {
  chatPlatformId: string;
  name: string;
  url: string
}

export default function NewIntegration(props: { onClose?: Function; }) {
  const [isSubmitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm<IFormValues>();
  const { token } = useGlobalProvider();

  function close() {
    reset();
    setShowModal(false);
  }

  async function onSubmit(form: IFormValues) {
    setSubmitting(true);

    try {
      const response = await IntegrationService.createIntegration(token as string, {
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
      setSubmitting(false);
    }
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

      <Button severity="secondary" onClick={() => setShowModal(true)}>Nova Integração</Button>

      {showModal && (
        <Modal title="Nova Integração">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Tipo <span className="text-red-500">*</span></label>
              <Finder
                code="id"
                label="description"
                options={() => getChatPlatformList(new URLSearchParams())}
                onSearch={(value) => getChatPlatformList(new URLSearchParams({ search: value }))}
                onChange={(option) => setValue("chatPlatformId", option.id)}
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
              <Button severity="info" onClick={() => close()} type="button">Cancelar</Button>
              <Button severity="success" type="submit">Salvar</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}