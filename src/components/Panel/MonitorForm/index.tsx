import InputCheckBox from '@/components/InputCheckbox';
import Loading from '@/components/Loading';
import { Alert } from '@/lib/Alert';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import MonitorService from '@/services/MonitorService';
import { MonitorTypeEnum, MonitorTypeLabelEnum } from '@/types/MonitorTypeEnum';
import { CheckIcon, EditIcon, TrashIcon } from 'lucide-react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
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

export default function MonitorForm(props: { monitor: IFormValues | null, onClose?: Function; }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const monitorTypeList = Object.keys(MonitorTypeEnum).map(t => ({ id: t, description: MonitorTypeLabelEnum[t as MonitorTypeEnum] }));

  const { register, handleSubmit, reset, setValue, watch } = useForm<IFormValues>(props.monitor ? {
    values: {
      id: props.monitor.id,
      name: props.monitor.name,
      type: props.monitor.type,
      address: props.monitor.address,
      active: props.monitor.active
    }
  } : {
    values: {
      id: "",
      name: "",
      type: "",
      address: "",
      active: true
    }
  });
  const { token } = useGlobalProvider();

  function close() {
    reset();
    setIsOpen(false);
  }

  async function onSubmit(form: IFormValues) {
    setIsSubmitting(true);

    try {
      let response = null;

      if (props.monitor) {
        response = await MonitorService.updateMonitor(token as string, props.monitor.id, {
          name: form.name,
          type: form.type,
          address: form.address,
          active: form.active
        })
      } else {
        response = await MonitorService.createMonitor(token as string, {
          name: form.name,
          type: form.type,
          address: form.address,
          active: form.active
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

  return (
    <>
      {isSubmitting && <Loading />}

      {props.monitor ? (
        <Button tooltip="Abrir" tooltipOptions={{ position: "left" }} text severity="info" onClick={() => setIsOpen(true)} type="button">
          <EditIcon height={14} width={14} />
        </Button>
      ) : (
        <Button label="Novo monitor" onClick={() => setIsOpen(true)} />
      )}

      <Dialog
        header={props.monitor ? "Editar Monitor" : "Novo Monitor"}
        visible={isOpen}
        style={{ width: "30rem" }}
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
            <label className="block text-sm">Tipo <span className="text-red-500">*</span></label>
            <Dropdown
              value={watch("type")}
              onChange={(option) => setValue("type", option.value)}
              options={monitorTypeList}
              optionLabel="description"
              optionValue="id"
              filter={true}
              itemTemplate={(option) => (
                <span>{option.description}</span>
              )}
              valueTemplate={(option) => (option == null ? <div>&#8203;</div> : <span>{option.description}</span> )}
              className="p-inputtext-sm"
            />
          </div>
          <div>
            <label className="block text-sm">Nome <span className="text-red-500">*</span></label>
            <InputText {...register("name", { required: true })} placeholder="Ex.: API de pagamentos" />
          </div>
          <div>
            <label className="block text-sm">Endereço <span className="text-red-500">*</span></label>
            <InputText {...register("address", { required: true })} placeholder="https://..." />
          </div>
          <div className="flex items-center space-x-1">
            <InputCheckBox {...register("active", { required: true })} />
            <label className="block text-sm">Ativo</label>
          </div>
          <div className="flex justify-end space-x-2 mt-5">
            {props.monitor && (
              <>
                <div>
                  <Button tooltip="Excluir" text severity="danger" onClick={() => handleDelete(props.monitor!.id!)} type="button">
                    <TrashIcon height={14} width={14} />
                  </Button>
                </div>
              </>
            )}
            <div>
              <Button tooltip="Confirmar" text severity="success" type="submit">
                <CheckIcon height={14} width={14} />
              </Button>
            </div>
          </div>
        </form>
      </Dialog >
    </>
  )
}