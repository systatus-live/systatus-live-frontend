import InputCheckBox from '@/components/InputCheckbox';
import Loading from '@/components/Loading';
import { Alert } from '@/lib/Alert';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import MonitorService from '@/services/MonitorService';
import { MonitorTypeEnum, MonitorTypeLabelEnum } from '@/types/MonitorTypeEnum';
import removeAccents from '@/utils/removeAccents';
import { Edit2Icon, EyeIcon, TrashIcon, XIcon } from 'lucide-react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type IFormValues = {
  id: string,
  name: string;
  type: string;
  address: string;
  active: boolean;
}

export default function EditMonitor(props: { monitor: IFormValues, onClose?: Function; showButton?: boolean }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const monitorTypeList = Object.keys(MonitorTypeEnum).map(t => ({ id: t, description: MonitorTypeLabelEnum[t as MonitorTypeEnum] }));

  const { register, handleSubmit, reset, setValue, getValues } = useForm<IFormValues>({
    values: {
      id: props.monitor.id,
      name: props.monitor.name,
      type: props.monitor.type,
      address: props.monitor.address,
      active: props.monitor.active
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
      const response = await MonitorService.updateMonitor(token as string, props.monitor.id, {
        name: form.name,
        type: form.type,
        address: form.address,
        active: form.active
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
    Alert.confirm("Excluir monitor", "O monitor será excluído permanentemente. Continuar?", async () => {
      setIsSubmitting(true);

      try {
        const response = await MonitorService.deleteMonitor(token as string, id);
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

  function getMonitorTypeList(search: string): Promise<any[]> {
    return new Promise((resolve) => {
      const list = monitorTypeList.filter(monitor => removeAccents(monitor.description.toLowerCase()).includes(removeAccents(search.toLowerCase())));
      resolve(list);
    })
  }

  return (
    <>
      {isSubmitting && <Loading />}

      {/* <Button title="Editar" severity="secondary" onClick={() => setShowModal(true)} style={{ padding: "0.25rem" }} outlined={true}>
        <EyeIcon height={12} width={12} />
      </Button> */}

      {showModal && (
        <div></div>
        // <Modal title="Editar Monitor">
        //   <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        //     <div>
        //       <label className="block text-sm font-medium">Tipo <span className="text-red-500">*</span></label>
        //       {/* <Finder
        //         code="id"
        //         label="description"
        //         options={() => getMonitorTypeList("")}
        //         onSearch={(value) => getMonitorTypeList(value)}
        //         onChange={(option) => setValue("type", option.id)}
        //         defaultValue={getValues("type")}
        //       /> */}
        //     </div>
        //     <div>
        //       <label className="block text-sm font-medium">Nome <span className="text-red-500">*</span></label>
        //       <InputText {...register("name", { required: true })} placeholder="Ex.: API de pagamentos" />
        //     </div>
        //     <div>
        //       <label className="block text-sm font-medium">Endereço <span className="text-red-500">*</span></label>
        //       <InputText {...register("address", { required: true })} placeholder="https://..." />
        //     </div>
        //     <div className="flex items-center space-x-1">
        //       <InputCheckBox {...register("active", { required: true })} />
        //       <label className="block text-sm font-medium">Ativo <span className="text-red-500">*</span></label>
        //     </div>
        //     <div className="flex justify-end space-x-2 mt-5">
        //       <Button title="Cancelar" severity="info" onClick={() => close()} type="button">
        //         <XIcon height={14} width={14} />
        //       </Button>
        //       <Button title="Excluir" severity="danger" onClick={() => handleDelete(props.monitor.id)} type="button">
        //         <TrashIcon height={14} width={14} />
        //       </Button>
        //       <Button severity="success" type="submit">Salvar</Button>
        //     </div>
        //   </form>
        // </Modal>
      )}
    </>
  )
}