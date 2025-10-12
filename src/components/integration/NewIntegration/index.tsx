import Button from '@/components/Button';
import InputDropdown from '@/components/InputDropdown';
import InputText from '@/components/InputText';
import Modal from '@/components/Modal';
import InputDropdownOption from '@/enums/InputDropdownOption';
import { IntegrationTypeEnum, IntegrationTypeLabelEnum } from '@/enums/IntegrationTypeEnum';
import { Alert } from '@/lib/Alert';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import IntegrationService from '@/services/IntegrationService';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface IFormValues {
  type: IntegrationTypeEnum;
  name: string;
  url: string
}

export default function NewIntegration(props: { onClose?: Function; }) {
  const [isSubmitting, setSubmitting] = useState(false);
  const [integrationList, setIntegrationList] = useState<InputDropdownOption[]>([]);
  const [showModal, setShowModal] = useState(false);

  const { register, handleSubmit, reset } = useForm<IFormValues>();
  const { token } = useGlobalProvider();

  useEffect(() => {
    setIntegrationList(Object.keys(IntegrationTypeEnum).map(key => ({ value: key, label: IntegrationTypeLabelEnum[key as IntegrationTypeEnum] })));
  }, []);

  function close() {
    reset();
    setShowModal(false);
  }

  async function onSubmit(form: IFormValues) {
    setSubmitting(true);

    try {
      const response = await IntegrationService.createIntegration(token as string, {
        type: form.type,
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

  return (
    <>
      <Button severity="secondary" onClick={() => setShowModal(true)}>Nova Integração</Button>

      {showModal && (
        <Modal title="Nova Integração">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Tipo <span className="text-red-500">*</span></label>
              <InputDropdown options={integrationList} {...register("type")} />
            </div>
            <div>
              <label className="block text-sm font-medium">Nome <span className="text-red-500">*</span></label>
              <InputText {...register("name", { required: true })} placeholder="Ex.: Canal de DevOps" />
            </div>
            <div>
              <label className="block text-sm font-medium">URL <span className="text-red-500">*</span></label>
              <InputText {...register("url", { required: true })} placeholder="https://..." />
            </div>
            <div className="flex justify-end space-x-2 mt-3">
              <Button severity="info" onClick={() => close()} type="button">Cancelar</Button>
              <Button severity="success" disabled={isSubmitting} type="submit">Salvar</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}