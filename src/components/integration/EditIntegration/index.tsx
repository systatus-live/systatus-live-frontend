import Button from '@/components/Button';
import InputDropdown from '@/components/InputDropdown';
import InputText from '@/components/InputText';
import Modal from '@/components/Modal';
import InputDropdownOption from '@/enums/InputDropdownOption';
import { IntegrationTypeEnum, IntegrationTypeLabelEnum } from '@/enums/IntegrationTypeEnum';
import { Alert } from '@/lib/Alert';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import IntegrationService from '@/services/IntegrationService';
import { EditIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface IFormValues {
  id: string,
  type: IntegrationTypeEnum;
  name: string;
  url: string
}

export default function EditIntegration(props: { integration: IFormValues, onClose?: Function; }) {
  const [isSubmitting, setSubmitting] = useState(false);
  const [integrationList, setIntegrationList] = useState<InputDropdownOption[]>([]);
  const [showModal, setShowModal] = useState(false);

  const { register, handleSubmit, reset } = useForm<IFormValues>({
    values: {
      id: props.integration.id,
      type: props.integration.type,
      name: props.integration.name,
      url: props.integration.url
    }
  });
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
      const response = await IntegrationService.updateIntegration(token as string, props.integration.id, {
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
      <Button title="Editar" severity="secondary" outlined={true} onClick={() => setShowModal(true)} style={{ padding: "0.25rem" }}>
        <EditIcon height={12} width={12} />
      </Button>

      {showModal && (
        <Modal title="Editar Integração">
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
              <Button severity="info" disabled={isSubmitting} onClick={() => close()} type="button">Cancelar</Button>
              <Button severity="success" disabled={isSubmitting} type="submit">Salvar</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}