import InputCheckBox from '@/components/InputCheckbox';
import Loading from '@/components/Loading';
import { Alert } from '@/lib/Alert';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import MonitorService from '@/services/MonitorService';
import { MonitorTypeEnum, MonitorTypeLabelEnum } from '@/types/MonitorTypeEnum';
import removeAccents from '@/utils/removeAccents';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type IFormValues = {
  name: string;
  type: string;
  address: string;
  active: boolean;
}

export default function NewMonitor(props: { onClose?: Function; }) {
  const [isSubmitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const monitorTypeList = Object.keys(MonitorTypeEnum).map(t => ({ id: t, description: MonitorTypeLabelEnum[t as MonitorTypeEnum] }));

  const { register, handleSubmit, reset, setValue } = useForm<IFormValues>();
  const { token } = useGlobalProvider();

  useEffect(() => {
    setValue("active", true);

    return () => { };
  }, []);

  function close() {
    reset({
      active: true
    });
    setShowModal(false);
  }

  async function onSubmit(form: IFormValues) {
    setSubmitting(true);

    try {
      const response = await MonitorService.createMonitor(token as string, {
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
      setSubmitting(false);
    }
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

      {/* <Button severity="secondary" onClick={() => setShowModal(true)}>Novo Monitor</Button> */}

      {showModal && (
        <div></div>
        // <Modal title="Novo Monitor">
        //   <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        //     <div>
        //       <label className="block text-sm font-medium">Tipo <span className="text-red-500">*</span></label>
        //       {/* <Finder
        //         code="id"
        //         label="description"
        //         options={() => getMonitorTypeList("")}
        //         onSearch={(value) => getMonitorTypeList(value)}
        //         onChange={(option) => setValue("type", option.id)}
        //         defaultValue={monitorTypeList[0].id}
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
        //       {/* <Button severity="info" onClick={() => close()} type="button">Cancelar</Button>
        //       <Button severity="success" type="submit">Salvar</Button> */}
        //     </div>
        //   </form>
        // </Modal>
      )}
    </>
  )
}